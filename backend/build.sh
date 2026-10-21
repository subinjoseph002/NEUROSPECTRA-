#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install --upgrade pip
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    python manage.py collectstatic --no-input
elif [ -f "backend/requirements.txt" ]; then
    pip install -r backend/requirements.txt
    python backend/manage.py collectstatic --no-input
fi

