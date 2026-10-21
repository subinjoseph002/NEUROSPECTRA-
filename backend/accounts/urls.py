from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView, RegisterView, ProfileView, UserListCreateView, UserDetailView,
    BulkSyncView, UserUpdateDirectView, UserDeleteDirectView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='auth-login'),
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/update/', UserUpdateDirectView.as_view(), name='user-direct-update'),
    path('users/delete/', UserDeleteDirectView.as_view(), name='user-direct-delete'),
    path('users/<str:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('bulk-sync/', BulkSyncView.as_view(), name='auth-bulk-sync'),
]
