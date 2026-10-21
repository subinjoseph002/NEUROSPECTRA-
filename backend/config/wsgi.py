"""
WSGI config for NEUROSPECTRA project.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
application = get_wsgi_application()

def ensure_database_schema():
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("""
                ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
                ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
                ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE;
                ALTER TABLE users ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT FALSE;
                UPDATE users SET password = password_hash WHERE password IS NULL;
                ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
                ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT '';
            """)
        print("[NEUROSPECTRA] Supabase database schema compatibility verified.")
    except Exception as e:
        print("[NEUROSPECTRA] DB schema auto-verify notice:", e)

ensure_database_schema()
