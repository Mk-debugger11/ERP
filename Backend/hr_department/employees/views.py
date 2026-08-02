from rest_framework import viewsets
from .models import Department, Designation, EmploymentType, Branch, Team, Employee
from .serializers import (
    DepartmentSerializer,
    DesignationSerializer,
    EmploymentTypeSerializer,
    BranchSerializer,
    TeamSerializer,
    EmployeeSerializer,
    EmployeeDetailSerializer,
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.select_related('department').all()
    serializer_class = DesignationSerializer


class EmploymentTypeViewSet(viewsets.ModelViewSet):
    queryset = EmploymentType.objects.all()
    serializer_class = EmploymentTypeSerializer


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.select_related('department', 'team_lead').all()
    serializer_class = TeamSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related(
        'department', 
        'designation', 
        'employment_type', 
        'branch', 
        'team', 
        'manager'
    ).all()
    serializer_class = EmployeeSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EmployeeDetailSerializer
        return EmployeeSerializer
