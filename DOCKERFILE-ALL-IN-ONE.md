# SOS All-in-One Dockerfile

This Dockerfile builds a single container image that runs all SOS services:
- **Frontend**: Angular/Ionic (served by Nginx)
- **Backend**: Laravel API (PHP-FPM)
- **WebSocket**: Laravel Reverb
- **Database**: PostgreSQL 15
- **Cache/Queue**: Redis
- **Process Manager**: Supervisord

## Building the Image

```bash
# Build the image
podman build -f Dockerfile.all-in-one -t sos-all-in-one:latest .

# Or with docker
docker build -f Dockerfile.all-in-one -t sos-all-in-one:latest .
```

## Running the Container

```bash
# Run with required environment variables
podman run -d \
  --name sos \
  -p 80:80 \
  -p 443:443 \
  -e POSTGRES_PASSWORD=your_secure_password \
  -e APP_KEY=base64:your_32_byte_base64_key \
  sos-all-in-one:latest
```

### Required Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_PASSWORD` | PostgreSQL password for user 'sos' | **Required** |
| `APP_KEY` | Laravel encryption key (32 bytes, base64 encoded) | **Required** |
| `POSTGRES_USER` | PostgreSQL username | `sos` |
| `POSTGRES_DB` | PostgreSQL database name | `sos` |
| `APP_ENV` | Laravel environment | `production` |
| `APP_DEBUG` | Laravel debug mode | `false` |

### Generating APP_KEY

```bash
# Generate a valid APP_KEY
php -r "echo 'base64:' . base64_encode(random_bytes(32));"
```

## Ports

| Port | Service | Description |
|------|---------|-------------|
| 80 | Nginx | HTTP (Frontend + API) |
| 443 | Nginx | HTTPS (requires SSL certs) |
| 5432 | PostgreSQL | Internal only |
| 6379 | Redis | Internal only |
| 8080 | Reverb | WebSocket (proxied by Nginx) |
| 9000 | PHP-FPM | Internal only |

## Services

All services are managed by **Supervisord**:

- **nginx** - Web server (port 80/443)
- **php-fpm** - PHP FastCGI Process Manager (port 9000)
- **postgresql** - Database (port 5432, localhost only)
- **redis** - Cache/Queue (port 6379, localhost only)
- **reverb** - Laravel WebSocket server (port 8080)
- **laravel-queue** - Queue worker
- **laravel-scheduler** - Cron scheduler

## Health Check

```bash
# Check container health
curl http://localhost/health
# Returns: healthy
```

## Accessing Services

- **Frontend**: http://localhost/
- **Ticket Support**: http://localhost/ticket-support/
- **API**: http://localhost/api/
- **Reverb WebSocket**: ws://localhost/broadcasting/
- **Health Check**: http://localhost/health

## Data Persistence

For production, mount volumes for persistent data:

```bash
podman run -d \
  --name sos \
  -p 80:80 \
  -v sos-postgres:/var/lib/postgresql/15/main \
  -v sos-redis:/var/lib/redis \
  -v sos-storage:/var/www/html/storage \
  -e POSTGRES_PASSWORD=your_secure_password \
  -e APP_KEY=base64:your_32_byte_base64_key \
  sos-all-in-one:latest
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Container                               │
│  ┌──────────────┐                                           │
│  │  Supervisord │  ◄── Process Manager                       │
│  └──────┬───────┘                                           │
│         │                                                    │
│  ┌──────┴──────┬─────────┬─────────┬─────────┬──────────┐   │
│  ▼             ▼         ▼         ▼         ▼          ▼   │
│ Nginx      PHP-FPM   PostgreSQL  Redis    Reverb    Queue   │
│ :80/443    :9000    :5432      :6379    :8080     (artisan)  │
│                                                          Scheduler│
└─────────────────────────────────────────────────────────────┘
```

## Differences from docker-compose

This all-in-one image combines all services into a single container, which is useful for:
- Simplified deployment (single image)
- Development/testing
- Edge deployments
- CI/CD pipelines

For production with high availability, scaling, or microservices architecture, the original `docker-compose.yml` with separate containers is recommended.