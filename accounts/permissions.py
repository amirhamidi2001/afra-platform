from rest_framework import permissions


class IsStudent(permissions.BasePermission):
    """
    Only students can have access
    """

    message = "فقط هنرجویان می‌توانند به این بخش دسترسی داشته باشند."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "student"
        )


class IsTeacher(permissions.BasePermission):
    """
    Only teachers can have access
    """

    message = "فقط معلمان می‌توانند به این بخش دسترسی داشته باشند."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "teacher"
        )


class IsApprovedTeacher(permissions.BasePermission):
    """
    Only verified teachers can have access
    """

    message = "فقط معلمان تأیید شده می‌توانند به این بخش دسترسی داشته باشند."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        if request.user.role != "teacher":
            return False

        try:
            return request.user.teacher_profile.approved
        except:
            return False


class IsAdmin(permissions.BasePermission):
    """
    Only admins can have access
    """

    message = "فقط مدیران می‌توانند به این بخش دسترسی داشته باشند."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Only the account owner or admin can have access
    """

    message = "شما مجاز به دسترسی به این اطلاعات نیستید."

    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the object or an admin
        return (
            obj == request.user or request.user.role == "admin" or request.user.is_staff
        )


class IsTeacherOwnerOrAdmin(permissions.BasePermission):
    """
    Only the teacher with the profile or the admin can have access
    """

    message = "شما مجاز به دسترسی به این پروفایل نیستید."

    def has_object_permission(self, request, view, obj):
        # obj here is TeacherProfile
        return (
            obj.user == request.user
            or request.user.role == "admin"
            or request.user.is_staff
        )


class ReadOnly(permissions.BasePermission):
    """
    Only read access is allowed (GET, HEAD, OPTIONS).
    """

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
