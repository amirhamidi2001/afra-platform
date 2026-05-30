"""
apps.teachers.urls
~~~~~~~~~~~~~~~~~~
URL configuration for the teachers app.

Mount under /api/teachers/ in config/urls.py:

    path("api/teachers/", include("apps.teachers.urls", namespace="teachers")),

Full URL table
--------------
Public / any authenticated user
    GET  api/teachers/                         Browse / search teachers
    GET  api/teachers/<uuid:teacher_id>/       Teacher public profile detail
    GET  api/teachers/skills/                  Active skill catalog

Teacher management (IsTeacher)
    GET  api/teachers/me/skills/               List own skill offerings
    POST api/teachers/me/skills/               Add a skill offering
    GET  api/teachers/me/skills/<uuid:skill_id>/    Retrieve single skill offering
    PUT  api/teachers/me/skills/<uuid:skill_id>/    Update single skill offering
    DEL  api/teachers/me/skills/<uuid:skill_id>/    Deactivate skill offering

    GET  api/teachers/me/availability/                    List own slots
    POST api/teachers/me/availability/                    Add single slot
    PUT  api/teachers/me/availability/bulk/               Replace entire schedule
    GET  api/teachers/me/availability/<uuid:slot_id>/     Retrieve single slot
    PUT  api/teachers/me/availability/<uuid:slot_id>/     Update single slot
    DEL  api/teachers/me/availability/<uuid:slot_id>/     Delete single slot

URL ordering note
-----------------
Static segments (me/, skills/, bulk/) are declared BEFORE uuid patterns so
Django's URL resolver matches them first and avoids treating 'me' or 'bulk'
as UUID values.
"""

from django.urls import path

from apps.teachers.views import (
    BulkAvailabilityView,
    MyAvailabilitySlotDetailView,
    MyAvailabilityView,
    MySkillDetailView,
    MySkillListView,
    SkillListView,
    TeacherPublicProfileView,
    TeacherSearchView,
)

app_name = "teachers"

urlpatterns = [
    # ------------------------------------------------------------------
    # Skill catalog (public read — any authenticated user)
    # ------------------------------------------------------------------
    path(
        "skills/",
        SkillListView.as_view(),
        name="skill-list",
    ),
    # ------------------------------------------------------------------
    # Teacher self-management — skills
    # Static prefix 'me/' declared before <uuid:teacher_id> pattern.
    # ------------------------------------------------------------------
    path(
        "me/skills/",
        MySkillListView.as_view(),
        name="my-skill-list",
    ),
    path(
        "me/skills/<uuid:skill_id>/",
        MySkillDetailView.as_view(),
        name="my-skill-detail",
    ),
    # ------------------------------------------------------------------
    # Teacher self-management — availability
    # 'bulk/' declared BEFORE '<uuid:slot_id>/' to avoid slug collision.
    # ------------------------------------------------------------------
    path(
        "me/availability/",
        MyAvailabilityView.as_view(),
        name="my-availability-list",
    ),
    path(
        "me/availability/bulk/",
        BulkAvailabilityView.as_view(),
        name="my-availability-bulk",
    ),
    path(
        "me/availability/<uuid:slot_id>/",
        MyAvailabilitySlotDetailView.as_view(),
        name="my-availability-detail",
    ),
    # ------------------------------------------------------------------
    # Teacher discovery — any authenticated user
    # 'skills/' and 'me/' declared above; this pattern is last so that
    # Django only reaches it when no static prefix matched.
    # ------------------------------------------------------------------
    path(
        "",
        TeacherSearchView.as_view(),
        name="teacher-search",
    ),
    path(
        "<uuid:teacher_id>/",
        TeacherPublicProfileView.as_view(),
        name="teacher-public-profile",
    ),
]
