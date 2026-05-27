import uuid
import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)

from .serializers import (
    ChangePasswordSerializer,
    EmailVerificationSerializer,
    ForgotPasswordSerializer,
    GoogleTokenSerializer,
    LoginSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserSerializer,
)
from .email_helpers import _send_verification_email, _send_password_reset_email

User = get_user_model()
logger = logging.getLogger(__name__)


# ── Helpers ───────────────────────────────────────────────────────────────────


def _get_tokens(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def _blacklist_all_user_tokens(user: User) -> None:
    """Invalidate every outstanding token for a user (e.g., after password change)."""
    for token in OutstandingToken.objects.filter(user=user):
        BlacklistedToken.objects.get_or_create(token=token)


# ── Views ─────────────────────────────────────────────────────────────────────


class RegisterView(APIView):
    """POST /api/accounts/register/"""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"خطاها": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user: User = serializer.save()
        _send_verification_email(user)
        return Response(
            {
                "پیام": "ثبت‌نام با موفقیت انجام شد. لطفاً ایمیل خود را برای فعال‌سازی حساب تأیید کنید."
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """POST /api/accounts/login/"""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return Response(
                {"خطاها": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user: User = serializer.validated_data["user"]
        return Response(
            {
                "پیام": "ورود با موفقیت انجام شد.",
                "توکن": _get_tokens(user),
                "کاربر": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    """POST /api/accounts/logout/  — blacklists the supplied refresh token."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"پیام": "توکن refresh الزامی است."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"پیام": "خروج با موفقیت انجام شد."}, status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"پیام": "توکن نامعتبر یا قبلاً باطل شده است."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class MeView(APIView):
    """GET /api/accounts/me/  — returns the authenticated user's profile."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class EmailVerificationView(APIView):
    """POST /api/accounts/verify-email/"""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = EmailVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"پیام": "توکن نامعتبر است.", "خطاها": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user: User = User.objects.get(
            email_verification_token=serializer.validated_data["token"]
        )
        user.email_verified = True
        user.is_active = True
        user.save(update_fields=["email_verified", "is_active"])
        return Response(
            {"پیام": "ایمیل شما با موفقیت تأیید شد. اکنون می‌توانید وارد شوید."},
            status=status.HTTP_200_OK,
        )


class ResendVerificationEmailView(APIView):
    """POST /api/accounts/resend-verification/"""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        email = request.data.get("email", "").lower()
        # Always return 200 to prevent email enumeration
        try:
            user = User.objects.get(email=email)
            if not user.email_verified:
                user.email_verification_token = uuid.uuid4()
                user.save(update_fields=["email_verification_token"])
                _send_verification_email(user)
        except User.DoesNotExist:
            pass
        return Response(
            {
                "پیام": "اگر ایمیل شما در سیستم وجود داشته باشد و تأیید نشده باشد، لینک فعال‌سازی ارسال خواهد شد."
            },
            status=status.HTTP_200_OK,
        )


class ChangePasswordView(APIView):
    """POST /api/accounts/change-password/"""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return Response(
                {"خطاها": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user: User = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        _blacklist_all_user_tokens(user)
        return Response(
            {"پیام": "رمز عبور با موفقیت تغییر کرد. لطفاً مجدداً وارد شوید."},
            status=status.HTTP_200_OK,
        )


class ForgotPasswordView(APIView):
    """POST /api/accounts/forgot-password/"""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"خطاها": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        email: str = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
            token = uuid.uuid4()
            user.password_reset_token = token
            user.password_reset_token_created_at = timezone.now()
            user.save(
                update_fields=[
                    "password_reset_token",
                    "password_reset_token_created_at",
                ]
            )
            _send_password_reset_email(user, token)
        except User.DoesNotExist:
            pass  # Silent — prevents email enumeration
        return Response(
            {
                "پیام": "اگر ایمیل شما در سیستم وجود داشته باشد، لینک بازنشانی رمز عبور ارسال خواهد شد."
            },
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    """POST /api/accounts/reset-password/"""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"خطاها": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user: User = serializer.validated_data["user"]
        user.set_password(serializer.validated_data["new_password"])
        user.password_reset_token = None
        user.password_reset_token_created_at = None
        user.save(
            update_fields=[
                "password",
                "password_reset_token",
                "password_reset_token_created_at",
            ]
        )
        return Response(
            {
                "پیام": "رمز عبور با موفقیت تغییر کرد. اکنون می‌توانید با رمز عبور جدید وارد شوید."
            },
            status=status.HTTP_200_OK,
        )


class GoogleTokenAuthView(APIView):
    """
    POST /api/accounts/google/
    Accepts a Google ID Token (from @react-oauth/google),
    verifies it, and returns our own JWT pair.
    """

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = GoogleTokenSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"پیام": "توکن گوگل الزامی است.", "خطاها": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        credential: str = serializer.validated_data["credential"]

        try:
            from google.auth.transport import requests as google_requests
            from google.oauth2 import id_token as google_id_token

            idinfo = google_id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except ValueError:
            return Response(
                {"پیام": "توکن گوگل نامعتبر یا منقضی شده است."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.exception("Google token verification failed.")
            return Response(
                {"پیام": "خطا در اعتبارسنجی توکن گوگل. لطفاً مجدداً تلاش کنید."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        email: str = idinfo.get("email", "").lower()
        first_name: str = idinfo.get("given_name", "")
        last_name: str = idinfo.get("family_name", "")
        email_verified: bool = idinfo.get("email_verified", False)

        if not email or not email_verified:
            return Response(
                {"پیام": "ایمیل گوگل تأیید نشده است."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "is_active": True,
                "email_verified": True,
                "user_type": User.UserType.Student,
            },
        )

        if not created:
            updated_fields = []
            if not user.is_active:
                user.is_active = True
                updated_fields.append("is_active")
            if not user.email_verified:
                user.email_verified = True
                updated_fields.append("email_verified")
            if updated_fields:
                user.save(update_fields=updated_fields)

        return Response(
            {
                "پیام": "ورود با گوگل با موفقیت انجام شد.",
                "توکن": _get_tokens(user),
                "کاربر": UserSerializer(user).data,
                "حساب_جدید": created,
            },
            status=status.HTTP_200_OK,
        )
