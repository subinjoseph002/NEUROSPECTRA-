"""
URL configuration for NEUROSPECTRA project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "service": "NEUROSPECTRA Clinical REST API",
        "version": "1.2.0",
        "platform": "Render Cloud Web Service"
    })

urlpatterns = [
    path('', health_check, name='root_health_check'),
    path('api/health/', health_check, name='api_health_check'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/children/', include('children.urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/therapy/', include('therapy.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/notifications/', include('notifications.urls')),
]

