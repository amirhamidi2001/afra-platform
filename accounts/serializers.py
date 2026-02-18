from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import TeacherProfile, OTPVerification
from django.utils import timezone
from datetime import timedelta
import random

User = get_user_model()


class TeacherProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the teacher profile
    """

    class Meta:
        model = TeacherProfile
        fields = [
            "id",
            "bio",
            "subject",
            "experience",
            "price",
            "approved",
            "rating",
            "city",
            "avatar",
            "teaching_method",
            "capacity",
            "trial_session",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "approved", "rating", "created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying user information
    """

    teacher_profile = TeacherProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "role",
            "phone",
            "gender",
            "email_verified",
            "teacher_profile",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class SignupSerializer(serializers.ModelSerializer):
    """
    Serializer for registering a new user
    """

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        label="تکرار رمز عبور",
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "password2",
            "full_name",
            "role",
            "phone",
            "gender",
        ]
        extra_kwargs = {
            "email": {"required": True},
            "full_name": {"required": True},
        }

    def validate(self, attrs):
        """
        Validation of input data
        """
        # Check password match
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "رمز عبور و تکرار آن یکسان نیست"}
            )

        # Check if email is unique
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "این ایمیل قبلاً ثبت شده است"})

        # Check email verification.
        email = attrs.get("email")
        if not OTPVerification.objects.filter(email=email, is_verified=True).exists():
            raise serializers.ValidationError(
                {"email": "لطفاً ابتدا ایمیل خود را تأیید کنید"}
            )

        return attrs

    def create(self, validated_data):
        """
        Create a new user
        """
        # Remove password2 from the data
        validated_data.pop("password2")

        # Extract password
        password = validated_data.pop("password")

        # Mark email as verified
        validated_data["email_verified"] = True

        # Create user
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        # If the role is teacher, create teacher profile
        if user.role == "teacher":
            TeacherProfile.objects.create(
                user=user,
                bio="",
                subject="",
                experience="",
                price=None,
                approved=False,
                rating=0.00,
            )

        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """

    username = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True, write_only=True, style={"input_type": "password"}
    )

    def validate(self, attrs):
        """
        Validation of login information.
        """
        from django.contrib.auth import authenticate

        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("نام کاربری یا رمز عبور نادرست است")

        if not user.is_active:
            raise serializers.ValidationError("این حساب کاربری غیرفعال است")

        attrs["user"] = user
        return attrs


class SendOTPSerializer(serializers.Serializer):
    """
    Serializer for sending verification code
    """

    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """
        Check if the email is valid
        """
        # Check that the email is not duplicated during registration
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("این ایمیل قبلاً ثبت شده است")
        return value

    def create(self, validated_data):
        """
        Generate OTP code
        """
        email = validated_data["email"]

        # Remove previous codes for this email
        OTPVerification.objects.filter(email=email).delete()

        # Generate 6-digit code
        otp_code = str(random.randint(100000, 999999))

        # Create new record
        otp = OTPVerification.objects.create(
            email=email,
            otp_code=otp_code,
            expires_at=timezone.now() + timedelta(minutes=10),
        )

        return otp


class VerifyOTPSerializer(serializers.Serializer):
    """
    Serializer for OTP code verification
    """

    email = serializers.EmailField(required=True)
    otp_code = serializers.CharField(required=True, max_length=6)

    def validate(self, attrs):
        """
        Validate OTP code
        """
        email = attrs.get("email")
        otp_code = attrs.get("otp_code")

        try:
            otp = OTPVerification.objects.filter(email=email, otp_code=otp_code).latest(
                "created_at"
            )

            if otp.is_expired():
                raise serializers.ValidationError(
                    {"otp_code": "کد تأیید منقضی شده است"}
                )

            if otp.is_verified:
                raise serializers.ValidationError(
                    {"otp_code": "این کد قبلاً استفاده شده است"}
                )

            attrs["otp"] = otp

        except OTPVerification.DoesNotExist:
            raise serializers.ValidationError({"otp_code": "کد تأیید نادرست است"})

        return attrs
