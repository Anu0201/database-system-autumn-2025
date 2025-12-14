from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Employee, Department


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "description", "created_at"]


class EmployeeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id", "username", "email",
            "first_name", "last_name", "full_name",
            "phone", "position", "role",
            "department", "department_id",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class EmployeeCreateSerializer(EmployeeSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta(EmployeeSerializer.Meta):
        fields = EmployeeSerializer.Meta.fields + ["password"]

    def create(self, validated_data):
        dept_id = validated_data.pop("department_id", None)
        password = validated_data.pop("password")

        user = Employee(**validated_data)
        if dept_id:
            user.department_id = dept_id
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        # PATCH дээр password ирвэл солих боломж
        dept_id = validated_data.pop("department_id", None)
        password = validated_data.pop("password", None)

        for k, v in validated_data.items():
            setattr(instance, k, v)
        if dept_id is not None:
            instance.department_id = dept_id

        if password:
            instance.set_password(password)

        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()   # username эсвэл email
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login = attrs["login"]
        password = attrs["password"]

        # email-р орж ирвэл username болгож authenticate хийх
        username = login
        if "@" in login:
            user = Employee.objects.filter(email__iexact=login).first()
            if user:
                username = user.username

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Нэвтрэх нэр/имэйл эсвэл нууц үг буруу байна.")
        if not user.is_active:
            raise serializers.ValidationError("Хэрэглэгч идэвхгүй байна.")

        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": EmployeeSerializer(user).data,
        }
