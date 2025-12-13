from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Task, Client, Status, Priority, TaskLog
from .serializers import (
    TaskSerializer, TaskDetailSerializer, ClientSerializer,
    StatusSerializer, PrioritySerializer, TaskLogSerializer,
    TaskAssignmentSerializer
)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related(
        'created_by', 'client', 'status', 'priority'
    ).prefetch_related('assignments__employee', 'logs__actor')
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'client']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'due_date']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TaskDetailSerializer
        return TaskSerializer
    
    def perform_create(self, serializer):
        task = serializer.save(created_by=self.request.user)
        # Лог үүсгэх
        TaskLog.objects.create(
            task=task,
            actor=self.request.user,
            action_type='created',
            details={'title': task.title}
        )
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Employee-д таск хуваарилах"""
        task = self.get_object()
        serializer = TaskAssignmentSerializer(data=request.data)
        
        if serializer.is_valid():
            assignment = serializer.save(task=task)
            # Лог үүсгэх
            TaskLog.objects.create(
                task=task,
                actor=request.user,
                action_type='task_assigned',
                details={
                    'employee': assignment.employee.full_name,
                    'role': assignment.role_in_task
                }
            )
            return Response(TaskAssignmentSerializer(assignment).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        """Төлөв солих"""
        task = self.get_object()
        status_id = request.data.get('status_id')
        
        try:
            new_status = Status.objects.get(id=status_id)
            old_status = task.status
            task.status = new_status
            task.save()
            
            # Лог үүсгэх
            TaskLog.objects.create(
                task=task,
                actor=request.user,
                action_type='status_change',
                details={
                    'old_status': old_status.name,
                    'new_status': new_status.name
                }
            )
            
            return Response(TaskDetailSerializer(task).data)
        except Status.DoesNotExist:
            return Response(
                {'error': 'Төлөв олдсонгүй'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def logs(self, request, pk=None):
        """Таскын логууд"""
        task = self.get_object()
        logs = task.logs.select_related('actor').all()
        return Response(TaskLogSerializer(logs, many=True).data)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

class StatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    permission_classes = [IsAuthenticated]

class PriorityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Priority.objects.all()
    serializer_class = PrioritySerializer
    permission_classes = [IsAuthenticated]
