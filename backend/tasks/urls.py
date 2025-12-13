from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, ClientViewSet, StatusViewSet, PriorityViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'statuses', StatusViewSet)
router.register(r'priorities', PriorityViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
