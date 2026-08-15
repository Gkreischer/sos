FROM docker.io/library/postgres:18.4-alpine

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=10 \
  CMD pg_isready -U $POSTGRES_USER