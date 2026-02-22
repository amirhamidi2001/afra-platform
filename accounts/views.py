from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import (
    SignupSerializer,
    LoginSerializer,
    UserSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
    TeacherProfileSerializer,
    CheckAvailabilitySerializer,
)
from .models import TeacherProfile

User = get_user_model()


class SignupView(APIView):
    """
    API for registering a new user
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            response_data = {
                "message": "ثبت‌نام با موفقیت انجام شد",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name,
                    "role": user.role,
                    "phone": user.phone,
                    "gender": user.gender,
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            }

            # If it's a teacher, also add the profile information
            if user.role == "teacher":
                try:
                    teacher_profile = user.teacher_profile
                    response_data["teacher_profile"] = {
                        "id": teacher_profile.id,
                        "approved": teacher_profile.approved,
                    }
                except TeacherProfile.DoesNotExist:
                    pass

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API for user login
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            refresh = RefreshToken.for_user(user)

            response_data = {
                "message": "ورود با موفقیت انجام شد",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name,
                    "role": user.role,
                    "phone": user.phone,
                    "gender": user.gender,
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            }

            # If the user is a teacher, also add the profile information
            if user.role == "teacher":
                try:
                    teacher_profile = user.teacher_profile
                    response_data["teacher_profile"] = {
                        "id": teacher_profile.id,
                        "approved": teacher_profile.approved,
                    }
                except TeacherProfile.DoesNotExist:
                    pass

            return Response(response_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendOTPView(APIView):
    """
    API for sending verification code to email
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)

        if serializer.is_valid():
            otp = serializer.save()

            return Response(
                {
                    "message": "کد تأیید با موفقیت ارسال شد",
                    "email": otp.email,
                    # For development only – should be removed in production
                    "otp_code": otp.otp_code,
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    """
    API for verifying OTP code
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)

        if serializer.is_valid():
            otp = serializer.validated_data["otp"]

            # Mark as verified.
            otp.is_verified = True
            otp.save()

            return Response(
                {
                    "message": "ایمیل با موفقیت تأیید شد",
                    "email": otp.email,
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API for viewing and editing user profile
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class TeacherProfileView(generics.RetrieveUpdateAPIView):
    """
    API for viewing and editing teacher profile
    """

    permission_classes = [IsAuthenticated]
    serializer_class = TeacherProfileSerializer

    def get_object(self):
        user = self.request.user

        if user.role != "teacher":
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("فقط معلمان می‌توانند به این بخش دسترسی داشته باشند")

        return user.teacher_profile


class LogoutView(APIView):
    """
    API for user logout (Blacklist refresh token)
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "خروج با موفقیت انجام شد"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "خطا در خروج از سیستم"}, status=status.HTTP_400_BAD_REQUEST
            )


class CheckAvailabilityView(APIView):
    """
    API to check if a username or email is already registered
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CheckAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get("username")
            email = serializer.validated_data.get("email")

            response_data = {"exists": False}

            if username:
                if User.objects.filter(username__iexact=username).exists():
                    response_data["exists"] = True
                    response_data["message"] = "این نام کاربری قبلاً انتخاب شده است"

            elif email:
                if User.objects.filter(email__iexact=email).exists():
                    response_data["exists"] = True
                    response_data["message"] = "این ایمیل قبلاً ثبت شده است"

            return Response(response_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
