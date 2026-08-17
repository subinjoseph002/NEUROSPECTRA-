import re
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'role', 'phone', 'avatar_url', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate_email(self, value):
        clean_email = (value or '').strip().lower()
        if not clean_email:
            raise serializers.ValidationError("Email is required.")
        if len(clean_email) > 100:
            raise serializers.ValidationError("Email must not exceed 100 characters.")
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, clean_email):
            raise serializers.ValidationError("Enter a valid email address.")
        return clean_email

    def validate_password(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Password is required.")
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        return value

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(username=email, password=password)
        if not user:
            # Check if user exists to verify inactive status vs wrong password
            try:
                candidate = User.objects.get(email=email)
                if candidate.is_active == 0:
                    raise serializers.ValidationError("Your account is inactive. Please contact the administrator.")
            except User.DoesNotExist:
                pass
            raise serializers.ValidationError("Invalid email or password.")

        if user.is_active == 0:
            raise serializers.ValidationError("Your account is inactive. Please contact the administrator.")

        refresh = RefreshToken.for_user(user)
        return {
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }

class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)
    role = serializers.CharField(required=False, default='Parent / Caregiver')
    agree_terms = serializers.BooleanField(required=True)

    def validate_full_name(self, value):
        clean_name = (value or '').strip()
        if not clean_name:
            raise serializers.ValidationError("Full name is required.")
        if len(clean_name) < 3:
            raise serializers.ValidationError("Full name must contain at least 3 characters.")
        if len(clean_name) > 100:
            raise serializers.ValidationError("Full name must not exceed 100 characters.")
        if not re.match(r"^[a-zA-Z\s'-]+$", clean_name):
            raise serializers.ValidationError("Enter a valid name.")
        return clean_name

    def validate_email(self, value):
        clean_email = (value or '').strip().lower()
        if not clean_email:
            raise serializers.ValidationError("Email is required.")
        if len(clean_email) > 100:
            raise serializers.ValidationError("Email must not exceed 100 characters.")
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, clean_email):
            raise serializers.ValidationError("Enter a valid email address.")
        if User.objects.filter(email=clean_email).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return clean_email

    def validate_phone(self, value):
        clean_phone = (value or '').strip()
        if not clean_phone:
            raise serializers.ValidationError("Phone number is required.")
        digits_only = re.sub(r'\D', '', clean_phone)
        if len(digits_only) == 12 and digits_only.startswith('91'):
            digits_only = digits_only[2:]
        elif len(digits_only) == 11 and digits_only.startswith('0'):
            digits_only = digits_only[1:]
        
        if not re.match(r'^[6-9]\d{9}$', digits_only):
            raise serializers.ValidationError("Enter a valid 10-digit mobile number.")
        return f"+91 {digits_only}"

    def validate_password(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Password is required.")
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r'[@$!%*?&#^()_+\-=\[\]{};:\'",.<>\/\\|`~]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def validate_agree_terms(self, value):
        if not value:
            raise serializers.ValidationError("Please accept the Terms and Conditions.")
        return value

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": ["Passwords do not match."]})

        role = attrs.get('role', 'Parent / Caregiver')
        # Backend Role Authorization Guard: Public registration cannot create privileged roles
        if role in ['Administrator', 'Therapist', 'Receptionist']:
            raise serializers.ValidationError({"role": [f"Public registration for '{role}' is not allowed. Accounts for this role must be provisioned by a Clinic Administrator."]})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data.pop('agree_terms')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user
