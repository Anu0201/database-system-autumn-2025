from django.db import models
from django.contrib.auth.models import AbstractUser


class Department(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "departments"

    def __str__(self):
        return self.name


class Employee(AbstractUser):
    # AbstractUser дээр: username, first_name, last_name, email, is_active, etc. already бий
    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=30, blank=True)
    position = models.CharField(max_length=120, blank=True)

    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("manager", "Manager"),
        ("staff", "Staff"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="staff")

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "employees"

    @property
    def full_name(self) -> str:
        name = f"{self.first_name} {self.last_name}".strip()
        return name if name else self.username
