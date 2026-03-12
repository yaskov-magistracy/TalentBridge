from django.db import models
from django.utils import timezone

class AnalysisReport(models.Model):
    task_id = models.CharField(max_length=255, unique=True)
    github_url = models.URLField()
    language = models.CharField(max_length=50, default='unknown')
    pep8_score = models.FloatField(null=True)
    architecture_score = models.FloatField(null=True)
    best_practices_score = models.FloatField(null=True)
    files_analyzed = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, default='pending')
    
    def __str__(self):
        return f"Report {self.task_id}"
