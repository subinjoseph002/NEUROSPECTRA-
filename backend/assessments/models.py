from django.db import models
from django.conf import settings
from children.models import Child

class AssessmentTemplate(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    total_questions = models.IntegerField(default=20)
    scoring_method = models.CharField(max_length=60, default='Risk_Indicator_Scoring')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assessment_templates'

    def __str__(self):
        return self.title

class AssessmentQuestion(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    template = models.ForeignKey(AssessmentTemplate, on_delete=models.CASCADE, related_name='questions')
    order_num = models.IntegerField()
    domain = models.CharField(max_length=100)
    text = models.TextField()
    type = models.CharField(max_length=30, default='yes_no')
    reverse_scored = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assessment_questions'
        ordering = ['order_num']

class AssessmentRecord(models.Model):
    RISK_LEVEL_CHOICES = (
        ('Low Risk Indicator', 'Low Risk Indicator'),
        ('Medium Risk Indicator', 'Medium Risk Indicator'),
        ('High Risk Indicator', 'High Risk Indicator'),
    )

    id = models.CharField(max_length=64, primary_key=True)
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='assessments')
    therapist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conducted_assessments')
    template = models.ForeignKey(AssessmentTemplate, on_delete=models.CASCADE)
    status = models.CharField(max_length=30, default='Completed')
    total_score = models.IntegerField(default=0)
    risk_level = models.CharField(max_length=30, choices=RISK_LEVEL_CHOICES, default='Low Risk Indicator')
    risk_color = models.CharField(max_length=30, default='emerald')
    therapist_notes = models.TextField(blank=True, null=True)
    responses_json = models.JSONField(default=dict, blank=True)
    completed_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assessment_records'
        ordering = ['-completed_at']
