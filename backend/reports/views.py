from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import ClinicalReport
from .serializers import ClinicalReportSerializer

class ClinicalReportListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ClinicalReportSerializer

    def get_queryset(self):
        child_id = self.request.query_params.get('child_id')
        if child_id:
            return ClinicalReport.objects.filter(child_id=child_id)
        return ClinicalReport.objects.all()

class ClinicalReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ClinicalReport.objects.all()
    serializer_class = ClinicalReportSerializer
