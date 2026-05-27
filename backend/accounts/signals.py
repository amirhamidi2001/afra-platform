from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import StudentProfile, TeacherProfile, User


@receiver(post_save, sender=User)
def manage_user_profile(sender, instance: User, created: bool, **kwargs) -> None:
    """
    Automatically creates or synchronises the appropriate profile
    whenever a User instance is saved.
    """
    if instance.user_type == User.UserType.Student:
        StudentProfile.objects.get_or_create(user=instance)

    elif instance.user_type == User.UserType.Teacher:
        TeacherProfile.objects.get_or_create(user=instance)
