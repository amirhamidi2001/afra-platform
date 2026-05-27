import uuid
import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

User = get_user_model()
logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
#  Shared helper
# ─────────────────────────────────────────────────────────────────────────────


def _base_email_context(user: User) -> dict:
    """Fields common to every email template."""
    return {
        "full_name": user.get_full_name() or user.email,
        "user_email": user.email,
        "frontend_url": getattr(settings, "FRONTEND_URL", "http://localhost:5173"),
        "current_year": timezone.now().year,
        "platform_name": getattr(settings, "PLATFORM_NAME", "پلتفرم آموزشی افرا"),
    }


# ─────────────────────────────────────────────────────────────────────────────
#  Email verification
# ─────────────────────────────────────────────────────────────────────────────


def _send_verification_email(user: User) -> None:
    """
    Sends an HTML + plain-text email with an account-verification link.

    Template  : accounts/emails/verification_email.html
    Subject   : تأیید آدرس ایمیل حساب کاربری
    """
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
    verify_url = f"{frontend_url}/verify-email/{user.email_verification_token}"

    context = {
        **_base_email_context(user),
        "verify_url": verify_url,
    }

    # ── Render templates ──────────────────────────────────────────────────
    html_body = render_to_string("accounts/emails/verification_email.html", context)

    plain_body = (
        f"سلام {context['full_name']}،\n\n"
        f"از ثبت‌نام شما در {context['platform_name']} سپاسگزاریم.\n\n"
        f"برای فعال‌سازی حساب کاربری خود روی لینک زیر کلیک کنید:\n"
        f"{verify_url}\n\n"
        f"این لینک ۲۴ ساعت اعتبار دارد.\n\n"
        f"اگر این درخواست از طرف شما نبوده، این ایمیل را نادیده بگیرید.\n\n"
        f"---\n{context['platform_name']}"
    )

    # ── Send ──────────────────────────────────────────────────────────────
    try:
        msg = EmailMultiAlternatives(
            subject=f"تأیید آدرس ایمیل — {context['platform_name']}",
            body=plain_body,  # plain-text fallback
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
            reply_to=[settings.DEFAULT_FROM_EMAIL],
        )
        msg.attach_alternative(html_body, "text/html")  # attach HTML version
        msg.send(fail_silently=False)

        logger.info("Verification email sent → %s", user.email)

    except Exception:
        logger.exception("Failed to send verification email to %s", user.email)


# ─────────────────────────────────────────────────────────────────────────────
#  Password reset
# ─────────────────────────────────────────────────────────────────────────────


def _send_password_reset_email(user: User, token: uuid.UUID) -> None:
    """
    Sends an HTML + plain-text email with a password-reset link.

    Template  : accounts/emails/password_reset_email.html
    Subject   : بازنشانی رمز عبور
    """
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
    reset_url = f"{frontend_url}/reset-password/{token}"

    context = {
        **_base_email_context(user),
        "reset_url": reset_url,
    }

    # ── Render templates ──────────────────────────────────────────────────
    html_body = render_to_string("accounts/emails/password_reset_email.html", context)

    plain_body = (
        f"سلام {context['full_name']}،\n\n"
        f"یک درخواست برای بازنشانی رمز عبور دریافت کردیم.\n\n"
        f"برای بازنشانی رمز عبور خود روی لینک زیر کلیک کنید:\n"
        f"{reset_url}\n\n"
        f"این لینک ۲۴ ساعت اعتبار دارد و تنها یک بار قابل استفاده است.\n\n"
        f"اگر این درخواست از طرف شما نبوده، این ایمیل را نادیده بگیرید.\n"
        f"رمز عبور شما تغییری نخواهد کرد.\n\n"
        f"---\n{context['platform_name']}"
    )

    # ── Send ──────────────────────────────────────────────────────────────
    try:
        msg = EmailMultiAlternatives(
            subject=f"بازنشانی رمز عبور — {context['platform_name']}",
            body=plain_body,  # plain-text fallback
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
            reply_to=[settings.DEFAULT_FROM_EMAIL],
        )
        msg.attach_alternative(html_body, "text/html")  # attach HTML version
        msg.send(fail_silently=False)

        logger.info("Password-reset email sent → %s", user.email)

    except Exception:
        logger.exception("Failed to send password-reset email to %s", user.email)
