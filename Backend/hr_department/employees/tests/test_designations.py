from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from hr_department.employees.models import Department, Designation

class DesignationAPITests(APITestCase):
    
    def setUp(self):
        self.department = Department.objects.create(
            name='Engineering',
            code='ENG',
            description='Software Development'
        )
        self.designation = Designation.objects.create(
            title='Software Engineer',
            code='SE',
            description='Backend Developer',
            department=self.department,
            level=2
        )
        self.list_url = reverse('designation-list')
        self.detail_url = reverse('designation-detail', kwargs={'pk': self.designation.id})
        
    def test_list_designations(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Software Engineer')
        
    def test_retrieve_designation(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], 'SE')
        
    def test_create_designation(self):
        data = {
            'title': 'Senior Software Engineer',
            'code': 'SSE',
            'description': 'Senior Backend Developer',
            'department': self.department.id,
            'level': 3
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Designation.objects.count(), 2)
        
    def test_update_designation(self):
        data = {
            'title': 'Software Engineer II',
            'code': 'SE-2',
            'department': self.department.id, # Often required for PUT if not using PATCH
        }
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.designation.refresh_from_db()
        self.assertEqual(self.designation.title, 'Software Engineer II')
        
    def test_delete_designation(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Designation.objects.count(), 0)
