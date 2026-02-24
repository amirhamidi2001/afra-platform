from django.contrib import admin

from .models import SessionRequest


@admin.register(SessionRequest)
class SessionRequestAdmin(admin.ModelAdmin):
    """
    Defines a custom admin configuration class for the SessionRequest model
    """

    list_display = ["student", "teacher_profile", "status", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["student__username", "teacher_profile__user__username"]
    readonly_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]
