from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from hr_department.employees.models import EmploymentType

class EmploymentTypeAPITests(APITestCase):
    
    def setUp(self):
        self.employment_type = EmploymentType.objects.create(
            name='Full-Time',
            code='FT',
            description='Standard 40 hours per week'
        )
        self.list_url = reverse('employment-type-list')
        self.detail_url = reverse('employment-type-detail', kwargs={'pk': self.employment_type.id})
        
    def test_list_employment_types(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Full-Time')
        
    def test_retrieve_employment_type(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], 'FT')
        
    def test_create_employment_type(self):
        data = {
            'name': 'Part-Time',
            'code': 'PT',
            'description': 'Less than 40 hours per week'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EmploymentType.objects.count(), 2)
        
    def test_update_employment_type(self):
        data = {
            'name': 'Full-Time Updated',
            'code': 'FT-U',
        }
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.employment_type.refresh_from_db()
        self.assertEqual(self.employment_type.name, 'Full-Time Updated')
        
    def test_delete_employment_type(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(EmploymentType.objects.count(), 0)
