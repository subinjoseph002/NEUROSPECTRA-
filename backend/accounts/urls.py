from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView, RegisterView, ProfileView, UserListCreateView, UserDetailView,
    BulkSyncView, UserUpdateDirectView, UserDeleteDirectView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='auth-login'),
    path('login', LoginView.as_view(), name='auth-login-noslash'),
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('register', RegisterView.as_view(), name='auth-register-noslash'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/refresh', TokenRefreshView.as_view(), name='token-refresh-noslash'),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('profile', ProfileView.as_view(), name='user-profile-noslash'),
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users', UserListCreateView.as_view(), name='user-list-create-noslash'),
    path('users/update/', UserUpdateDirectView.as_view(), name='user-direct-update'),
    path('users/update', UserUpdateDirectView.as_view(), name='user-direct-update-noslash'),
    path('users/delete/', UserDeleteDirectView.as_view(), name='user-direct-delete'),
    path('users/delete', UserDeleteDirectView.as_view(), name='user-direct-delete-noslash'),
    path('users/<str:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/<str:pk>', UserDetailView.as_view(), name='user-detail-noslash'),
    path('bulk-sync/', BulkSyncView.as_view(), name='auth-bulk-sync'),
    path('bulk-sync', BulkSyncView.as_view(), name='auth-bulk-sync-noslash'),
]
