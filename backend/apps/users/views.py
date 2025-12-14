from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import Employee, Department
from .serializers import (
    EmployeeSerializer, EmployeeCreateSerializer,
    DepartmentSerializer, LoginSerializer
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # create/update/delete-г зөвхөн admin
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related("department").all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return EmployeeCreateSerializer
        return EmployeeSerializer

    def get_permissions(self):
        if self.action in ["list", "create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=["get"])
    def me(self, request):
        return Response(EmployeeSerializer(request.user).data)

    @action(detail=False, methods=["patch"])
    def me_update(self, request):
        ser = EmployeeCreateSerializer(request.user, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(EmployeeSerializer(request.user).data)


class AuthViewSet(viewsets.ViewSet):
    """
    /api/auth/login/  -> JWT token + user
    """
    permission_classes = []

    @action(detail=False, methods=["post"])
    def login(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        return Response(ser.validated_data, status=status.HTTP_200_OK)
