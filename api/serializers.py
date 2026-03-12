import rest_framework
from rest_framework import serializers

class GitHubUrlSerializer(serializers.Serializer):
    github_url = serializers.URLField()

class ReportSerializer(serializers.Serializer):
    report = serializers.CharField()
