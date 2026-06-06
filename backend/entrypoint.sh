#!/bin/sh
set -eu

until PGPASSWORD="${DB_PASSWORD}" pg_isready -h "${DB_HOST:-db}" -U "${DB_USERNAME:-cienciasnet}" -d "${DB_DATABASE:-cienciasnet}" -q; do
  sleep 2
done

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  php artisan migrate --force --no-interaction
fi

exec "$@"
