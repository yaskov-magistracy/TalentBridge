import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

@pytest.fixture
def api_client():
    """API клиент для тестов"""
    return APIClient()

@pytest.fixture
def superuser():
    """Суперпользователь для тестов"""
    return get_user_model().objects.create_superuser(
        username='testuser',
        email='test@example.com', 
        password='testpass123'
    )
