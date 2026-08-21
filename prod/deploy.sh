#!/bin/bash
# ============================================================
# SOS Production Deployment Script
# Simple deployment for production docker-compose setup
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  SOS Production Deployment${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cp .env.production .env
    echo -e "${RED}❗  IMPORTANT: Edit .env file with your production values before continuing!${NC}"
    echo -e "${RED}   Especially: DB_PASSWORD, REDIS_PASSWORD, REVERB_APP_KEY, REVERB_APP_SECRET, APP_KEY${NC}"
    echo ""
    read -p "Press Enter after editing .env to continue, or Ctrl+C to abort..."
fi

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Check required variables
REQUIRED_VARS=("DB_PASSWORD" "APP_KEY" "REVERB_APP_KEY" "REVERB_APP_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ] || [ "${!var}" = "CHANGE_ME_SECURE_PASSWORD" ] || [ "${!var}" = "CHANGE_ME_REDIS_PASSWORD" ] || [ "${!var}" = "CHANGE_ME_REVERB_APP_KEY" ] || [ "${!var}" = "CHANGE_ME_REVERB_APP_SECRET" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing or default values for required variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "   - $var"
    done
    echo -e "${YELLOW}Please edit .env file with secure values.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment configuration validated${NC}"
echo ""

# Function to show usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  up        - Start all services (build if needed)"
    echo "  down      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  logs      - Show logs for all services"
    echo "  logs <svc> - Show logs for specific service"
    echo "  build     - Build all images"
    echo "  pull      - Pull latest base images"
    echo "  status    - Show service status"
    echo "  backup    - Backup database"
    echo "  restore   - Restore database from backup"
    echo "  shell     - Open shell in API container"
    echo "  artisan   - Run artisan command in API container"
    echo ""
}

# Main command handling
case "${1:-up}" in
    up)
        echo -e "${BLUE}🚀 Starting production services...${NC}"
        docker-compose up -d --build
        echo ""
        echo -e "${GREEN}✅ Services started!${NC}"
        echo -e "   API: http://localhost:8080/api"
        echo -e "   Health: http://localhost:8080/health"
        echo -e "   WebSocket: ws://localhost:8080/app/"
        ;;
    down)
        echo -e "${YELLOW}🛑 Stopping production services...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Services stopped${NC}"
        ;;
    restart)
        echo -e "${BLUE}🔄 Restarting production services...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ Services restarted${NC}"
        ;;
    logs)
        if [ -n "$2" ]; then
            docker-compose logs -f "$2"
        else
            docker-compose logs -f
        fi
        ;;
    build)
        echo -e "${BLUE}🔨 Building production images...${NC}"
        docker-compose build --no-cache
        echo -e "${GREEN}✅ Build complete${NC}"
        ;;
    pull)
        echo -e "${BLUE}📥 Pulling latest base images...${NC}"
        docker-compose pull
        echo -e "${GREEN}✅ Pull complete${NC}"
        ;;
    status)
        docker-compose ps
        ;;
    backup)
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        echo -e "${BLUE}💾 Backing up database to $BACKUP_FILE...${NC}"
        docker-compose exec -T postgres pg_dump -U sos sos > "$BACKUP_FILE"
        echo -e "${GREEN}✅ Backup saved to $BACKUP_FILE${NC}"
        ;;
    restore)
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Usage: $0 restore <backup_file>${NC}"
            exit 1
        fi
        echo -e "${YELLOW}⚠️  Restoring database from $2...${NC}"
        read -p "This will overwrite the current database. Continue? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose exec -T postgres psql -U sos sos < "$2"
            echo -e "${GREEN}✅ Database restored${NC}"
        fi
        ;;
    shell)
        docker-compose exec api /bin/sh
        ;;
    artisan)
        shift
        docker-compose exec api php artisan "$@"
        ;;
    *)
        usage
        exit 1
        ;;
esac