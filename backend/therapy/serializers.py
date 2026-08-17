from rest_framework import serializers
from .models import TherapyPlan, TherapySession, ProgressRecord
from children.serializers import ChildSerializer
from accounts.serializers import UserSerializer

class TherapyPlanSerializer(serializers.ModelSerializer):
    child_details = ChildSerializer(source='child', read_only=True)
    therapist_details = UserSerializer(source='therapist', read_only=True)

    class Meta:
        model = TherapyPlan
        fields = '__all__'

class TherapySessionSerializer(serializers.ModelSerializer):
    child_details = ChildSerializer(source='child', read_only=True)
    therapist_details = UserSerializer(source='therapist', read_only=True)

    class Meta:
        model = TherapySession
        fields = '__all__'

class ProgressRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressRecord
        fields = '__all__'
