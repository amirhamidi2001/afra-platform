from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, TeacherProfile, OTPVerification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin panel for the custom user model
    """

    list_display = [
        "username",
        "email",
        "full_name",
        "role",
        "email_verified",
        "is_active",
        "created_at",
    ]
    list_filter = ["role", "email_verified", "is_active", "is_staff", "gender"]
    search_fields = ["username", "email", "full_name", "phone"]
    ordering = ["-created_at"]

    fieldsets = (
        ("اطلاعات کاربری", {"fields": ("username", "password")}),
        ("اطلاعات شخصی", {"fields": ("full_name", "email", "phone", "gender")}),
        (
            "نقش و دسترسی",
            {
                "fields": (
                    "role",
                    "email_verified",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                )
            },
        ),
        (
            "گروه‌ها و مجوزها",
            {"fields": ("groups", "user_permissions"), "classes": ("collapse",)},
        ),
        (
            "تاریخ‌ها",
            {
                "fields": ("last_login", "date_joined", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    add_fieldsets = (
        (
            "ایجاد کاربر جدید",
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "full_name",
                    "password1",
                    "password2",
                    "role",
                ),
            },
        ),
    )

    readonly_fields = ["created_at", "updated_at", "last_login", "date_joined"]


@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    """
    Admin panel for the teacher profile
    """

    list_display = [
        "get_teacher_name",
        "subject",
        "price",
        "approved",
        "rating",
        "created_at",
    ]
    list_filter = ["approved", "trial_session", "created_at"]
    search_fields = ["user__username", "user__full_name", "subject", "city"]
    ordering = ["-created_at"]

    fieldsets = (
        ("اطلاعات معلم", {"fields": ("user", "subject", "bio", "experience")}),
        (
            "اطلاعات مالی و تدریس",
            {"fields": ("price", "teaching_method", "capacity", "trial_session")},
        ),
        ("وضعیت و امتیاز", {"fields": ("approved", "rating")}),
        ("اطلاعات تکمیلی", {"fields": ("city", "avatar")}),
        ("تاریخ‌ها", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )

    readonly_fields = ["created_at", "updated_at"]

    def get_teacher_name(self, obj):
        return obj.user.full_name or obj.user.username

    get_teacher_name.short_description = "نام معلم"

    actions = ["approve_teachers", "reject_teachers"]

    def approve_teachers(self, request, queryset):
        """
        Bulk approval of teachers
        """
        updated = queryset.update(approved=True)
        self.message_user(request, f"{updated} معلم تأیید شدند.")

    approve_teachers.short_description = "تأیید معلمان انتخاب شده"

    def reject_teachers(self, request, queryset):
        """
        Bulk rejection of teachers
        """
        updated = queryset.update(approved=False)
        self.message_user(request, f"{updated} معلم رد شدند.")

    reject_teachers.short_description = "رد معلمان انتخاب شده"


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    """
    Admin panel for verification codes
    """

    list_display = ["email", "otp_code", "is_verified", "created_at", "expires_at"]
    list_filter = ["is_verified", "created_at"]
    search_fields = ["email", "otp_code"]
    ordering = ["-created_at"]

    readonly_fields = ["created_at"]

    def has_add_permission(self, request):
        # Prevent manual creation of OTP in the admin panel
        return False
