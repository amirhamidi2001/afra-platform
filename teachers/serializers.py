import json

from django.db import transaction
from rest_framework import serializers

from accounts.models import TeacherProfile, User
from .models import SessionRequest


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

TEACHING_METHOD_MAP = {
    "آنلاین": "online",
    "حضوری": "offline",
    "هر دو": "both",
}

TEACHING_METHOD_DISPLAY = {v: k for k, v in TEACHING_METHOD_MAP.items()}


def _parse_json_field(value):
    """Normalizes incoming data for list-based fields."""
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return parsed
        except (json.JSONDecodeError, ValueError):
            pass
    return []


# ---------------------------------------------------------------------------
# TeacherApplySerializer
# ---------------------------------------------------------------------------


class TeacherApplySerializer(serializers.ModelSerializer):
    """
    Handles teacher profile creation/update during application.
    """

    method = serializers.ChoiceField(
        choices=list(TEACHING_METHOD_MAP.keys()),
        write_only=True,
        required=False,
    )
    trial = serializers.BooleanField(write_only=True, required=False, default=False)
    levels = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )
    available_times = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = TeacherProfile
        fields = [
            "bio",
            "subject",
            "experience",
            "price",
            "city",
            "capacity",
            "avatar",
            "levels",
            "available_times",
            # write-only aliases
            "method",
            "trial",
        ]

    def to_internal_value(self, data):
        """Overrides default input parsing behavior."""
        mutable = data.copy() if hasattr(data, "copy") else dict(data)

        for field_name in ("levels", "available_times"):
            if field_name in mutable:
                mutable[field_name] = _parse_json_field(mutable[field_name])

        return super().to_internal_value(mutable)

    def validate_price(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("قیمت نمی‌تواند منفی باشد.")
        return value

    def validate_capacity(self, value):
        if value is not None and value < 1:
            raise serializers.ValidationError("ظرفیت باید حداقل ۱ باشد.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user

        method_fa = validated_data.pop("method", "آنلاین")
        trial = validated_data.pop("trial", False)

        profile, _ = TeacherProfile.objects.update_or_create(
            user=user,
            defaults={
                **validated_data,
                "teaching_method": TEACHING_METHOD_MAP.get(method_fa, "online"),
                "trial_session": trial,
                "approved": False,
            },
        )

        user.role = "teacher"
        if validated_data.get("city"):
            user.save(update_fields=["role"])
        else:
            user.save(update_fields=["role"])

        return profile


# ---------------------------------------------------------------------------
# TeacherListSerializer
# ---------------------------------------------------------------------------


class TeacherListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for teacher listing endpoint.
    """

    full_name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = TeacherProfile
        fields = [
            "id",
            "full_name",
            "subject",
            "city",
            "price",
            "rating",
            "trial_session",
            "teaching_method",
            "levels",
            "avatar_url",
        ]

    def get_full_name(self, obj):
        return obj.user.full_name or obj.user.username

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None


# ---------------------------------------------------------------------------
# TeacherDetailSerializer
# ---------------------------------------------------------------------------


class TeacherUserSerializer(serializers.ModelSerializer):
    """
    Nested serializer exposing limited user data.
    """

    class Meta:
        model = User
        fields = ["id", "username", "full_name", "email", "gender"]


class TeacherDetailSerializer(serializers.ModelSerializer):
    """
    Detailed view of teacher profile.
    """

    user = TeacherUserSerializer(read_only=True)
    avatar_url = serializers.SerializerMethodField()
    teaching_method_display = serializers.SerializerMethodField()

    class Meta:
        model = TeacherProfile
        fields = [
            "id",
            "user",
            "bio",
            "subject",
            "experience",
            "price",
            "city",
            "rating",
            "capacity",
            "trial_session",
            "teaching_method",
            "teaching_method_display",
            "levels",
            "available_times",
            "avatar_url",
            "created_at",
        ]

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_teaching_method_display(self, obj):
        return TEACHING_METHOD_DISPLAY.get(obj.teaching_method, obj.teaching_method)


# ---------------------------------------------------------------------------
# SessionRequestSerializer
# ---------------------------------------------------------------------------


class SessionRequestSerializer(serializers.ModelSerializer):
    """
    Handles student session booking logic.
    """

    teacher_id = serializers.IntegerField(write_only=True)
    teacher_name = serializers.SerializerMethodField(read_only=True)
    student_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SessionRequest
        fields = [
            "id",
            "teacher_id",
            "teacher_name",
            "student_name",
            "message",
            "preferred_times",
            "status",
            "created_at",
        ]
        read_only_fields = ["status", "created_at"]

    def get_teacher_name(self, obj):
        return str(obj.teacher_profile)

    def get_student_name(self, obj):
        return obj.student.full_name or obj.student.username

    def validate_teacher_id(self, value):
        try:
            teacher = TeacherProfile.objects.get(pk=value, approved=True)
        except TeacherProfile.DoesNotExist:
            raise serializers.ValidationError(
                "معلم مورد نظر یافت نشد یا تأیید نشده است."
            )
        self._teacher = teacher
        return value

    def validate(self, attrs):
        student = self.context["request"].user
        teacher = self._teacher

        if teacher.user == student:
            raise serializers.ValidationError(
                "شما نمی‌توانید به خودتان درخواست بفرستید."
            )

        if SessionRequest.objects.filter(
            student=student, teacher_profile=teacher, status="pending"
        ).exists():
            raise serializers.ValidationError(
                "شما قبلاً یک درخواست در انتظار برای این معلم دارید."
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        teacher_id = validated_data.pop("teacher_id")
        return SessionRequest.objects.create(
            student=self.context["request"].user,
            teacher_profile=self._teacher,
            **validated_data,
        )
