from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from hr_department.employees.models import (
    Branch,
    Department,
    Designation,
    Employee,
    EmploymentType,
    Team,
)


class EmployeeAPITests(APITestCase):
    
    def setUp(self):
        self.department = Department.objects.create(name='Eng', code='E1')
        self.designation = Designation.objects.create(
            title='Dev', code='D1', department=self.department
        )
        self.employment_type = EmploymentType.objects.create(name='Full', code='F1')
        self.branch = Branch.objects.create(name='HQ', code='H1', address='123')
        self.team = Team.objects.create(name='Alpha', code='A1', department=self.department)
        
        self.employee = Employee.objects.create(
            employee_id='EMP-01',
            first_name='John',
            last_name='Doe',
            company_email='john@acme.com',
            phone='1234567890',
            joining_date=timezone.now().date(),
            gender=Employee.Gender.MALE,
            employment_status=Employee.EmploymentStatus.ACTIVE,
            department=self.department,
            designation=self.designation,
            employment_type=self.employment_type,
            branch=self.branch,
            team=self.team
        )
        
        self.list_url = reverse('employee-list')
        self.detail_url = reverse('employee-detail', kwargs={'pk': self.employee.id})
        
    def test_list_employees(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['first_name'], 'John')
        
    def test_retrieve_employee(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['employee_id'], 'EMP-01')
        
    def test_create_employee(self):
        data = {
            'employee_id': 'EMP-02',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'company_email': 'jane@acme.com',
            'phone': '0987654321',
            'joining_date': str(timezone.now().date()),
            'gender': Employee.Gender.FEMALE,
            'employment_status': Employee.EmploymentStatus.PROBATION,
            'department': self.department.id,
            'designation': self.designation.id,
            'employment_type': self.employment_type.id,
            'branch': self.branch.id,
            'team': self.team.id
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 2)
        
    def test_update_employee(self):
        data = {
            'first_name': 'Johnathan',
            'last_name': 'Doe',
            'department': self.department.id,
            'designation': self.designation.id,
            'employment_type': self.employment_type.id,
            'branch': self.branch.id,
        }
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.employee.refresh_from_db()
        self.assertEqual(self.employee.first_name, 'Johnathan')
        
    def test_delete_employee(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Employee.objects.count(), 0)
