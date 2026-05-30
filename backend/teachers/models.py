import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


# ---------------------------------------------------------------------------
# Base model
# ---------------------------------------------------------------------------


class BaseModel(models.Model):
    """Abstract base — replace with common.models.BaseModel once shared module exists."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# ---------------------------------------------------------------------------
# Skill
# ---------------------------------------------------------------------------


class Skill(BaseModel):
    """
    Platform-wide skill catalog.

    Owned by the teachers app; referenced by TeacherSkill and BookingRequest.
    No user FKs here — the catalog is decoupled from who teaches what.
    """

    name = models.CharField(_("name"), max_length=100, unique=True)
    slug = models.SlugField(_("slug"), max_length=110, unique=True)
    description = models.TextField(_("description"), blank=True)
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_("Inactive skills are hidden from browse/search."),
    )

    class Meta:
        verbose_name = _("skill")
        verbose_name_plural = _("skills")
        ordering = ["name"]
        indexes = [
            models.Index(fields=["slug"], name="skill_slug_idx"),
            models.Index(fields=["is_active"], name="skill_is_active_idx"),
        ]

    def __str__(self) -> str:
        return self.name


# ---------------------------------------------------------------------------
# TeacherSkill  (Teacher ↔ Skill through model)
# ---------------------------------------------------------------------------


class TeacherSkill(BaseModel):
    """
    Associates a teacher with a skill they offer.

    price_override takes precedence over TeacherProfile.hourly_rate when set.
    The service layer is responsible for resolving the effective price.
    """

    class Level(models.TextChoices):
        BEGINNER = "BEGINNER", _("Beginner")
        INTERMEDIATE = "INTERMEDIATE", _("Intermediate")
        ADVANCED = "ADVANCED", _("Advanced")
        EXPERT = "EXPERT", _("Expert")

    teacher = models.ForeignKey(
        "accounts.TeacherProfile",
        on_delete=models.CASCADE,
        related_name="teacher_skills",
        db_index=True,
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.PROTECT,  # never silently delete a skill in use
        related_name="teacher_skills",
        db_index=True,
    )
    level = models.CharField(
        _("proficiency level"),
        max_length=15,
        choices=Level.choices,
    )
    price_override = models.DecimalField(
        _("price override"),
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text=_(
            "Per-skill hourly rate. When set, supersedes TeacherProfile.hourly_rate "
            "for sessions involving this skill."
        ),
    )
    years_of_experience = models.PositiveSmallIntegerField(
        _("years of experience"),
        default=0,
        validators=[MaxValueValidator(50)],
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_("Inactive entries are hidden from student search results."),
    )

    class Meta:
        verbose_name = _("teacher skill")
        verbose_name_plural = _("teacher skills")
        constraints = [
            models.UniqueConstraint(
                fields=["teacher", "skill"],
                name="unique_teacher_skill",
            ),
        ]
        indexes = [
            models.Index(
                fields=["teacher", "is_active"], name="teacherskill_teacher_active_idx"
            ),
            models.Index(
                fields=["skill", "is_active"], name="teacherskill_skill_active_idx"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.teacher} — {self.skill} ({self.get_level_display()})"


# ---------------------------------------------------------------------------
# AvailabilitySlot
# ---------------------------------------------------------------------------


class AvailabilitySlot(BaseModel):
    """
    Recurring weekly time window during which a teacher is available for booking.

    Represents intent only — no booking state is tracked here.
    Concrete session datetimes are computed in the service layer by combining
    a requested date with slot start_time, then converting to UTC using the
    teacher's timezone (TeacherProfile.timezone).

    Constraints:
    - start_time must be before end_time (enforced via CheckConstraint).
    - No two slots for the same teacher may share an identical weekday + start_time.
    """

    class Weekday(models.IntegerChoices):
        MONDAY = 0, _("Monday")
        TUESDAY = 1, _("Tuesday")
        WEDNESDAY = 2, _("Wednesday")
        THURSDAY = 3, _("Thursday")
        FRIDAY = 4, _("Friday")
        SATURDAY = 5, _("Saturday")
        SUNDAY = 6, _("Sunday")

    teacher = models.ForeignKey(
        "accounts.TeacherProfile",
        on_delete=models.CASCADE,
        related_name="availability_slots",
        db_index=True,
    )
    weekday = models.PositiveSmallIntegerField(
        _("weekday"),
        choices=Weekday.choices,
    )
    start_time = models.TimeField(
        _("start time"),
        help_text=_("Local time in the teacher's timezone."),
    )
    end_time = models.TimeField(
        _("end time"),
        help_text=_("Local time in the teacher's timezone."),
    )

    class Meta:
        verbose_name = _("availability slot")
        verbose_name_plural = _("availability slots")
        constraints = [
            models.UniqueConstraint(
                fields=["teacher", "weekday", "start_time"],
                name="unique_teacher_weekday_start",
            ),
            models.CheckConstraint(
                check=models.Q(end_time__gt=models.F("start_time")),
                name="availability_end_after_start",
            ),
        ]
        indexes = [
            models.Index(
                fields=["teacher", "weekday"],
                name="availability_teacher_weekday_idx",
            ),
        ]

    def __str__(self) -> str:
        return (
            f"{self.teacher} | "
            f"{self.get_weekday_display()} "
            f"{self.start_time:%H:%M}–{self.end_time:%H:%M}"
        )
