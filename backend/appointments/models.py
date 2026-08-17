from django.db import models
from django.conf import settings
from children.models import Child

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('Confirmed', 'Confirmed'),
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )

    id = models.CharField(max_length=64, primary_key=True)
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='appointments')
    therapist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='therapist_appointments')
    booked_by_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='booked_appointments')
    appointment_date = models.DateField()
    start_time = models.CharField(max_length=20)
    end_time = models.CharField(max_length=20)
    type = models.CharField(max_length=100, default='Clinical Therapy Session')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Confirmed')
    notes = models.TextField(blank=True, null=True)
    reminder_sent = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'appointments'
        ordering = ['appointment_date', 'start_time']
