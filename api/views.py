from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class SubmitReviewView(APIView):
    def post(self, request):
        url = request.data.get('github_url', '')
        return Response({
            'task_id': 'demo-123', 
            'status': 'PENDING',
            'message': f'Получен GitHub URL: {url}'
        })

class StatusView(APIView):
    def get(self, request, task_id):
        return Response({
            'task_id': task_id,
            'status': 'SUCCESS',
            'result': {'pep8_score': 0.92, 'files': 15}
        })

class ReportView(APIView):
    def post(self, request):
        return Response({'status': 'report_saved'})
