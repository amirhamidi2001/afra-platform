"""
services.teacher_service
~~~~~~~~~~~~~~~~~~~~~~~~~
All business logic for the teachers domain.

Responsibilities
----------------
- Skill catalog reads (active skills for browse).
- TeacherSkill management: add, update, remove, list.
- AvailabilitySlot management: add, bulk-replace, remove, list.
- Teacher discovery: paginated search by skill, name, availability.

Boundaries
----------
- Called by views; never imports from views.
- Only imports from apps.teachers and apps.accounts — never from
  apps.bookings or apps.sessions.
- All DB writes are wrapped in transaction.atomic().
- All user-facing error strings are in Persian.
"""

from __future__ import annotations

import logging
from uuid import UUID

from django.db import transaction
from django.db.models import Avg, Count, Prefetch, Q, QuerySet

from apps.accounts.models import TeacherProfile
from apps.teachers.models import AvailabilitySlot, Skill, TeacherSkill

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------


class TeacherServiceError(Exception):
    """Base exception for teacher service errors."""


class SkillNotFound(TeacherServiceError):
    """Raised when a Skill cannot be located."""


class TeacherSkillNotFound(TeacherServiceError):
    """Raised when a TeacherSkill record cannot be located."""


class TeacherSkillAlreadyExists(TeacherServiceError):
    """Raised when a teacher tries to add a skill they already offer."""


class AvailabilitySlotNotFound(TeacherServiceError):
    """Raised when an AvailabilitySlot cannot be located."""


class AvailabilityConflict(TeacherServiceError):
    """Raised when a new slot overlaps an existing one for the same teacher."""


class Forbidden(TeacherServiceError):
    """Raised when the acting user does not own the resource."""


# ---------------------------------------------------------------------------
# Skill catalog
# ---------------------------------------------------------------------------


def list_active_skills() -> QuerySet:
    """
    Return all active Skill records ordered alphabetically.
    Used by both teachers (when adding skills) and students (browsing).
    """
    return Skill.objects.filter(is_active=True).order_by("name")


def get_skill_by_slug(slug: str) -> Skill:
    """
    Fetch a single active Skill by slug.

    Raises
    ------
    SkillNotFound
        If no active skill with that slug exists.
    """
    try:
        return Skill.objects.get(slug=slug, is_active=True)
    except Skill.DoesNotExist:
        raise SkillNotFound(f"مهارت با شناسه '{slug}' یافت نشد یا غیرفعال است.")


# ---------------------------------------------------------------------------
# TeacherSkill — teacher manages their own offerings
# ---------------------------------------------------------------------------


def add_teacher_skill(
    teacher: TeacherProfile,
    skill_id: UUID,
    level: str,
    years_of_experience: int,
    price_override=None,
) -> TeacherSkill:
    """
    Associate a skill with a teacher.

    Parameters
    ----------
    teacher:
        The TeacherProfile of the acting teacher.
    skill_id:
        UUID of the Skill to add.
    level:
        One of TeacherSkill.Level choices.
    years_of_experience:
        Non-negative integer, max 50.
    price_override:
        Optional Decimal; if None the teacher's default hourly_rate is used.

    Returns
    -------
    TeacherSkill
        The newly created association.

    Raises
    ------
    SkillNotFound
        If the skill does not exist or is inactive.
    TeacherSkillAlreadyExists
        If the teacher already offers this skill (active or inactive).
    """
    try:
        skill = Skill.objects.get(pk=skill_id, is_active=True)
    except Skill.DoesNotExist:
        raise SkillNotFound("مهارت انتخاب‌شده یافت نشد یا غیرفعال است.")

    if TeacherSkill.objects.filter(teacher=teacher, skill=skill).exists():
        raise TeacherSkillAlreadyExists(
            f"شما قبلاً مهارت «{skill.name}» را ثبت کرده‌اید."
        )

    with transaction.atomic():
        ts = TeacherSkill.objects.create(
            teacher=teacher,
            skill=skill,
            level=level,
            years_of_experience=years_of_experience,
            price_override=price_override,
            is_active=True,
        )

    logger.info(
        "TeacherSkill created: teacher=%s, skill=%s.",
        teacher.pk,
        skill.pk,
    )
    return ts


def update_teacher_skill(
    teacher: TeacherProfile,
    teacher_skill_id: UUID,
    validated_data: dict,
) -> TeacherSkill:
    """
    Update an existing TeacherSkill record owned by the teacher.

    Parameters
    ----------
    teacher:
        The acting TeacherProfile (used for ownership check).
    teacher_skill_id:
        UUID of the TeacherSkill to update.
    validated_data:
        Partial dict of fields to update (level, years_of_experience,
        price_override, is_active).

    Returns
    -------
    TeacherSkill
        The updated record.

    Raises
    ------
    TeacherSkillNotFound
        If the record does not exist.
    Forbidden
        If the record belongs to a different teacher.
    """
    try:
        ts = TeacherSkill.objects.select_related("skill").get(pk=teacher_skill_id)
    except TeacherSkill.DoesNotExist:
        raise TeacherSkillNotFound("مهارت مورد نظر یافت نشد.")

    if ts.teacher_id != teacher.pk:
        raise Forbidden("شما مجاز به ویرایش این مهارت نیستید.")

    updatable = ["level", "years_of_experience", "price_override", "is_active"]
    changed = []
    for field in updatable:
        if field in validated_data:
            setattr(ts, field, validated_data[field])
            changed.append(field)

    if changed:
        ts.save(update_fields=[*changed, "updated_at"])
        logger.info(
            "TeacherSkill %s updated: fields=%s.",
            teacher_skill_id,
            changed,
        )
    return ts


def remove_teacher_skill(teacher: TeacherProfile, teacher_skill_id: UUID) -> None:
    """
    Soft-delete a TeacherSkill by setting is_active=False.

    Hard deletion is not used because existing BookingRequests and Sessions
    may reference this skill association through the Skill FK.

    Raises
    ------
    TeacherSkillNotFound
        If the record does not exist.
    Forbidden
        If the record belongs to a different teacher.
    """
    try:
        ts = TeacherSkill.objects.get(pk=teacher_skill_id)
    except TeacherSkill.DoesNotExist:
        raise TeacherSkillNotFound("مهارت مورد نظر یافت نشد.")

    if ts.teacher_id != teacher.pk:
        raise Forbidden("شما مجاز به حذف این مهارت نیستید.")

    TeacherSkill.objects.filter(pk=teacher_skill_id).update(is_active=False)
    logger.info(
        "TeacherSkill %s deactivated by teacher %s.", teacher_skill_id, teacher.pk
    )


def list_teacher_skills(
    teacher: TeacherProfile, include_inactive: bool = False
) -> QuerySet:
    """
    Return all TeacherSkill records for a given teacher.

    Parameters
    ----------
    teacher:
        The TeacherProfile to list skills for.
    include_inactive:
        If True, includes is_active=False entries (for the teacher's own view).
        Student-facing queries always pass False.
    """
    qs = (
        TeacherSkill.objects.filter(teacher=teacher)
        .select_related("skill")
        .order_by("skill__name")
    )
    if not include_inactive:
        qs = qs.filter(is_active=True)
    return qs


# ---------------------------------------------------------------------------
# AvailabilitySlot — teacher manages their weekly schedule
# ---------------------------------------------------------------------------


def _slots_overlap(
    teacher: TeacherProfile,
    weekday: int,
    start_time,
    end_time,
    exclude_pk=None,
) -> bool:
    """
    Return True if any existing slot for this teacher on this weekday
    overlaps the given [start_time, end_time) window.

    Overlap: existing.start < new.end  AND  existing.end > new.start
    """
    qs = AvailabilitySlot.objects.filter(
        teacher=teacher,
        weekday=weekday,
    ).filter(Q(start_time__lt=end_time) & Q(end_time__gt=start_time))
    if exclude_pk:
        qs = qs.exclude(pk=exclude_pk)
    return qs.exists()


def add_availability_slot(
    teacher: TeacherProfile,
    weekday: int,
    start_time,
    end_time,
) -> AvailabilitySlot:
    """
    Create a new recurring weekly availability slot.

    Parameters
    ----------
    teacher:
        The TeacherProfile to attach the slot to.
    weekday:
        Integer 0–6 (Monday–Sunday), matching AvailabilitySlot.Weekday.
    start_time, end_time:
        datetime.time objects in the teacher's local timezone.

    Returns
    -------
    AvailabilitySlot

    Raises
    ------
    AvailabilityConflict
        If the new slot overlaps an existing one on the same weekday.
    """
    if _slots_overlap(teacher, weekday, start_time, end_time):
        raise AvailabilityConflict("این بازه زمانی با یک اسلات موجود تداخل دارد.")

    with transaction.atomic():
        slot = AvailabilitySlot.objects.create(
            teacher=teacher,
            weekday=weekday,
            start_time=start_time,
            end_time=end_time,
        )

    logger.info(
        "AvailabilitySlot created: teacher=%s, weekday=%s, %s-%s.",
        teacher.pk,
        weekday,
        start_time,
        end_time,
    )
    return slot


def update_availability_slot(
    teacher: TeacherProfile,
    slot_id: UUID,
    validated_data: dict,
) -> AvailabilitySlot:
    """
    Update an existing AvailabilitySlot owned by the teacher.

    Re-runs overlap detection after applying the changes, excluding
    the slot being updated from the check.

    Raises
    ------
    AvailabilitySlotNotFound
        If the slot does not exist.
    Forbidden
        If the slot belongs to a different teacher.
    AvailabilityConflict
        If the updated times would overlap another slot.
    """
    try:
        slot = AvailabilitySlot.objects.get(pk=slot_id)
    except AvailabilitySlot.DoesNotExist:
        raise AvailabilitySlotNotFound("اسلات موردنظر یافت نشد.")

    if slot.teacher_id != teacher.pk:
        raise Forbidden("شما مجاز به ویرایش این اسلات نیستید.")

    new_weekday = validated_data.get("weekday", slot.weekday)
    new_start_time = validated_data.get("start_time", slot.start_time)
    new_end_time = validated_data.get("end_time", slot.end_time)

    if _slots_overlap(
        teacher, new_weekday, new_start_time, new_end_time, exclude_pk=slot.pk
    ):
        raise AvailabilityConflict("این بازه زمانی با یک اسلات موجود تداخل دارد.")

    updatable = ["weekday", "start_time", "end_time"]
    changed = []
    for field in updatable:
        if field in validated_data:
            setattr(slot, field, validated_data[field])
            changed.append(field)

    if changed:
        slot.save(update_fields=[*changed, "updated_at"])
        logger.info("AvailabilitySlot %s updated: fields=%s.", slot_id, changed)

    return slot


def remove_availability_slot(teacher: TeacherProfile, slot_id: UUID) -> None:
    """
    Delete an AvailabilitySlot.

    Hard deletion is safe here — slots carry no FK references from
    other models; they represent declaration of intent only.

    Raises
    ------
    AvailabilitySlotNotFound
        If the slot does not exist.
    Forbidden
        If the slot belongs to a different teacher.
    """
    try:
        slot = AvailabilitySlot.objects.get(pk=slot_id)
    except AvailabilitySlot.DoesNotExist:
        raise AvailabilitySlotNotFound("اسلات موردنظر یافت نشد.")

    if slot.teacher_id != teacher.pk:
        raise Forbidden("شما مجاز به حذف این اسلات نیستید.")

    slot.delete()
    logger.info("AvailabilitySlot %s deleted by teacher %s.", slot_id, teacher.pk)


def list_availability_slots(teacher: TeacherProfile) -> QuerySet:
    """Return all AvailabilitySlots for a teacher ordered by weekday then start_time."""
    return AvailabilitySlot.objects.filter(teacher=teacher).order_by(
        "weekday", "start_time"
    )


def bulk_replace_availability(
    teacher: TeacherProfile,
    slots_data: list[dict],
) -> list[AvailabilitySlot]:
    """
    Atomically replace ALL of a teacher's availability slots.

    Deletes every existing slot and inserts the new set in one transaction.
    Used when the frontend sends the teacher's complete weekly schedule at once.

    Parameters
    ----------
    teacher:
        The TeacherProfile to update.
    slots_data:
        List of dicts, each containing: weekday, start_time, end_time.
        Pre-validated by the serializer layer before calling this function.

    Returns
    -------
    list[AvailabilitySlot]
        The newly created slot objects.

    Raises
    ------
    AvailabilityConflict
        If any two entries in the new set overlap each other.
    """
    _validate_no_internal_overlaps(slots_data)

    with transaction.atomic():
        AvailabilitySlot.objects.filter(teacher=teacher).delete()
        created = AvailabilitySlot.objects.bulk_create(
            [
                AvailabilitySlot(
                    teacher=teacher,
                    weekday=entry["weekday"],
                    start_time=entry["start_time"],
                    end_time=entry["end_time"],
                )
                for entry in slots_data
            ]
        )

    logger.info(
        "Bulk availability replaced for teacher %s: %d slots.",
        teacher.pk,
        len(created),
    )
    return created


def _validate_no_internal_overlaps(slots_data: list[dict]) -> None:
    """
    Check that no two entries within slots_data overlap on the same weekday.
    Called before bulk_replace_availability writes to the DB.

    Raises
    ------
    AvailabilityConflict
        On the first detected overlap pair.
    """
    by_weekday: dict[int, list] = {}
    for entry in slots_data:
        by_weekday.setdefault(entry["weekday"], []).append(entry)

    for weekday, entries in by_weekday.items():
        sorted_entries = sorted(entries, key=lambda e: e["start_time"])
        for i in range(len(sorted_entries) - 1):
            a = sorted_entries[i]
            b = sorted_entries[i + 1]
            if b["start_time"] < a["end_time"]:
                raise AvailabilityConflict(
                    f"اسلات‌های ورودی با یکدیگر تداخل دارند "
                    f"(روز {weekday}: {a['start_time']}–{a['end_time']} "
                    f"و {b['start_time']}–{b['end_time']})."
                )


# ---------------------------------------------------------------------------
# Teacher discovery — student-facing
# ---------------------------------------------------------------------------


def search_teachers(
    skill_slug: str | None = None,
    name_query: str | None = None,
    weekday: int | None = None,
    min_rating: float | None = None,
    max_hourly_rate=None,
) -> QuerySet:
    """
    Return a queryset of TeacherProfiles matching the given filters.

    All filters are optional and composable.

    Parameters
    ----------
    skill_slug:
        Filter to teachers who offer this skill (active TeacherSkill only).
    name_query:
        Case-insensitive substring match on first_name or last_name.
    weekday:
        Integer 0–6; filter to teachers available on this weekday.
    min_rating:
        Minimum average rating (inclusive).
    max_hourly_rate:
        Upper bound on TeacherProfile.hourly_rate (inclusive).

    Returns
    -------
    QuerySet[TeacherProfile]
        Annotated with active_skill_count. Ordered by rating desc, then name.
    """
    qs = (
        TeacherProfile.objects.select_related("user")
        .prefetch_related(
            Prefetch(
                "teacher_skills",
                queryset=TeacherSkill.objects.filter(is_active=True).select_related(
                    "skill"
                ),
                to_attr="active_skills",
            ),
            Prefetch(
                "availability_slots",
                queryset=AvailabilitySlot.objects.order_by("weekday", "start_time"),
                to_attr="slots",
            ),
        )
        .annotate(
            active_skill_count=Count(
                "teacher_skills",
                filter=Q(teacher_skills__is_active=True),
            )
        )
        .filter(
            user__is_active=True,
            user__is_email_verified=True,
            active_skill_count__gte=1,
        )
    )

    if skill_slug:
        qs = qs.filter(
            teacher_skills__skill__slug=skill_slug,
            teacher_skills__is_active=True,
        ).distinct()

    if name_query:
        qs = qs.filter(
            Q(user__first_name__icontains=name_query)
            | Q(user__last_name__icontains=name_query)
        )

    if weekday is not None:
        qs = qs.filter(availability_slots__weekday=weekday).distinct()

    if min_rating is not None:
        qs = qs.filter(rating__gte=min_rating)

    if max_hourly_rate is not None:
        qs = qs.filter(hourly_rate__lte=max_hourly_rate)

    return qs.order_by("-rating", "user__first_name", "user__last_name")


def get_teacher_public_profile(teacher_id: UUID) -> TeacherProfile:
    """
    Fetch a single TeacherProfile for the public detail view.

    Returns the profile with all active skills and availability slots
    pre-fetched to avoid N+1 on the detail page.

    Raises
    ------
    TeacherServiceError
        If the teacher does not exist or is not discoverable.
    """
    try:
        return (
            TeacherProfile.objects.select_related("user")
            .prefetch_related(
                Prefetch(
                    "teacher_skills",
                    queryset=TeacherSkill.objects.filter(is_active=True).select_related(
                        "skill"
                    ),
                    to_attr="active_skills",
                ),
                Prefetch(
                    "availability_slots",
                    queryset=AvailabilitySlot.objects.order_by("weekday", "start_time"),
                    to_attr="slots",
                ),
            )
            .get(
                pk=teacher_id,
                user__is_active=True,
                user__is_email_verified=True,
            )
        )
    except TeacherProfile.DoesNotExist:
        raise TeacherServiceError("معلم موردنظر یافت نشد.")
