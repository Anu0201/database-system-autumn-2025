from django.db import models
from users.models import Employee


class Client(models.Model):
    name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'clients'
    
    def __str__(self):
        return self.name


class Status(models.Model):
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7, default='#808080')
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'statuses'
    
    def __str__(self):
        return self.name


class Priority(models.Model):
    name = models.CharField(max_length=100, unique=True)
    level = models.IntegerField(default=0)
    color = models.CharField(max_length=7, default='#808080')
    
    class Meta:
        db_table = 'priorities'
    
    def __str__(self):
        return self.name


class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='created_tasks')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='tasks')
    status = models.ForeignKey(Status, on_delete=models.PROTECT, related_name='tasks')
    priority = models.ForeignKey(Priority, on_delete=models.PROTECT, related_name='tasks')
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tasks'
    
    def __str__(self):
        return self.title


class TaskAssignment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='task_assignments')
    role_in_task = models.CharField(max_length=20, default='executor')
    assigned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'task_assignments'


class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'comments'


class TaskLog(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='logs')
    actor = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='actions')
    action_type = models.CharField(max_length=30)
    details = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'task_logs'