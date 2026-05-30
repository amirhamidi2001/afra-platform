"""
apps.teachers.permissions
~~~~~~~~~~~~~~~~~~~~~~~~~~
DRF permission classes for the teachers app.
"""

from rest_framework.permissions import BasePermission


class IsTeacher(BasePermission):
    """Grants access only to authenticated users with role=TEACHER."""

    message = "فقط معلمان مجاز به انجام این عملیات هستند."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_teacher


class IsStudent(BasePermission):
    """Grants access only to authenticated users with role=STUDENT."""

    message = "فقط دانش‌آموزان مجاز به انجام این عملیات هستند."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_student


class IsVerifiedTeacher(BasePermission):
    """
    Grants write access only to teachers whose profile is admin-verified.
    Read access (GET, HEAD, OPTIONS) is always permitted to authenticated users.

    Use this on endpoints where only trusted, verified teachers should
    be able to publish offerings (e.g. adding skills visible to students).
    """

    message = "فقط معلمان تأییدشده مجاز به انجام این عملیات هستند."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if not request.user.is_teacher:
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        try:
            return request.user.teacher_profile.is_verified
        except Exception:
            return False
