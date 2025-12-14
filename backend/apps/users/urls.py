from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, DepartmentViewSet, AuthViewSet

router = DefaultRouter()
router.register(r"employees", EmployeeViewSet, basename="employees")
router.register(r"departments", DepartmentViewSet, basename="departments")
router.register(r"auth", AuthViewSet, basename="auth")

urlpatterns = [
    path("", include(router.urls)),
]
