#!/usr/bin/env sh
# Start the mock API in the background and keep it alive while `ng serve`
# runs in the foreground. Intended to be the Cypress `start` command so the
# mock backend lives in the SAME shell that Cypress keeps alive (background
# procs launched in a prior GitHub Actions step are killed when that step's
# shell exits, which is what left the API mock dead before Cypress ran).

set -eu

DIR="$(cd "$(dirname "$0")" && pwd)"

# Kill any stale instance (idempotent, safe on fresh runner).
pkill -f 'cypress/mock-api.mjs' 2>/dev/null || true

node "$DIR/mock-api.mjs" &
MOCK_PID=$!
trap 'kill "$MOCK_PID" 2>/dev/null || true' EXIT INT TERM

sh "$DIR/wait-api.sh"

# Run the dev server in the foreground. The background mock keeps serving
# while it runs, and the EXIT trap above tears the mock down when ng serve
# finishes or is killed.
ng serve --host 0.0.0.0 --port 8100