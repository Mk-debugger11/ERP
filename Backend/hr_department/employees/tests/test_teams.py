from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from hr_department.employees.models import Department, Team


class TeamAPITests(APITestCase):
    
    def setUp(self):
        self.department = Department.objects.create(
            name='Engineering',
            code='ENG',
            description='Software Development'
        )
        self.team = Team.objects.create(
            name='Backend Team',
            code='BE',
            department=self.department,
            description='Core Backend APIs'
        )
        self.list_url = reverse('team-list')
        self.detail_url = reverse('team-detail', kwargs={'pk': self.team.id})
        
    def test_list_teams(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Backend Team')
        
    def test_retrieve_team(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], 'BE')
        
    def test_create_team(self):
        data = {
            'name': 'Frontend Team',
            'code': 'FE',
            'department': self.department.id,
            'description': 'UI/UX and Web App'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 2)
        
    def test_update_team(self):
        data = {
            'name': 'Backend Team Updated',
            'code': 'BE-U',
            'department': self.department.id,
        }
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.team.refresh_from_db()
        self.assertEqual(self.team.name, 'Backend Team Updated')
        
    def test_delete_team(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Team.objects.count(), 0)
