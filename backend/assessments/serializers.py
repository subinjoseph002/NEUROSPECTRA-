from rest_framework import serializers
from .models import AssessmentTemplate, AssessmentQuestion, AssessmentRecord
from children.serializers import ChildSerializer
from accounts.serializers import UserSerializer

class AssessmentQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentQuestion
        fields = '__all__'

class AssessmentTemplateSerializer(serializers.ModelSerializer):
    questions = AssessmentQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = AssessmentTemplate
        fields = '__all__'

class AssessmentRecordSerializer(serializers.ModelSerializer):
    child_details = ChildSerializer(source='child', read_only=True)
    therapist_details = UserSerializer(source='therapist', read_only=True)
    template_details = AssessmentTemplateSerializer(source='template', read_only=True)

    class Meta:
        model = AssessmentRecord
        fields = '__all__'
