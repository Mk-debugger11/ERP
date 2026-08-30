from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from hr_department.employees.models import Branch

class BranchAPITests(APITestCase):
    
    def setUp(self):
        self.branch = Branch.objects.create(
            name='Headquarters',
            code='HQ',
            address='123 Main St',
            city='Mumbai',
            state='MH',
            country='India',
            postal_code='400001',
            is_head_office=True
        )
        self.list_url = reverse('branch-list')
        self.detail_url = reverse('branch-detail', kwargs={'pk': self.branch.id})
        
    def test_list_branches(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Headquarters')
        
    def test_retrieve_branch(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], 'HQ')
        
    def test_create_branch(self):
        data = {
            'name': 'Branch Office 1',
            'code': 'B1',
            'address': '456 Side St',
            'city': 'Delhi',
            'state': 'DL',
            'country': 'India',
            'postal_code': '110001',
            'is_head_office': False
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Branch.objects.count(), 2)
        
    def test_update_branch(self):
        data = {
            'name': 'HQ Updated',
            'code': 'HQ-U',
        }
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.branch.refresh_from_db()
        self.assertEqual(self.branch.name, 'HQ Updated')
        
    def test_delete_branch(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Branch.objects.count(), 0)
