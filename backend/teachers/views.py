"""
apps.teachers.views
~~~~~~~~~~~~~~~~~~~
DRF views for the teachers app.

View inventory
--------------
SKILL CATALOG (public read)
  GET  /api/teachers/skills/                       SkillListView

TEACHER SKILL MANAGEMENT (teacher only)
  GET  /api/teachers/me/skills/                    MySkillListView
  POST /api/teachers/me/skills/                    MySkillListView
  GET  /api/teachers/me/skills/{id}/               MySkillDetailView
  PUT  /api/teachers/me/skills/{id}/               MySkillDetailView
  DEL  /api/teachers/me/skills/{id}/               MySkillDetailView

AVAILABILITY MANAGEMENT (teacher only)
  GET  /api/teachers/me/availability/              MyAvailabilityView
  POST /api/teachers/me/availability/              MyAvailabilityView
  PUT  /api/teachers/me/availability/bulk/         BulkAvailabilityView
  GET  /api/teachers/me/availability/{id}/         MyAvailabilitySlotDetailView
  PUT  /api/teachers/me/availability/{id}/         MyAvailabilitySlotDetailView
  DEL  /api/teachers/me/availability/{id}/         MyAvailabilitySlotDetailView

TEACHER DISCOVERY (any authenticated user — students & teachers)
  GET  /api/teachers/                              TeacherSearchView
  GET  /api/teachers/{id}/                         TeacherPublicProfileView

Design rules
------------
- Views are thin: validate → call service → serialize → respond.
- All user-facing messages are in Persian.
- No ORM calls in views; all DB access goes through teacher_service.
- select_related / prefetch_related is the service layer's responsibility.
"""

from __future__ import annotations

import logging

from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.teachers.pagination import TeacherPageNumberPagination
from apps.teachers.permissions import IsTeacher
from apps.teachers.serializers import (
    AvailabilitySlotCreateSerializer,
    AvailabilitySlotOutputSerializer,
    AvailabilitySlotUpdateSerializer,
    BulkAvailabilitySlotSerializer,
    SkillSerializer,
    TeacherPublicProfileSerializer,
    TeacherSearchQuerySerializer,
    TeacherSkillCreateSerializer,
    TeacherSkillOutputSerializer,
    TeacherSkillUpdateSerializer,
)
from services import teacher_service
from services.teacher_service import (
    AvailabilityConflict,
    AvailabilitySlotNotFound,
    Forbidden,
    SkillNotFound,
    TeacherServiceError,
    TeacherSkillAlreadyExists,
    TeacherSkillNotFound,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Shared error mapper
# ---------------------------------------------------------------------------


def _map_service_error(exc: Exception) -> Response:
    """Map known service exceptions to DRF HTTP responses."""
    if isinstance(exc, (SkillNotFound, TeacherSkillNotFound, AvailabilitySlotNotFound)):
        return Response({"detail": str(exc)}, status=status.HTTP_404_NOT_FOUND)
    if isinstance(exc, Forbidden):
        return Response({"detail": str(exc)}, status=status.HTTP_403_FORBIDDEN)
    if isinstance(exc, (TeacherSkillAlreadyExists, AvailabilityConflict)):
        return Response({"detail": str(exc)}, status=status.HTTP_409_CONFLICT)
    if isinstance(exc, TeacherServiceError):
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    raise exc  # unknown — let DRF's global handler produce a 500


# ---------------------------------------------------------------------------
# Skill catalog — public read
# ---------------------------------------------------------------------------


class SkillListView(APIView):
    """
    GET /api/teachers/skills/

    Returns all active platform skills.
    Accessible to any authenticated user (students use this to browse,
    teachers use it to know which skills they can add).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        skills = teacher_service.list_active_skills()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Teacher skill management — teacher only
# ---------------------------------------------------------------------------


class MySkillListView(APIView):
    """
    GET  /api/teachers/me/skills/   List own active skill offerings.
    POST /api/teachers/me/skills/   Add a new skill offering.
    """

    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        skills = teacher_service.list_teacher_skills(
            teacher=request.user.teacher_profile,
            include_inactive=request.query_params.get("include_inactive") == "true",
        )
        serializer = TeacherSkillOutputSerializer(skills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TeacherSkillCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            ts = teacher_service.add_teacher_skill(
                teacher=request.user.teacher_profile,
                skill_id=data["skill_id"].pk,  # resolved Skill object
                level=data["level"],
                years_of_experience=data.get("years_of_experience", 0),
                price_override=data.get("price_override"),
            )
        except Exception as exc:
            return _map_service_error(exc)

        logger.info(
            "Skill %s added by teacher %s.",
            data["skill_id"].pk,
            request.user.pk,
        )
        return Response(
            {
                "detail": "مهارت با موفقیت اضافه شد.",
                "skill": TeacherSkillOutputSerializer(ts).data,
            },
            status=status.HTTP_201_CREATED,
        )


class MySkillDetailView(APIView):
    """
    GET  /api/teachers/me/skills/{id}/   Retrieve a single TeacherSkill.
    PUT  /api/teachers/me/skills/{id}/   Update level / price / years / active flag.
    DEL  /api/teachers/me/skills/{id}/   Deactivate (soft delete).
    """

    permission_classes = [IsAuthenticated, IsTeacher]

    def _get_own_skill_or_404(self, teacher, skill_id):
        try:
            from apps.teachers.models import TeacherSkill

            ts = TeacherSkill.objects.select_related("skill", "teacher").get(
                pk=skill_id, teacher=teacher
            )
            return ts
        except TeacherSkill.DoesNotExist:
            raise NotFound("مهارت مورد نظر یافت نشد.")

    def get(self, request, skill_id):
        ts = self._get_own_skill_or_404(request.user.teacher_profile, skill_id)
        return Response(
            TeacherSkillOutputSerializer(ts).data, status=status.HTTP_200_OK
        )

    def put(self, request, skill_id):
        serializer = TeacherSkillUpdateSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            ts = teacher_service.update_teacher_skill(
                teacher=request.user.teacher_profile,
                teacher_skill_id=skill_id,
                validated_data=serializer.validated_data,
            )
        except Exception as exc:
            return _map_service_error(exc)

        return Response(
            {
                "detail": "مهارت با موفقیت به‌روزرسانی شد.",
                "skill": TeacherSkillOutputSerializer(ts).data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, skill_id):
        try:
            teacher_service.remove_teacher_skill(
                teacher=request.user.teacher_profile,
                teacher_skill_id=skill_id,
            )
        except Exception as exc:
            return _map_service_error(exc)

        return Response(
            {"detail": "مهارت با موفقیت غیرفعال شد."},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Availability management — teacher only
# ---------------------------------------------------------------------------


class MyAvailabilityView(APIView):
    """
    GET  /api/teachers/me/availability/   List own availability slots.
    POST /api/teachers/me/availability/   Add a single recurring slot.
    """

    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        slots = teacher_service.list_availability_slots(request.user.teacher_profile)
        serializer = AvailabilitySlotOutputSerializer(slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AvailabilitySlotCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            slot = teacher_service.add_availability_slot(
                teacher=request.user.teacher_profile,
                weekday=data["weekday"],
                start_time=data["start_time"],
                end_time=data["end_time"],
            )
        except Exception as exc:
            return _map_service_error(exc)

        return Response(
            {
                "detail": "اسلات زمانی با موفقیت اضافه شد.",
                "slot": AvailabilitySlotOutputSerializer(slot).data,
            },
            status=status.HTTP_201_CREATED,
        )


class BulkAvailabilityView(APIView):
    """
    PUT /api/teachers/me/availability/bulk/

    Atomically replace the teacher's entire weekly schedule.
    Sends an empty slots list to clear all availability.

    Request body
    ------------
    {
        "slots": [
            {"weekday": 0, "start_time": "09:00", "end_time": "11:00"},
            {"weekday": 0, "start_time": "14:00", "end_time": "16:00"},
            {"weekday": 2, "start_time": "10:00", "end_time": "12:00"}
        ]
    }
    """

    permission_classes = [IsAuthenticated, IsTeacher]

    def put(self, request):
        serializer = BulkAvailabilitySlotSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            slots = teacher_service.bulk_replace_availability(
                teacher=request.user.teacher_profile,
                slots_data=serializer.validated_data["slots"],
            )
        except Exception as exc:
            return _map_service_error(exc)

        return Response(
            {
                "detail": f"برنامه هفتگی با موفقیت به‌روزرسانی شد ({len(slots)} اسلات).",
                "slots": AvailabilitySlotOutputSerializer(slots, many=True).data,
            },
            status=status.HTTP_200_OK,
        )


class MyAvailabilitySlotDetailView(APIView):
    """
    GET  /api/teachers/me/availability/{id}/   Retrieve single slot.
    PUT  /api/teachers/me/availability/{id}/   Update slot times / weekday.
    DEL  /api/teachers/me/availability/{id}/   Delete slot permanently.
    """

    permission_classes = [IsAuthenticated, IsTeacher]

    def _get_own_slot_or_404(self, teacher, slot_id):
        from apps.teachers.models import AvailabilitySlot as Slot

        try:
            return Slot.objects.get(pk=slot_id, teacher=teacher)
        except Slot.DoesNotExist:
            raise NotFound("اسلات زمانی مورد نظر یافت نشد.")

    def get(self, request, slot_id):
        slot = self._get_own_slot_or_404(request.user.teacher_profile, slot_id)
        return Response(
            AvailabilitySlotOutputSerializer(slot).data,
            status=status.HTTP_200_OK,
        )

    def put(self, request, slot_id):
        serializer = AvailabilitySlotUpdateSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            slot = teacher_service.update_availability_slot(
                teacher=request.user.teacher_profile,
                slot_id=slot_id,
                validated_data=serializer.validated_data,
            )
        except Exception as exc:
            return _map_service_error(exc)

        return Response(
            {
                "detail": "اسلات زمانی با موفقیت به‌روزرسانی شد.",
                "slot": AvailabilitySlotOutputSerializer(slot).data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, slot_id):
        try:
            teacher_service.remove_availability_slot(
                teacher=request.user.teacher_profile,
                slot_id=slot_id,
            )
        except Exception as exc:
            return _map_service_error(exc)

        return Response(
            {"detail": "اسلات زمانی با موفقیت حذف شد."},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Teacher discovery — any authenticated user
# ---------------------------------------------------------------------------


class TeacherSearchView(APIView):
    """
    GET /api/teachers/

    Paginated teacher search. All query params are optional and composable.

    Query params
    ------------
    skill        Slug of a skill (e.g. ?skill=python)
    name         Substring match on teacher's name
    weekday      Integer 0–6 (filter by available day)
    min_rating   Minimum average rating (e.g. ?min_rating=4.0)
    max_rate     Maximum hourly rate
    page         Page number (default 1)
    page_size    Results per page (default 20, max 100)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        query_serializer = TeacherSearchQuerySerializer(
            data=request.query_params,
        )
        if not query_serializer.is_valid():
            return Response(
                query_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        params = query_serializer.validated_data
        qs = teacher_service.search_teachers(
            skill_slug=params.get("skill") or None,
            name_query=params.get("name") or None,
            weekday=params.get("weekday"),
            min_rating=params.get("min_rating"),
            max_hourly_rate=params.get("max_rate"),
        )

        paginator = TeacherPageNumberPagination()
        page = paginator.paginate_queryset(qs, request, view=self)
        serializer = TeacherPublicProfileSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class TeacherPublicProfileView(APIView):
    """
    GET /api/teachers/{id}/

    Full public profile of a single teacher — skills + availability.
    Accessible to any authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, teacher_id):
        try:
            profile = teacher_service.get_teacher_public_profile(teacher_id)
        except TeacherServiceError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_404_NOT_FOUND)

        serializer = TeacherPublicProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
