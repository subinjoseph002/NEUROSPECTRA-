from django.db import models
from django.conf import settings
from children.models import Child
from assessments.models import AssessmentRecord

class ClinicalReport(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    report_code = models.CharField(max_length=32, unique=True)
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='reports')
    therapist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    assessment = models.ForeignKey(AssessmentRecord, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    summary = models.TextField()
    recommendations = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=30, default='Official')
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'clinical_reports'
        ordering = ['-generated_at']
