"""
apps.teachers.serializers
~~~~~~~~~~~~~~~~~~~~~~~~~~
All serializers for the teachers app.

Split strictly by direction:
  Input  — plain Serializer subclasses that validate incoming data.
  Output — ModelSerializer subclasses that shape read responses.

All user-facing validation error messages are in Persian.
"""

from __future__ import annotations

from rest_framework import serializers

from apps.teachers.models import AvailabilitySlot, Skill, TeacherSkill


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

_VALID_WEEKDAYS = {c[0] for c in AvailabilitySlot.Weekday.choices}
_VALID_LEVELS = {c[0] for c in TeacherSkill.Level.choices}


def _validate_weekday(value: int) -> int:
    if value not in _VALID_WEEKDAYS:
        raise serializers.ValidationError(
            f"روز هفته باید یکی از مقادیر {sorted(_VALID_WEEKDAYS)} باشد."
        )
    return value


# ===========================================================================
# Skill catalog
# ===========================================================================


class SkillSerializer(serializers.ModelSerializer):
    """Read-only output for a single Skill (used in lists and nested fields)."""

    class Meta:
        model = Skill
        fields = ["id", "name", "slug", "description", "is_active"]
        read_only_fields = fields


# ===========================================================================
# TeacherSkill
# ===========================================================================


class TeacherSkillOutputSerializer(serializers.ModelSerializer):
    """
    Read-only representation of a TeacherSkill.
    Used in both the teacher's own management views and public discovery.
    """

    skill = SkillSerializer(read_only=True)
    level_display = serializers.CharField(source="get_level_display", read_only=True)
    effective_price = serializers.SerializerMethodField()

    class Meta:
        model = TeacherSkill
        fields = [
            "id",
            "skill",
            "level",
            "level_display",
            "years_of_experience",
            "price_override",
            "effective_price",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_effective_price(self, obj: TeacherSkill):
        """
        Return the price a student will be charged for a session
        with this teacher on this skill.

        Resolution order:
          1. TeacherSkill.price_override  (if set)
          2. TeacherProfile.hourly_rate   (fallback)
        """
        if obj.price_override is not None:
            return str(obj.price_override)
        try:
            return str(obj.teacher.hourly_rate)
        except Exception:
            return None


class TeacherSkillCreateSerializer(serializers.Serializer):
    """Input: teacher adds a new skill offering."""

    skill_id = serializers.UUIDField()
    level = serializers.ChoiceField(choices=TeacherSkill.Level.choices)
    years_of_experience = serializers.IntegerField(min_value=0, max_value=50, default=0)
    price_override = serializers.DecimalField(
        max_digits=8,
        decimal_places=2,
        min_value=0,
        required=False,
        allow_null=True,
    )

    def validate_skill_id(self, value):
        from apps.teachers.models import Skill

        try:
            return Skill.objects.get(pk=value, is_active=True)
        except Skill.DoesNotExist:
            raise serializers.ValidationError(
                "مهارت انتخاب‌شده یافت نشد یا غیرفعال است."
            )


class TeacherSkillUpdateSerializer(serializers.Serializer):
    """Input: teacher updates an existing skill offering (all fields optional)."""

    level = serializers.ChoiceField(
        choices=TeacherSkill.Level.choices,
        required=False,
    )
    years_of_experience = serializers.IntegerField(
        min_value=0,
        max_value=50,
        required=False,
    )
    price_override = serializers.DecimalField(
        max_digits=8,
        decimal_places=2,
        min_value=0,
        required=False,
        allow_null=True,
    )
    is_active = serializers.BooleanField(required=False)


# ===========================================================================
# AvailabilitySlot
# ===========================================================================


class AvailabilitySlotOutputSerializer(serializers.ModelSerializer):
    """Read-only representation of a single AvailabilitySlot."""

    weekday_display = serializers.CharField(
        source="get_weekday_display", read_only=True
    )

    class Meta:
        model = AvailabilitySlot
        fields = [
            "id",
            "weekday",
            "weekday_display",
            "start_time",
            "end_time",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class AvailabilitySlotCreateSerializer(serializers.Serializer):
    """Input: teacher adds a single recurring slot."""

    weekday = serializers.IntegerField(min_value=0, max_value=6)
    start_time = serializers.TimeField(
        format="%H:%M", input_formats=["%H:%M", "%H:%M:%S"]
    )
    end_time = serializers.TimeField(
        format="%H:%M", input_formats=["%H:%M", "%H:%M:%S"]
    )

    def validate_weekday(self, value: int) -> int:
        return _validate_weekday(value)

    def validate(self, attrs: dict) -> dict:
        if attrs["end_time"] <= attrs["start_time"]:
            raise serializers.ValidationError(
                {"end_time": "زمان پایان باید بعد از زمان شروع باشد."}
            )
        return attrs


class AvailabilitySlotUpdateSerializer(serializers.Serializer):
    """Input: teacher updates an existing slot (all fields optional)."""

    weekday = serializers.IntegerField(min_value=0, max_value=6, required=False)
    start_time = serializers.TimeField(
        format="%H:%M",
        input_formats=["%H:%M", "%H:%M:%S"],
        required=False,
    )
    end_time = serializers.TimeField(
        format="%H:%M",
        input_formats=["%H:%M", "%H:%M:%S"],
        required=False,
    )

    def validate_weekday(self, value: int) -> int:
        return _validate_weekday(value)

    def validate(self, attrs: dict) -> dict:
        start = attrs.get("start_time")
        end = attrs.get("end_time")
        if start and end and end <= start:
            raise serializers.ValidationError(
                {"end_time": "زمان پایان باید بعد از زمان شروع باشد."}
            )
        return attrs


class BulkAvailabilitySlotSerializer(serializers.Serializer):
    """
    Input: teacher replaces their entire weekly schedule in one request.

    Wraps a list of slot entries and validates them as a collection.
    """

    slots = serializers.ListField(
        child=AvailabilitySlotCreateSerializer(),
        min_length=0,
        max_length=50,
        help_text="List of availability slots to replace the current schedule.",
    )

    def validate_slots(self, value: list) -> list:
        if not value:
            return value
        by_weekday: dict[int, list] = {}
        for slot in value:
            by_weekday.setdefault(slot["weekday"], []).append(slot)

        for weekday, entries in by_weekday.items():
            sorted_entries = sorted(entries, key=lambda e: e["start_time"])
            for i in range(len(sorted_entries) - 1):
                a = sorted_entries[i]
                b = sorted_entries[i + 1]
                if b["start_time"] < a["end_time"]:
                    raise serializers.ValidationError(
                        f"اسلات‌های روز {weekday} با هم تداخل دارند: "
                        f"{a['start_time']}–{a['end_time']} "
                        f"و {b['start_time']}–{b['end_time']}."
                    )
        return value


# ===========================================================================
# Teacher public profile (discovery)
# ===========================================================================


class TeacherPublicProfileSerializer(serializers.Serializer):
    """
    Read-only public representation of a teacher for student discovery.
    Composed from TeacherProfile + related objects.

    Uses Prefetch to_attr fields ('active_skills', 'slots') set by
    teacher_service.search_teachers() and get_teacher_public_profile().
    """

    id = serializers.UUIDField(source="pk", read_only=True)
    full_name = serializers.SerializerMethodField()
    bio = serializers.CharField(read_only=True)
    hourly_rate = serializers.DecimalField(
        max_digits=8,
        decimal_places=2,
        read_only=True,
    )
    currency = serializers.CharField(read_only=True)
    rating = serializers.DecimalField(
        max_digits=3,
        decimal_places=2,
        read_only=True,
        allow_null=True,
    )
    is_verified = serializers.BooleanField(read_only=True)
    timezone = serializers.CharField(read_only=True)
    skills = serializers.SerializerMethodField()
    availability = serializers.SerializerMethodField()

    def get_full_name(self, obj) -> str:
        return obj.user.get_full_name()

    def get_skills(self, obj) -> list:
        active_skills = getattr(obj, "active_skills", None)
        if active_skills is None:
            active_skills = obj.teacher_skills.filter(is_active=True).select_related(
                "skill"
            )
        return TeacherSkillOutputSerializer(active_skills, many=True).data

    def get_availability(self, obj) -> list:
        slots = getattr(obj, "slots", None)
        if slots is None:
            slots = obj.availability_slots.order_by("weekday", "start_time")
        return AvailabilitySlotOutputSerializer(slots, many=True).data


# ===========================================================================
# Teacher discovery filter input
# ===========================================================================


class TeacherSearchQuerySerializer(serializers.Serializer):
    """
    Validates and normalises query parameters for the teacher search endpoint.
    This is an input-only serializer bound from request.query_params.
    """

    skill = serializers.SlugField(required=False, allow_blank=True)
    name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    weekday = serializers.IntegerField(required=False, min_value=0, max_value=6)
    min_rating = serializers.DecimalField(
        required=False,
        max_digits=3,
        decimal_places=2,
        min_value=0,
        max_value=5,
    )
    max_rate = serializers.DecimalField(
        required=False,
        max_digits=8,
        decimal_places=2,
        min_value=0,
    )
