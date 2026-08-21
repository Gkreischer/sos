# SOS Production Deployment

This folder contains all files needed to deploy the SOS application in production using Docker Compose with separate services.

## Architecture

```
┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│    API      │◀──┐
│ (Port 8080) │     │ (Laravel)   │   │
└─────────────┘     └──────┬──────┘   │
                           │          │
              ┌────────────┼──────────┤
              ▼            ▼          ▼
         ┌─────────┐  ┌─────────┐ ┌─────────┐
         │Postgres │  │  Redis  │ │ Reverb  │
         │ (DB)    │  │(Cache/Q)│ │(WS)     │
         └─────────┘  └─────────┘ └─────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| nginx   | 8080 (external), 80 (internal), 443 | Reverse proxy, SSL termination |
| api     | 9000 (internal) | Laravel API (PHP-FPM) |
| reverb  | 8080 (internal) | WebSocket server |
| postgres| 5432 (internal) | PostgreSQL 18 database |
| redis   | 6379 (internal) | Redis cache/queue/broadcast |

## Quick Start

### 1. Prepare Environment

```bash
cd prod
cp .env.production .env
# Edit .env with your production values (REQUIRED!)
nano .env
```

**Required variables to change:**
- `DB_PASSWORD` - Secure PostgreSQL password
- `REDIS_PASSWORD` - Secure Redis password (or leave empty)
- `REVERB_APP_KEY` - Reverb app key
- `REVERB_APP_SECRET` - Reverb app secret
- `APP_KEY` - Laravel app key (run `php artisan key:generate` locally to get one)

### 2. Deploy

```bash
# Start all services (builds images on first run)
./deploy.sh up

# Or manually:
docker-compose up -d --build
```

### 3. Verify

```bash
# Check service status
./deploy.sh status

# View logs
./deploy.sh logs

# Test health endpoint
curl http://localhost/health
```

## Common Commands

```bash
# Start services
./deploy.sh up

# Stop services
./deploy.sh down

# Restart services
./deploy.sh restart

# View all logs
./deploy.sh logs

# View specific service logs
./deploy.sh logs api
./deploy.sh logs nginx
./deploy.sh logs postgres

# Build images
./deploy.sh build

# Pull latest base images
./deploy.sh pull

# Open shell in API container
./deploy.sh shell

# Run artisan commands
./deploy.sh artisan migrate --force
./deploy.sh artisan queue:work

# Backup database
./deploy.sh backup

# Restore database
./deploy.sh restore backup_20240101_120000.sql
```

## SSL/HTTPS Setup

For production with HTTPS:

1. Obtain SSL certificates (Let's Encrypt recommended)
2. Place certificates in `nginx/ssl/`
3. Create `nginx/conf.d/ssl.conf` with SSL configuration
4. Update `nginx/conf.d/default.conf` to redirect HTTP to HTTPS

Example SSL config (`nginx/conf.d/ssl.conf`):
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # ... rest of config from default.conf
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Volume Persistence

Data is persisted in Docker volumes:
- `postgres_data` - PostgreSQL database files
- `redis_data` - Redis RDB/AOF files
- `api-storage` - Laravel storage (uploads, logs)
- `api-bootstrap-cache` - Laravel bootstrap cache

## Updating

```bash
# Pull latest code
git pull

# Rebuild and restart
./deploy.sh build
./deploy.sh up
```

## Troubleshooting

### Check container health
```bash
docker-compose ps
```

### View detailed logs
```bash
docker-compose logs -f api
docker-compose logs -f nginx
```

### Database connection issues
```bash
# Test PostgreSQL connection
docker-compose exec postgres pg_isready -U sos

# Test from API container
docker-compose exec api php artisan tinker --execute="DB::connection()->getPdo();"
```

### Redis connection issues
```bash
docker-compose exec redis redis-cli ping
```

### Rebuild single service
```bash
docker-compose build api
docker-compose up -d api
```

### Clean up (removes all data!)
```bash
docker-compose down -v
```

## File Structure

```
prod/
├── docker-compose.yml       # Main compose file
├── .env.production          # Environment template
├── .env                     # Your actual environment (gitignored)
├── deploy.sh                # Deployment helper script
├── nginx/
│   ├── nginx.conf           # Main nginx config
│   └── conf.d/
│       └── default.conf     # Site configuration
└── README.md                # This file
```

## Security Notes

- Never commit `.env` file with real secrets
- Use strong passwords for database and Redis
- Rotate `APP_KEY`, `REVERB_APP_KEY`, `REVERB_APP_SECRET` periodically
- Keep base images updated (run `./deploy.sh pull` periodically)
- Consider using Docker secrets for sensitive values in Swarm mode
- Configure firewall to only expose ports 8080/443