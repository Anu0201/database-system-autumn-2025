from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import serializers, viewsets
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'username', 'full_name', 'email', 'phone']

class EmployeeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Employee.objects.filter(is_active=True)
    serializer_class = EmployeeSerializer

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
