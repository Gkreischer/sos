#!/usr/bin/env sh
# Wait for the mock API on 127.0.0.1:9003 to accept connections.
# Used by the `start:e2e` script so Cypress's `start` command doesn't
# proceed to `ng serve` until the backend mock is actually reachable.

set -eu

attempts="${1:-30}"
delay="${2:-1}"

i=1
while [ "$i" -le "$attempts" ]; do
  if curl -fsS http://127.0.0.1:9003/api/v1/user/verify >/dev/null 2>&1; then
    echo "Mock API is ready"
    exit 0
  fi
  i=$((i + 1))
  sleep "$delay"
done

echo "Mock API failed to start" >&2
exit 1