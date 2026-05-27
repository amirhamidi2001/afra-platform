from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

app_name = "accounts"

urlpatterns = [
    # ── Registration & activation ─────────────────────────────────────────────
    path("register/", views.RegisterView.as_view(), name="register"),
    path("verify-email/", views.EmailVerificationView.as_view(), name="verify_email"),
    path(
        "resend-verification/",
        views.ResendVerificationEmailView.as_view(),
        name="resend_verification",
    ),
    # ── Session ───────────────────────────────────────────────────────────────
    path("login/", views.LoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("me/", views.MeView.as_view(), name="me"),
    # ── JWT token management ──────────────────────────────────────────────────
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # ── Password management ───────────────────────────────────────────────────
    path(
        "change-password/", views.ChangePasswordView.as_view(), name="change_password"
    ),
    path(
        "forgot-password/", views.ForgotPasswordView.as_view(), name="forgot_password"
    ),
    path("reset-password/", views.ResetPasswordView.as_view(), name="reset_password"),
    # ── Social auth ───────────────────────────────────────────────────────────
    path("google/", views.GoogleTokenAuthView.as_view(), name="google_auth"),
]
