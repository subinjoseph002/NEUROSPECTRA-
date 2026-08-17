from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import TherapyPlan, TherapySession, ProgressRecord
from .serializers import TherapyPlanSerializer, TherapySessionSerializer, ProgressRecordSerializer

class TherapyPlanListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TherapyPlanSerializer

    def get_queryset(self):
        queryset = TherapyPlan.objects.all()
        child_id = self.request.query_params.get('child_id')
        if child_id:
            queryset = queryset.filter(child_id=child_id)
        return queryset

class TherapyPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = TherapyPlan.objects.all()
    serializer_class = TherapyPlanSerializer

class TherapySessionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TherapySessionSerializer

    def get_queryset(self):
        queryset = TherapySession.objects.all()
        child_id = self.request.query_params.get('child_id')
        if child_id:
            queryset = queryset.filter(child_id=child_id)
        return queryset

class ProgressRecordListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProgressRecordSerializer

    def get_queryset(self):
        queryset = ProgressRecord.objects.all()
        child_id = self.request.query_params.get('child_id')
        if child_id:
            queryset = queryset.filter(child_id=child_id)
        return queryset
