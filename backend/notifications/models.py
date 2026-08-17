from django.db import models
from django.conf import settings
from children.models import Child

class Notification(models.Model):
    TYPE_CHOICES = (
        ('appointment', 'appointment'),
        ('assessment', 'assessment'),
        ('system', 'system'),
        ('therapy', 'therapy'),
        ('message', 'message'),
    )

    id = models.CharField(max_length=64, primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='system')
    link = models.CharField(max_length=255, default='#')
    is_read = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

class Message(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    child = models.ForeignKey(Child, on_delete=models.SET_NULL, null=True, blank=True)
    message_text = models.TextField()
    is_read = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages'
        ordering = ['created_at']
