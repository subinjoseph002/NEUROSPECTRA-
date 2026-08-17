from django.db import models
from django.conf import settings
from children.models import Child

class TherapyPlan(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='therapy_plans')
    therapist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='supervised_therapy_plans')
    start_date = models.DateField()
    review_date = models.DateField(blank=True, null=True)
    diagnosis_summary = models.TextField(blank=True, null=True)
    sensory_profile = models.TextField(blank=True, null=True)
    goals_json = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=30, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'therapy_plans'
        ordering = ['-created_at']

class TherapySession(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    therapy_plan = models.ForeignKey(TherapyPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='therapy_sessions')
    therapist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conducted_sessions')
    session_date = models.DateField()
    duration_mins = models.IntegerField(default=45)
    session_type = models.CharField(max_length=100, default='Sensory Integration & Communication')
    activities_done = models.TextField(blank=True, null=True)
    observations = models.TextField(blank=True, null=True)
    progress_rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    parent_feedback = models.TextField(blank=True, null=True)
    next_session_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'therapy_sessions'
        ordering = ['-session_date']

class ProgressRecord(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='progress_records')
    therapist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    record_date = models.DateField()
    social_score = models.IntegerField(default=50)
    communication_score = models.IntegerField(default=50)
    sensory_score = models.IntegerField(default=50)
    behavioural_score = models.IntegerField(default=50)
    milestones_achieved = models.TextField(blank=True, null=True)
    therapist_remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'progress_records'
        ordering = ['-record_date']
