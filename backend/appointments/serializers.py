from rest_framework import serializers
from .models import Appointment
from children.serializers import ChildSerializer
from accounts.serializers import UserSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    child_details = ChildSerializer(source='child', read_only=True)
    therapist_details = UserSerializer(source='therapist', read_only=True)
    booked_by_details = UserSerializer(source='booked_by_user', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
