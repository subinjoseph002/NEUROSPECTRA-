from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Child
from .serializers import ChildSerializer

class ChildListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Parent / Caregiver':
            return Child.objects.filter(primary_parent=user)
        elif user.role == 'Therapist':
            return Child.objects.filter(assigned_therapist=user)
        return Child.objects.all()

class ChildDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Child.objects.all()
    serializer_class = ChildSerializer
