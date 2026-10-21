#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install --upgrade pip
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    python manage.py collectstatic --no-input
    python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from django.db import connection
try:
    with connection.cursor() as cursor:
        cursor.execute('''
            ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT FALSE;
            UPDATE users SET password = password_hash WHERE password IS NULL;
            ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
            ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT '';
        ''')
    print('DB schema bootstrap successful.')
except Exception as e:
    print('DB bootstrap notice:', e)
" || true
elif [ -f "backend/requirements.txt" ]; then
    pip install -r backend/requirements.txt
    python backend/manage.py collectstatic --no-input
    python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from django.db import connection
try:
    with connection.cursor() as cursor:
        cursor.execute('''
            ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT FALSE;
            UPDATE users SET password = password_hash WHERE password IS NULL;
            ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
            ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT '';
        ''')
    print('DB schema bootstrap successful.')
except Exception as e:
    print('DB bootstrap notice:', e)
" || true
fi

