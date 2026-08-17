from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import AssessmentTemplate, AssessmentRecord
from .serializers import AssessmentTemplateSerializer, AssessmentRecordSerializer

class AssessmentTemplateListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AssessmentTemplate.objects.all()
    serializer_class = AssessmentTemplateSerializer

class AssessmentRecordListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AssessmentRecordSerializer

    def get_queryset(self):
        queryset = AssessmentRecord.objects.all()
        child_id = self.request.query_params.get('child_id')
        if child_id:
            queryset = queryset.filter(child_id=child_id)
        return queryset

class AssessmentRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AssessmentRecord.objects.all()
    serializer_class = AssessmentRecordSerializer
