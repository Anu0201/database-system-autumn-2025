from rest_framework import serializers
from .models import Task, Client, Status, Priority, TaskLog, Comment, TaskAssignment
from users.models import Employee

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name', 'contact_person', 'email', 'phone']

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'name', 'color', 'order']

class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = ['id', 'name', 'level', 'color']

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'username', 'full_name', 'email']

class TaskSerializer(serializers.ModelSerializer):
    created_by = EmployeeSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    client_id = serializers.IntegerField(write_only=True)
    status = StatusSerializer(read_only=True)
    status_id = serializers.IntegerField(write_only=True)
    priority = PrioritySerializer(read_only=True)
    priority_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'created_by', 
            'client', 'client_id', 'status', 'status_id',
            'priority', 'priority_id', 'due_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class TaskLogSerializer(serializers.ModelSerializer):
    actor = EmployeeSerializer(read_only=True)
    
    class Meta:
        model = TaskLog
        fields = ['id', 'actor', 'action_type', 'details', 'timestamp']

class TaskAssignmentSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    employee_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = TaskAssignment
        fields = ['id', 'employee', 'employee_id', 'role_in_task', 'assigned_at', 'accepted_at']

class TaskDetailSerializer(TaskSerializer):
    assignments = TaskAssignmentSerializer(many=True, read_only=True)
    logs = TaskLogSerializer(many=True, read_only=True)
    
    class Meta(TaskSerializer.Meta):
        fields = TaskSerializer.Meta.fields + ['assignments', 'logs']
