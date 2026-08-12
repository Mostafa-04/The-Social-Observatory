#!/bin/sh
set -e

if [ -n "$DB_HOST" ]; then
    echo "Waiting for database $DB_HOST:${DB_PORT:-3306}..."
    until php -r "new PDO('mysql:host=$DB_HOST;port=${DB_PORT:-3306}', '$DB_USERNAME', '$DB_PASSWORD');" 2>/dev/null; do
        sleep 1
    done
    echo "Database is up."
fi

if [ "$RUN_MIGRATIONS" = "true" ]; then
    php artisan migrate --force

    SETTINGS_COUNT=$(php artisan tinker --execute="echo \App\Models\Setting::count();" 2>/dev/null | tail -1)
    if [ "$SETTINGS_COUNT" = "0" ]; then
        echo "No settings found, seeding initial data..."
        php artisan db:seed --force
    fi
fi

exec "$@"
