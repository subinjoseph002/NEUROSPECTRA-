from django.db import models
from django.conf import settings

class Child(models.Model):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )

    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Under Assessment', 'Under Assessment'),
        ('Inactive', 'Inactive'),
        ('Discharged', 'Discharged'),
    )

    id = models.CharField(max_length=64, primary_key=True)
    child_code = models.CharField(max_length=32, unique=True)
    first_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    dob = models.DateField()
    age_months = models.IntegerField(default=36)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Male')
    blood_group = models.CharField(max_length=10, blank=True, null=True, default='O+')
    address = models.TextField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=120, blank=True, null=True)
    primary_parent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='children_as_parent')
    assigned_therapist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='children_as_therapist')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Active')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'children'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.child_code})"
