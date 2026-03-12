import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'code_review.settings')
app = Celery('code_review')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
