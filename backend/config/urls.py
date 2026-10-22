"""
URL configuration for NEUROSPECTRA project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    db_status = "unknown"
    db_error = None
    user_count = 0
    schema_status = "pending"
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            # Auto-apply schema compatibility for Supabase
            try:
                cursor.execute("""
                    ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
                    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
                    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE;
                    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT FALSE;
                    UPDATE users SET password = password_hash WHERE password IS NULL;
                    ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
                    ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT '';
                """)
                schema_status = "verified"
            except Exception as se:
                schema_status = f"notice: {se}"

            cursor.execute("SELECT COUNT(*) FROM users;")
            user_count = cursor.fetchone()[0]
        db_status = "connected"
    except Exception as e:
        db_status = "error"
        db_error = str(e)

    from django.conf import settings
    db_config = settings.DATABASES.get('default', {})
    safe_db_info = {
        'engine': db_config.get('ENGINE', '').split('.')[-1],
        'host': db_config.get('HOST', 'unknown'),
        'name': db_config.get('NAME', 'unknown'),
        'port': db_config.get('PORT', 'unknown'),
    }

    return JsonResponse({
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "NEUROSPECTRA Clinical REST API",
        "version": "1.2.1",
        "platform": "Render Cloud Web Service",
        "database": {
            "status": db_status,
            "error": db_error,
            "user_count": user_count,
            "schema_compatibility": schema_status,
            "connection": safe_db_info
        }
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
    path('api/bulk-sync/', include('accounts.urls')),
]

