from django.urls import path
from . import views

urlpatterns = [
    path('review/submit-url/', views.SubmitReviewView.as_view(), name='submit-review'),
    path('review/status/<str:task_id>/', views.StatusView.as_view(), name='status'),
    path('review/report/', views.ReportView.as_view(), name='report'),
]
