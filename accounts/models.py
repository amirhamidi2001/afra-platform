from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model with additional fields
    """

    ROLE_CHOICES = [
        ("student", "هنرجو"),
        ("teacher", "معلم"),
        ("admin", "مدیر"),
    ]

    GENDER_CHOICES = [
        ("male", "مرد"),
        ("female", "زن"),
        ("other", "ترجیح می‌دهم نگویم"),
    ]

    role = models.CharField(
        max_length=10, choices=ROLE_CHOICES, default="student", verbose_name="نقش"
    )

    phone = models.CharField(
        max_length=15, blank=True, null=True, verbose_name="شماره تلفن"
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True,
        null=True,
        verbose_name="جنسیت",
    )

    full_name = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="نام و نام خانوادگی"
    )

    email_verified = models.BooleanField(default=False, verbose_name="ایمیل تأیید شده")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "کاربر"
        verbose_name_plural = "کاربران"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class TeacherProfile(models.Model):
    """
    پروفایل معلم - ایجاد می‌شود وقتی کاربر با role=teacher ثبت‌نام کند
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="teacher_profile",
        verbose_name="کاربر",
    )

    bio = models.TextField(blank=True, null=True, verbose_name="بیوگرافی")

    subject = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="تخصص"
    )

    experience = models.TextField(blank=True, null=True, verbose_name="سوابق و تجربیات")

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name="قیمت ساعتی (تومان)",
    )

    approved = models.BooleanField(default=False, verbose_name="تأیید شده")

    rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.00, verbose_name="امتیاز"
    )

    city = models.CharField(max_length=100, blank=True, null=True, verbose_name="شهر")

    avatar = models.ImageField(
        upload_to="teacher_avatars/",
        blank=True,
        null=True,
        verbose_name="تصویر پروفایل",
    )

    teaching_method = models.TextField(blank=True, null=True, verbose_name="روش تدریس")

    capacity = models.IntegerField(blank=True, null=True, verbose_name="ظرفیت هنرجو")

    trial_session = models.BooleanField(
        default=False, verbose_name="جلسه آزمایشی رایگان"
    )
    levels = models.JSONField(default=list, blank=True, verbose_name="سطوح تدریس")
    available_times = models.JSONField(
        default=list, blank=True, verbose_name="زمان‌های آزاد"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "پروفایل معلم"
        verbose_name_plural = "پروفایل‌های معلمان"
        ordering = ["-created_at"]

    def __str__(self):
        return f"پروفایل معلم: {self.user.full_name or self.user.username}"


class OTPVerification(models.Model):
    """
    Model for storing email verification codes
    """

    email = models.EmailField(verbose_name="ایمیل")
    otp_code = models.CharField(max_length=6, verbose_name="کد تأیید")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    is_verified = models.BooleanField(default=False, verbose_name="تأیید شده")
    expires_at = models.DateTimeField(verbose_name="تاریخ انقضا")

    class Meta:
        verbose_name = "کد تأیید"
        verbose_name_plural = "کدهای تأیید"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.email} - {self.otp_code}"

    def is_expired(self):
        from django.utils import timezone

        return timezone.now() > self.expires_at
