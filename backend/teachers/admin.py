from django.contrib import admin

from apps.teachers.models import AvailabilitySlot, Skill, TeacherSkill


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_active", "created_at"]
    list_filter = ["is_active"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ["id", "created_at", "updated_at"]


class TeacherSkillInline(admin.TabularInline):
    model = TeacherSkill
    extra = 0
    readonly_fields = ["id", "created_at", "updated_at"]
    fields = ["skill", "level", "years_of_experience", "price_override", "is_active"]


class AvailabilitySlotInline(admin.TabularInline):
    model = AvailabilitySlot
    extra = 0
    readonly_fields = ["id", "created_at", "updated_at"]
    fields = ["weekday", "start_time", "end_time"]


@admin.register(TeacherSkill)
class TeacherSkillAdmin(admin.ModelAdmin):
    list_display = ["teacher", "skill", "level", "price_override", "is_active"]
    list_filter = ["level", "is_active"]
    search_fields = ["teacher__user__email", "skill__name"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(AvailabilitySlot)
class AvailabilitySlotAdmin(admin.ModelAdmin):
    list_display = ["teacher", "weekday", "start_time", "end_time", "created_at"]
    list_filter = ["weekday"]
    search_fields = ["teacher__user__email"]
    readonly_fields = ["id", "created_at", "updated_at"]
