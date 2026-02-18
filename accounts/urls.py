from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SignupView,
    LoginView,
    SendOTPView,
    VerifyOTPView,
    UserProfileView,
    TeacherProfileView,
    LogoutView,
)

app_name = "accounts"

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("send-otp/", SendOTPView.as_view(), name="send-otp"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("teacher-profile/", TeacherProfileView.as_view(), name="teacher-profile"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
