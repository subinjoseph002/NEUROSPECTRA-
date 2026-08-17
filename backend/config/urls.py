"""
URL configuration for NEUROSPECTRA project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/children/', include('children.urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/therapy/', include('therapy.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/notifications/', include('notifications.urls')),
]
