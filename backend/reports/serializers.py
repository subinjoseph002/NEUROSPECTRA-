from rest_framework import serializers
from .models import ClinicalReport
from children.serializers import ChildSerializer
from accounts.serializers import UserSerializer
from assessments.serializers import AssessmentRecordSerializer

class ClinicalReportSerializer(serializers.ModelSerializer):
    child_details = ChildSerializer(source='child', read_only=True)
    therapist_details = UserSerializer(source='therapist', read_only=True)
    assessment_details = AssessmentRecordSerializer(source='assessment', read_only=True)

    class Meta:
        model = ClinicalReport
        fields = '__all__'
