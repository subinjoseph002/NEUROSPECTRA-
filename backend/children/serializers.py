from rest_framework import serializers
from .models import Child
from accounts.serializers import UserSerializer

class ChildSerializer(serializers.ModelSerializer):
    parent_details = UserSerializer(source='primary_parent', read_only=True)
    therapist_details = UserSerializer(source='assigned_therapist', read_only=True)

    class Meta:
        model = Child
        fields = '__all__'
