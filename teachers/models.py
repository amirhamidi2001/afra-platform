from django.db import models
from django.conf import settings


class TeacherProfileExtension(models.Model):
    """
    Since no fields are defined and no Meta class is provided,
    this model will create a table with only an auto-generated primary key (id)
    """

    pass


class SessionRequest(models.Model):
    """
    Represents a request from a student to a teacher for a session.
    """

    STATUS_CHOICES = [
        ("pending", "در انتظار تأیید"),
        ("accepted", "پذیرفته شده"),
        ("rejected", "رد شده"),
        ("cancelled", "لغو شده"),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="session_requests",
        verbose_name="دانش‌آموز",
    )

    teacher_profile = models.ForeignKey(
        "accounts.TeacherProfile",
        on_delete=models.CASCADE,
        related_name="session_requests",
        verbose_name="پروفایل معلم",
    )

    message = models.TextField(blank=True, null=True, verbose_name="پیام")

    preferred_times = models.JSONField(
        default=list,
        blank=True,
        verbose_name="زمان‌های پیشنهادی",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        verbose_name="وضعیت",
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "درخواست جلسه"
        verbose_name_plural = "درخواست‌های جلسه"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "teacher_profile"],
                condition=models.Q(status="pending"),
                name="unique_pending_session_request",
            )
        ]

    def __str__(self):
        return (
            f"درخواست {self.student.full_name or self.student.username}"
            f" به {self.teacher_profile}"
        )
