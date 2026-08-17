# GitHub Actions Workflows for SOS Application

This directory contains the CI/CD workflows for the SOS application (Angular/Ionic frontend + Laravel 12 backend).

## Workflows

### 1. CI (`ci.yml`)
**Triggers**: Push to `main`/`develop`, Pull Requests to `main`/`develop`, Manual dispatch

**Jobs**:
- **Frontend - Lint**: Runs Angular ESLint
- **Frontend - Unit Tests**: Runs Karma/Jasmine tests with coverage
- **Frontend - Build**: Production build (`npm run build:all`)
- **Frontend - E2E Tests**: Cypress end-to-end tests (runs after build)
- **Backend - Lint**: Runs Laravel Pint (code style)
- **Backend - Static Analysis**: Runs PHPStan (if available)
- **Backend - Tests**: Runs Pest tests with 80% coverage requirement
- **Docker - Build Images**: Builds and pushes Docker images to GHCR (and Docker Hub on main)
- **Security - Dependency Scan**: npm audit, composer audit, Trivy container scan
- **CI Summary**: Aggregates all job results

### 2. Deploy (`deploy.yml`)
**Triggers**: Manual dispatch (with environment choice), Release published

**Jobs**:
- **Validate Deployment**: Determines version, verifies images exist in registry
- **Deploy to Staging**: Deploys to staging server via SSH
- **Deploy to Production**: Deploys to production with zero-downtime rolling update
- **Post-Deploy Smoke Tests**: Verifies deployment health
- **Rollback**: Manual rollback capability on failure

## Required Configuration

### GitHub Repository Secrets
Go to **Settings > Secrets and variables > Actions** and add:

#### Docker Registry
| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |

#### Staging Environment
| Secret | Description |
|--------|-------------|
| `STAGING_HOST` | Staging server hostname/IP |
| `STAGING_USER` | SSH username |
| `STAGING_SSH_KEY` | Private SSH key (OpenSSH format) |
| `STAGING_PORT` | SSH port (default: 22) |
| `STAGING_URL` | Staging app URL (e.g., `https://staging.sos.example.com`) |
| `STAGING_DB_PASSWORD` | Database password |
| `STAGING_REVERB_APP_ID` | Reverb app ID |
| `STAGING_REVERB_APP_KEY` | Reverb app key |
| `STAGING_REVERB_APP_SECRET` | Reverb app secret |

#### Production Environment
| Secret | Description |
|--------|-------------|
| `PRODUCTION_HOST` | Production server hostname/IP |
| `PRODUCTION_USER` | SSH username |
| `PRODUCTION_SSH_KEY` | Private SSH key (OpenSSH format) |
| `PRODUCTION_PORT` | SSH port (default: 22) |
| `PRODUCTION_URL` | Production app URL (e.g., `https://sos.example.com`) |
| `PRODUCTION_DB_PASSWORD` | Database password |
| `PRODUCTION_REVERB_APP_ID` | Reverb app ID |
| `PRODUCTION_REVERB_APP_KEY` | Reverb app key |
| `PRODUCTION_REVERB_APP_SECRET` | Reverb app secret |

#### Notifications & Security
| Secret | Description |
|--------|-------------|
| `SLACK_WEBHOOK` | Slack webhook for deployment notifications |
| `CODECOV_TOKEN` | Codecov upload token |

### GitHub Environments
Configure in **Settings > Environments**:

1. **staging**
   - No protection rules (auto-deploy)
   - Deployment branch: `develop`

2. **production**
   - Required reviewers: 1 (manual approval)
   - Wait timer: 5 minutes
   - Deployment branch: `main`

### Branch Protection Rules
Configure in **Settings > Branches**:

**main branch**:
- Require PR reviews: 1
- Require status checks:
  - Frontend - Lint
  - Frontend - Unit Tests
  - Frontend - Build
  - Backend - Lint (Pint)
  - Backend - Unit & Feature Tests (Pest)
  - Security - Dependency Scan

**develop branch**:
- Require PR reviews: 1
- Require status checks:
  - Frontend - Lint
  - Frontend - Unit Tests
  - Frontend - Build
  - Backend - Lint (Pint)
  - Backend - Unit & Feature Tests (Pest)

## Local Development

### Running CI Locally
```bash
# Frontend
cd sos_app
npm run lint
npm run test -- --watch=false --code-coverage
npm run build:all

# Backend
cd sos_api
./vendor/bin/pint --test
./vendor/bin/pest --coverage --min=80
```

### Docker Build Locally
```bash
# Build API image
docker build -f sos_api/docker/Dockerfile -t sos-api:local .

# Build Frontend image
docker build -f sos_app/Dockerfile -t sos-frontend:local .
```

### Deploy Staging Manually
```bash
# Trigger via GitHub CLI
gh workflow run deploy.yml -f environment=staging -f version=latest

# Or trigger via GitHub UI: Actions > Deploy Production > Run workflow
```

## Workflow Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Push/PR       │────▶│   CI Workflow   │
│   main/develop  │     │  (ci.yml)       │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
            ┌─────────────┐ ┌──────────┐ ┌───────────┐
            │  Frontend   │ │ Backend  │ │  Docker   │
            │  Jobs       │ │  Jobs    │ │  Build    │
            └─────────────┘ └──────────┘ └───────────┘
                    │            │            │
                    └────────────┴────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Release/Manual        │
                    │   Deploy Workflow       │
                    │   (deploy.yml)          │
                    └───────────┬─────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
         ┌───────────┐   ┌─────────────┐ ┌──────────┐
         │ Staging   │   │ Production  │ │ Smoke    │
         │ Deploy    │   │ Deploy      │ │ Tests    │
         └───────────┘   └─────────────┘ └──────────┘
```

## Troubleshooting

### CI Failures

**Frontend lint fails**: Run `npm run lint` locally and fix issues.

**Frontend tests fail**: Run `npm run test -- --watch=false` locally to debug.

**Backend Pint fails**: Run `./vendor/bin/pint` locally to auto-fix, then commit.

**Backend tests fail**: Run `./vendor/bin/pest` locally to debug.

**Docker build fails**: Check Dockerfile syntax and build context.

### Deploy Failures

**SSH connection fails**: Verify secrets are correct, server allows SSH keys.

**Health checks fail**: Check application logs on server:
```bash
docker compose logs -f app
```

**Images not found**: Ensure CI workflow completed successfully and pushed images.

### Rollback

If deployment fails:
1. Go to Actions > Deploy Production
2. Click "Run workflow" > select "production" > Run workflow
3. The rollback job will execute automatically on failure

Or manually on server:
```bash
cd /opt/sos/production
LATEST_BACKUP=$(ls -t backups/ | head -1)
docker compose -f backups/$LATEST_BACKUP/docker-compose.yml.bak up -d
```