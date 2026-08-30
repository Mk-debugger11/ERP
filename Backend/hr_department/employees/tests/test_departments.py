from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from hr_department.employees.models import Department

class DepartmentAPITests(APITestCase):
    
    def setUp(self):
        self.department = Department.objects.create(
            name='Engineering',
            code='ENG',
            description='Software Development'
        )
        self.list_url = reverse('department-list')
        self.detail_url = reverse('department-detail', kwargs={'pk': self.department.id})
        
    def test_list_departments(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Engineering')
        
    def test_retrieve_department(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], 'ENG')
        
    def test_create_department(self):
        data = {
            'name': 'Human Resources',
            'code': 'HR',
            'description': 'HR Department'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Department.objects.count(), 2)
        
    def test_update_department(self):
        data = {
            'name': 'Engineering Updated',
            'code': 'ENG-U',
        }
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.department.refresh_from_db()
        self.assertEqual(self.department.name, 'Engineering Updated')
        
    def test_delete_department(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Department.objects.count(), 0)
