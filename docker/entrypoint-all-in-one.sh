#!/bin/bash
# ============================================================
# SOS All-in-One Entrypoint Script
# Initializes PostgreSQL, runs migrations, then starts supervisord
# ============================================================

set -e

echo "🚀 Starting SOS All-in-One Container..."

# ============================================================
# Environment Variables (with defaults)
# ============================================================
export POSTGRES_USER="${POSTGRES_USER:-sos}"
export POSTGRES_DB="${POSTGRES_DB:-sos}"
export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-sos_password}"
if [ -n "${APP_KEY:-}" ]; then
    export APP_KEY
fi
export APP_ENV="${APP_ENV:-production}"
export APP_DEBUG="${APP_DEBUG:-false}"

# Laravel env vars
export DB_CONNECTION=pgsql
export DB_HOST=127.0.0.1
export DB_PORT=5432
export DB_DATABASE="${POSTGRES_DB}"
export DB_USERNAME="${POSTGRES_USER}"
export DB_PASSWORD="${POSTGRES_PASSWORD}"

export REDIS_HOST=127.0.0.1
export REDIS_PORT=6379
export REDIS_PASSWORD=null

# Reverb
export REVERB_HOST=0.0.0.0
export REVERB_PORT=8080
export REVERB_SCHEME=http

echo "📋 Configuration:"
echo "   POSTGRES_USER=${POSTGRES_USER}"
echo "   POSTGRES_DB=${POSTGRES_DB}"
echo "   APP_ENV=${APP_ENV}"

# ============================================================
# Initialize PostgreSQL
# ============================================================
echo "🐘 Initializing PostgreSQL..."

# Check if PostgreSQL data directory is already initialized
if [ ! -f /var/lib/postgresql/18/main/PG_VERSION ]; then
    echo "   Initializing new PostgreSQL cluster..."
    su - postgres -c "/usr/lib/postgresql/18/bin/initdb -D /var/lib/postgresql/18/main --auth-local=trust --auth-host=md5"
    echo "   PostgreSQL cluster initialized."
else
    echo "   PostgreSQL cluster already exists."
fi

# Start PostgreSQL temporarily for setup
echo "   Starting PostgreSQL for setup..."
# Ensure log directory exists and is writable
mkdir -p /var/log/supervisor
chown postgres:postgres /var/log/supervisor

# Start PostgreSQL in background for setup (not using pg_ctl which has issues)
su - postgres -c "/usr/lib/postgresql/18/bin/postgres -D /var/lib/postgresql/18/main -c config_file=/etc/postgresql/18/main/postgresql.conf -c hba_file=/etc/postgresql/18/main/pg_hba.conf -c ident_file=/etc/postgresql/18/main/pg_ident.conf -c external_pid_file=/var/run/postgresql/18-main.pid -c unix_socket_directories=/var/run/postgresql" > /var/log/supervisor/postgresql_setup.log 2>&1 &
POSTGRES_PID=$!

# Start Redis temporarily for setup
echo "   Starting Redis for setup..."
mkdir -p /var/run/redis
chown redis:redis /var/run/redis
redis-server /etc/redis/redis.conf --daemonize yes

# Wait for PostgreSQL to be ready
echo "   Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if su - postgres -c "pg_isready -q"; then
        break
    fi
    sleep 1
done

# Wait for Redis to be ready
echo "   Waiting for Redis to be ready..."
for i in {1..10}; do
    if redis-cli ping 2>/dev/null | grep -q PONG; then
        break
    fi
    sleep 1
done

# Create database and user if they don't exist
echo "   Creating database and user..."
su - postgres -c "psql -tc \"SELECT 1 FROM pg_roles WHERE rolname='${POSTGRES_USER}'\" | grep -q 1 || psql -c \"CREATE ROLE ${POSTGRES_USER} WITH LOGIN PASSWORD '${POSTGRES_PASSWORD}'\"" || true
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='${POSTGRES_DB}'\" | grep -q 1 || psql -c \"CREATE DATABASE ${POSTGRES_DB} OWNER ${POSTGRES_USER}\"" || true
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER}\"" || true

# Note: We keep PostgreSQL and Redis running for Laravel setup
echo "   PostgreSQL and Redis kept running for Laravel setup..."

echo "✅ PostgreSQL and Redis initialized."

# ============================================================
# Laravel Setup
# ============================================================
echo "🎨 Setting up Laravel..."

cd /var/www/html

# Generate APP_KEY if not provided
if [ -z "${APP_KEY}" ]; then
    echo "   Generating APP_KEY..."
    php artisan key:generate --force
else
    echo "   Using provided APP_KEY."
fi

# Clear and cache config
echo "   Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Run migrations
echo "   Running migrations..."
php artisan migrate --force || {
    echo "   ⚠️ Migration failed, but continuing..."
}

ROLE_COUNT=$(php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
echo \Spatie\Permission\Models\Role::count();
")

if [ "$ROLE_COUNT" -eq 0 ]; then
    echo "Primeira instalação detectada."

    php artisan db:seed --class=RolesAndPermissionsSeeder --force
    php artisan db:seed --class=UserTypeSeeder --force
    php artisan db:seed --class=UserSeeder --force
    php artisan db:seed --class=BusinessInfoSeeder --force
    php artisan db:seed --class=OrderStatusSeeder --force
else
    echo "Seed inicial já executado."
fi

# Create storage link
echo "   Creating storage link..."
php artisan storage:link || true

# Cache config for production
if [ "${APP_ENV}" = "production" ]; then
    echo "   Caching config for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Set permissions
echo "   Setting permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "✅ Laravel setup complete."

# ============================================================
# Stop temporary services before supervisord takes over
# ============================================================
echo "🛑 Stopping temporary PostgreSQL and Redis before supervisord starts..."

# Stop PostgreSQL
if [ ! -z "$POSTGRES_PID" ] && kill -0 $POSTGRES_PID 2>/dev/null; then
    kill $POSTGRES_PID 2>/dev/null || true
    wait $POSTGRES_PID 2>/dev/null || true
    sleep 2
fi

# Stop Redis
redis-cli shutdown 2>/dev/null || true
sleep 1

# Ensure no postgres processes remain
pkill -f "postgres.*18/main" 2>/dev/null || true
sleep 1

# ============================================================
# Start Supervisord (manages all services)
# ============================================================
echo "🎛️ Starting Supervisord (manages nginx, php-fpm, postgresql, redis, queue, scheduler, reverb)..."

exec "$@"
