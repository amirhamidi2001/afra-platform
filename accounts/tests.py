from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import TeacherProfile, OTPVerification

User = get_user_model()


class UserModelTest(TestCase):
    """
    User model tests
    """

    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "full_name": "Test User",
            "role": "student",
            "phone": "09123456789",
            "gender": "male",
        }

    def test_create_user(self):
        """Test user creation"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.role, "student")
        self.assertTrue(user.check_password("testpass123"))

    def test_create_teacher_profile(self):
        """Test teacher profile creation"""
        user_data = self.user_data.copy()
        user_data["role"] = "teacher"
        user = User.objects.create_user(**user_data)

        # Create teacher profile
        teacher_profile = TeacherProfile.objects.create(
            user=user,
            subject="ریاضی",
            price=50000,
        )

        self.assertEqual(teacher_profile.user, user)
        self.assertFalse(teacher_profile.approved)
        self.assertEqual(teacher_profile.subject, "ریاضی")


class SignupAPITest(APITestCase):
    """
    API signup tests
    """

    def setUp(self):
        # Create verified OTP for testing
        self.otp = OTPVerification.objects.create(
            email="test@example.com",
            otp_code="123456",
            is_verified=True,
            expires_at="2025-12-31 23:59:59",
        )

    def test_signup_student(self):
        """Test student registration"""
        data = {
            "username": "student1",
            "email": "test@example.com",
            "password": "pass123456",
            "password2": "pass123456",
            "full_name": "Student One",
            "role": "student",
            "phone": "09123456789",
            "gender": "male",
        }

        response = self.client.post("/api/accounts/signup/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tokens", response.data)
        self.assertEqual(response.data["user"]["role"], "student")

    def test_signup_teacher(self):
        """Test teacher registration and profile creation"""
        data = {
            "username": "teacher1",
            "email": "test@example.com",
            "password": "pass123456",
            "password2": "pass123456",
            "full_name": "Teacher One",
            "role": "teacher",
            "phone": "09123456789",
            "gender": "female",
        }

        response = self.client.post("/api/accounts/signup/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(username="teacher1")
        self.assertTrue(hasattr(user, "teacher_profile"))
        self.assertFalse(user.teacher_profile.approved)

    def test_signup_password_mismatch(self):
        """Test password mismatch"""
        data = {
            "username": "user1",
            "email": "test@example.com",
            "password": "pass123456",
            "password2": "different",
            "full_name": "User One",
            "role": "student",
        }

        response = self.client.post("/api/accounts/signup/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginAPITest(APITestCase):
    """
    API login tests
    """

    def setUp(self):
        """
        Setup method to create a test user before each test.
        """
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            full_name="Test User",
            role="student",
        )

    def test_login_success(self):
        """Test successful login"""
        data = {
            "username": "testuser",
            "password": "testpass123",
        }

        response = self.client.post("/api/accounts/login/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)
        self.assertIn("access", response.data["tokens"])
        self.assertIn("refresh", response.data["tokens"])

    def test_login_wrong_password(self):
        """Test login with incorrect password"""
        data = {
            "username": "testuser",
            "password": "wrongpassword",
        }

        response = self.client.post("/api/accounts/login/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_nonexistent_user(self):
        """Test login with a non-existent user"""
        data = {
            "username": "nonexistent",
            "password": "somepassword",
        }

        response = self.client.post("/api/accounts/login/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class OTPAPITest(APITestCase):
    """
    API OTP (One Time Password) tests
    """

    def test_send_otp(self):
        """Test sending OTP"""
        data = {
            "email": "newuser@example.com",
        }

        response = self.client.post("/api/accounts/send-otp/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("otp_code", response.data)

        otp = OTPVerification.objects.filter(email="newuser@example.com").first()
        self.assertIsNotNone(otp)

    def test_verify_otp_success(self):
        """Test successful OTP verification"""
        otp = OTPVerification.objects.create(
            email="test@example.com",
            otp_code="123456",
            expires_at="2025-12-31 23:59:59",
        )

        data = {
            "email": "test@example.com",
            "otp_code": "123456",
        }

        response = self.client.post("/api/accounts/verify-otp/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that OTP is marked as verified
        otp.refresh_from_db()
        self.assertTrue(otp.is_verified)

    def test_verify_otp_wrong_code(self):
        """Test OTP verification with incorrect code"""
        OTPVerification.objects.create(
            email="test@example.com",
            otp_code="123456",
            expires_at="2025-12-31 23:59:59",
        )

        data = {
            "email": "test@example.com",
            "otp_code": "wrong",
        }

        response = self.client.post("/api/accounts/verify-otp/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PermissionTest(APITestCase):
    """
    API access permission tests
    """

    def setUp(self):
        """
        Setup method to create test users with different roles before each test.
        """
        self.student = User.objects.create_user(
            username="student",
            password="pass123",
            role="student",
        )

        self.teacher = User.objects.create_user(
            username="teacher",
            password="pass123",
            role="teacher",
        )

        # Create teacher profile and mark as approved
        TeacherProfile.objects.create(
            user=self.teacher,
            approved=True,
        )

    def test_student_cannot_access_teacher_profile(self):
        """Test that a student cannot access teacher's profile"""
        self.client.force_authenticate(user=self.student)

        response = self.client.get("/api/accounts/teacher-profile/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_can_access_teacher_profile(self):
        """Test that a teacher can access their own profile"""
        self.client.force_authenticate(user=self.teacher)

        response = self.client.get("/api/accounts/teacher-profile/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
