import uuid

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from rest_framework import serializers

User = get_user_model()


def validate_password_fa(value: str) -> None:
    try:
        validate_password(password=value)
    except DjangoValidationError as e:
        custom_errors = []
        for message in e.messages:
            msg_lower = message.lower()
            if "too common" in msg_lower:
                custom_errors.append(
                    "این رمز عبور بسیار رایج است. لطفاً رمز پیچیده‌تری انتخاب کنید."
                )
            elif "too short" in msg_lower:
                custom_errors.append(
                    "رمز عبور بسیار کوتاه است (حداقل باید ۸ کاراکتر باشد)."
                )
            elif "entirely numeric" in msg_lower:
                custom_errors.append("رمز عبور نمی‌تواند کاملاً عددی باشد.")
            elif "too similar" in msg_lower:
                custom_errors.append(
                    "رمز عبور نباید با اطلاعات کاربری (مانند ایمیل) مشابه باشد."
                )
            else:
                custom_errors.append(message)
        raise serializers.ValidationError(custom_errors)


# ── User representation ───────────────────────────────────────────────────────


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "user_type",
            "email_verified",
            "created_at",
        ]
        read_only_fields = fields

    def get_full_name(self, obj: User) -> str:
        return obj.get_full_name()


# ── Register ──────────────────────────────────────────────────────────────────


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password_fa],
        style={"input_type": "password"},
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
            "user_type",
        ]
        extra_kwargs = {
            "user_type": {"default": User.UserType.Student},
        }

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("این ایمیل قبلاً ثبت شده است.")
        return value.lower()

    def validate(self, attrs: dict) -> dict:
        if attrs["password"] != attrs.pop("confirm_password"):
            raise serializers.ValidationError(
                {"confirm_password": "رمز عبور و تکرار آن مطابقت ندارند."}
            )
        return attrs

    def create(self, validated_data: dict) -> User:
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            user_type=validated_data.get("user_type", User.UserType.Student),
            is_active=False,
        )


# ── Login ─────────────────────────────────────────────────────────────────────


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, attrs: dict) -> dict:
        user: User | None = authenticate(
            request=self.context.get("request"),
            email=attrs["email"].lower(),
            password=attrs["password"],
        )

        if user is None:
            # Try fetching user to give a more specific error
            try:
                db_user = User.objects.get(email__iexact=attrs["email"])
                if not db_user.is_active:
                    raise serializers.ValidationError(
                        {
                            "non_field_errors": "حساب کاربری شما هنوز فعال نشده است. لطفاً ایمیل خود را تأیید کنید."
                        }
                    )
            except User.DoesNotExist:
                pass
            raise serializers.ValidationError(
                {"non_field_errors": "ایمیل یا رمز عبور اشتباه است."}
            )

        attrs["user"] = user
        return attrs


# ── Change password ───────────────────────────────────────────────────────────


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password_fa],
        style={"input_type": "password"},
    )
    confirm_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    def validate_current_password(self, value: str) -> str:
        user: User = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("رمز عبور فعلی اشتباه است.")
        return value

    def validate(self, attrs: dict) -> dict:
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "رمز عبور جدید و تکرار آن مطابقت ندارند."}
            )
        if attrs.get("current_password") == attrs["new_password"]:
            raise serializers.ValidationError(
                {"new_password": "رمز عبور جدید نباید با رمز عبور فعلی یکسان باشد."}
            )
        return attrs


# ── Forgot / Reset password ───────────────────────────────────────────────────


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    # We do NOT raise an error when email doesn't exist — prevents user enumeration.
    def validate_email(self, value: str) -> str:
        return value.lower()


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password_fa],
        style={"input_type": "password"},
    )
    confirm_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    def validate(self, attrs: dict) -> dict:
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "رمز عبور جدید و تکرار آن مطابقت ندارند."}
            )

        try:
            user = User.objects.get(password_reset_token=attrs["token"])
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"token": "توکن نامعتبر یا منقضی شده است."}
            )

        if user.password_reset_token_created_at:
            expiry = user.password_reset_token_created_at + timezone.timedelta(hours=24)
            if timezone.now() > expiry:
                raise serializers.ValidationError(
                    {
                        "token": "توکن منقضی شده است. لطفاً مجدداً درخواست بازنشانی رمز عبور دهید."
                    }
                )

        attrs["user"] = user
        return attrs


# ── Email verification ────────────────────────────────────────────────────────


class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.UUIDField()

    def validate_token(self, value: uuid.UUID) -> uuid.UUID:
        try:
            user = User.objects.get(email_verification_token=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("توکن تأیید ایمیل نامعتبر است.")

        if user.email_verified:
            raise serializers.ValidationError("ایمیل شما قبلاً تأیید شده است.")

        return value


# ── Google OAuth ──────────────────────────────────────────────────────────────


class GoogleTokenSerializer(serializers.Serializer):
    credential = serializers.CharField(
        help_text="Google ID Token (JWT) obtained from Google OAuth2 popup."
    )
