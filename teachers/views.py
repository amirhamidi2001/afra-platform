from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.models import TeacherProfile
from .models import SessionRequest
from .serializers import (
    SessionRequestSerializer,
    TeacherApplySerializer,
    TeacherDetailSerializer,
    TeacherListSerializer,
)


class TeacherViewSet(viewsets.GenericViewSet):
    """
    Only explicitly defined actions are available.
    Full CRUD is not automatically exposed.
    """

    queryset = TeacherProfile.objects.select_related("user").filter(approved=True)
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        if self.action == "list":
            return TeacherListSerializer
        if self.action == "apply":
            return TeacherApplySerializer
        if self.action == "request_session":
            return SessionRequestSerializer
        return TeacherDetailSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAuthenticated()]

    # ------------------------------------------------------------------
    # GET /api/teachers/
    # ------------------------------------------------------------------
    def list(self, request):
        """Returns filtered teacher list."""
        queryset = self.get_queryset()

        subject = request.query_params.get("subject")
        if subject:
            queryset = queryset.filter(subject__icontains=subject)

        city = request.query_params.get("city")
        if city:
            queryset = queryset.filter(city__icontains=city)

        teaching_method = request.query_params.get("teaching_method")
        if teaching_method:
            queryset = queryset.filter(teaching_method=teaching_method)

        serializer = TeacherListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response({"results": serializer.data, "count": queryset.count()})

    # ------------------------------------------------------------------
    # GET /api/teachers/{id}/
    # ------------------------------------------------------------------
    def retrieve(self, request, pk=None):
        """Returns detailed teacher information."""
        teacher = self.get_object()
        serializer = TeacherDetailSerializer(teacher, context={"request": request})
        return Response(serializer.data)

    # ------------------------------------------------------------------
    # POST /api/teachers/apply/
    # ------------------------------------------------------------------
    @action(detail=False, methods=["post"], url_path="apply")
    def apply(self, request):
        serializer = TeacherApplySerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile = serializer.save()
        return Response(
            {
                "success": True,
                "message": "درخواست شما با موفقیت ثبت شد و پس از تأیید مدیر فعال می‌شود.",
                "profile_id": profile.pk,
            },
            status=status.HTTP_201_CREATED,
        )

    # ------------------------------------------------------------------
    # POST /api/teachers/{id}/request_session/
    # ------------------------------------------------------------------
    @action(detail=True, methods=["post"], url_path="request_session")
    def request_session(self, request, pk=None):
        teacher = self.get_object()

        data = request.data.copy()
        data["teacher_id"] = teacher.pk

        serializer = SessionRequestSerializer(data=data, context={"request": request})
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session_request = serializer.save()
        return Response(
            {
                "success": True,
                "message": "درخواست جلسه شما با موفقیت ثبت شد.",
                "request_id": session_request.pk,
            },
            status=status.HTTP_201_CREATED,
        )
