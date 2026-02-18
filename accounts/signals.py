from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import TeacherProfile

User = get_user_model()


@receiver(post_save, sender=User)
def create_teacher_profile(sender, instance, created, **kwargs):
    """
    Automatically create teacher profile when a user with the "teacher" role registers.
    This signal is triggered only when:
    A new user is created (created=True)
    The user's role is teacher
    A teacher profile has not been created before
    """
    if created and instance.role == "teacher":
        # Check that the teacher profile has not been created previously.
        if not hasattr(instance, "teacher_profile"):
            TeacherProfile.objects.create(
                user=instance,
                bio="",
                subject="",
                experience="",
                price=None,
                approved=False,
                rating=0.00,
            )


@receiver(post_save, sender=User)
def save_teacher_profile(sender, instance, **kwargs):
    """
    Automatically save teacher profile when saving the user
    """
    if instance.role == "teacher" and hasattr(instance, "teacher_profile"):
        instance.teacher_profile.save()
