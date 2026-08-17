import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, role='Parent / Caregiver', **extra_fields):
        if not email:
            raise ValueError('Email is required.')
        email = self.normalize_email(email).lower()
        user = self.model(email=email, full_name=full_name, role=role, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', 1)
        return self.create_user(email, full_name, password, role='Administrator', **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('Administrator', 'Administrator'),
        ('Therapist', 'Therapist'),
        ('Receptionist', 'Receptionist'),
        ('Parent / Caregiver', 'Parent / Caregiver'),
        ('Teacher', 'Teacher'),
    )

    phone_regex = RegexValidator(
        regex=r'^[6-9]\d{9}$',
        message='Enter a valid 10-digit mobile number.'
    )

    id = models.CharField(max_length=64, primary_key=True, default=lambda: f"usr_{uuid.uuid4().hex[:12]}")
    full_name = models.CharField(max_length=120)
    email = models.EmailField(max_length=100, unique=True, db_index=True)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default='Parent / Caregiver', db_index=True)
    phone = models.CharField(validators=[phone_regex], max_length=15, blank=True, null=True)
    avatar_url = models.TextField(blank=True, null=True, default='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128')
    is_active = models.SmallIntegerField(default=1)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.role})"
