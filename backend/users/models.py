from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class EmployeeManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email оруулна уу')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(username, email, password, **extra_fields)


class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    permissions = models.JSONField(default=dict)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'roles'
    
    def __str__(self):
        return self.name


class Employee(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, related_name='employees')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = EmployeeManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'full_name']
    
    class Meta:
        db_table = 'employees'
    
    def __str__(self):
        return f"{self.full_name} ({self.username})"