FROM docker.io/library/redis:latest

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD redis-cli ping