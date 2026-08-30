from rest_framework import serializers
from .models import Department, Designation, EmploymentType, Branch, Team, Employee


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departments
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class DesignationSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Designation
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class EmploymentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentType
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class TeamSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    team_lead_name = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_team_lead_name(self, obj):
        if obj.team_lead:
            return f"{obj.team_lead.first_name} {obj.team_lead.last_name}"
        return None


class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    designation_title = serializers.CharField(source='designation.title', read_only=True)
    employment_type_name = serializers.CharField(source='employment_type.name', read_only=True)
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    team_name = serializers.CharField(source='team.name', read_only=True)
    manager_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.first_name} {obj.manager.last_name}"
        return None


class EmployeeDetailSerializer(EmployeeSerializer):
   
    department = DepartmentSerializer(read_only=True)
    designation = DesignationSerializer(read_only=True)
    employment_type = EmploymentTypeSerializer(read_only=True)
    branch = BranchSerializer(read_only=True)
    team = TeamSerializer(read_only=True)

    class Meta(EmployeeSerializer.Meta):
        pass
