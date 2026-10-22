from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer
from .permissions import IsAdminRole

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response({
                    'message': 'Registration successful. Please login with your credentials.',
                    'user': UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'error': 'Database user creation failed',
                    'detail': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        role = self.request.query_params.get('role')
        if role and role != 'All':
            return User.objects.filter(role=role)
        return User.objects.all()

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': 'Failed to query users from database', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdminRole]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class BulkSyncView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        users_data = request.data.get('users', [])
        synced_count = 0
        for u in users_data:
            email = str(u.get('email', '')).strip().lower()
            if not email:
                continue
            User.objects.update_or_create(
                email=email,
                defaults={
                    'full_name': u.get('full_name', email),
                    'role': u.get('role', 'Parent / Caregiver'),
                    'phone': u.get('phone', ''),
                    'avatar_url': u.get('avatar_url', ''),
                    'is_active': 1 if u.get('is_active', True) else 0,
                }
            )
            synced_count += 1
        return Response({'status': 'success', 'synced': synced_count}, status=status.HTTP_200_OK)

class UserUpdateDirectView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get('id')
        if not user_id:
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = None
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            email = request.data.get('email')
            if email:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    pass
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        for field in ['full_name', 'role', 'phone', 'avatar_url', 'is_active']:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

class UserDeleteDirectView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get('id')
        if not user_id:
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM users WHERE id = %s;", [user_id])
        return Response({'status': 'deleted', 'id': user_id}, status=status.HTTP_200_OK)


