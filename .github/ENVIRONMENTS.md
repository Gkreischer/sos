# GitHub Actions Environments Configuration
# This file documents the required secrets for each environment
# Actual secrets must be configured in GitHub repository settings

## Environments Required:
# 1. staging - For staging deployments
# 2. production - For production deployments (requires manual approval)

## Repository Secrets (Settings > Secrets and variables > Actions)

### Docker Registry
- DOCKERHUB_USERNAME: Docker Hub username
- DOCKERHUB_TOKEN: Docker Hub access token

### Staging Environment
- STAGING_HOST: Staging server hostname/IP
- STAGING_USER: SSH username for staging
- STAGING_SSH_KEY: Private SSH key for staging (OpenSSH format)
- STAGING_PORT: SSH port (default: 22)
- STAGING_URL: Staging application URL (e.g., https://staging.sos.example.com)
- STAGING_DB_PASSWORD: Database password for staging
- STAGING_REVERB_APP_ID: Reverb app ID for staging
- STAGING_REVERB_APP_KEY: Reverb app key for staging
- STAGING_REVERB_APP_SECRET: Reverb app secret for staging

### Production Environment
- PRODUCTION_HOST: Production server hostname/IP
- PRODUCTION_USER: SSH username for production
- PRODUCTION_SSH_KEY: Private SSH key for production (OpenSSH format)
- PRODUCTION_PORT: SSH port (default: 22)
- PRODUCTION_URL: Production application URL (e.g., https://sos.example.com)
- PRODUCTION_DB_PASSWORD: Database password for production
- PRODUCTION_REVERB_APP_ID: Reverb app ID for production
- PRODUCTION_REVERB_APP_KEY: Reverb app key for production
- PRODUCTION_REVERB_APP_SECRET: Reverb app secret for production

### Notifications
- SLACK_WEBHOOK: Slack webhook URL for deployment notifications

### Security (Codecov)
- CODECOV_TOKEN: Codecov upload token

## GitHub Environments Configuration

### staging environment:
- Protection rules: None (auto-deploy on push to develop)
- Secrets: All STAGING_* secrets above
- Deployment branch policy: Protected branches (develop)

### production environment:
- Protection rules: 
  - Required reviewers: 1 (manual approval required)
  - Wait timer: 5 minutes
- Secrets: All PRODUCTION_* secrets above
- Deployment branch policy: Protected branches (main)

## Branch Protection Rules

### main branch:
- Require pull request reviews before merging: 1
- Dismiss stale PR approvals when new commits are pushed
- Require status checks to pass before merging:
  - Frontend - Lint
  - Frontend - Unit Tests
  - Frontend - Build
  - Backend - Lint (Pint)
  - Backend - Unit & Feature Tests (Pest)
  - Security - Dependency Scan
- Require branches to be up to date before merging
- Include administrators
- Restrict pushes that create files matching: *.env, *.key, *.pem

### develop branch:
- Require pull request reviews before merging: 1
- Require status checks to pass before merging:
  - Frontend - Lint
  - Frontend - Unit Tests
  - Frontend - Build
  - Backend - Lint (Pint)
  - Backend - Unit & Feature Tests (Pest)

## Required GitHub Actions Permissions

Repository Settings > Actions > General:
- Workflow permissions: Read and write permissions
- Allow GitHub Actions to create and approve pull requests: Enabled

## OIDC for Cloud Providers (Optional)

If deploying to AWS/GCP/Azure, configure OIDC:
- AWS: Create IAM OIDC provider for token.actions.githubusercontent.com
- GCP: Configure Workload Identity Federation
- Azure: Configure Federated Identity Credential

Then add cloud-specific secrets:
- AWS_ROLE_ARN, AWS_WEB_IDENTITY_TOKEN_FILE
- GCP_WORKLOAD_IDENTITY_PROVIDER, GCP_SERVICE_ACCOUNT_EMAIL
- AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID