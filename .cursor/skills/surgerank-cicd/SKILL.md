---
name: surgerank-cicd
description: Implements and maintains SurgeRank CI/CD on GitHub Actions with Vercel and Supabase migration gates. Use when setting up pipelines, deployment environments, branch protections, release gates, rollback steps, or workflow debugging.
---

# SurgeRank CI/CD

## Goal
Ship safely with low operational overhead for a small team.

## Default Stack
- GitHub Actions for CI/CD
- Vercel for web deploys (preview + production)
- Supabase migrations gated in CI
- Branch model: `feature/* -> develop -> main`

## Required Pipelines
1. `ci.yml`
   - lint, typecheck, tests, build
2. `security.yml`
   - dependency audit, CodeQL where configured
3. `migrations.yml`
   - dry-run on PR
   - apply to dev on `develop`
   - apply to prod on `main` with approval
4. `deploy-web.yml`
   - preview deploy on PR
   - production deploy from `main`
5. `deploy-worker.yml`
   - container build/push/deploy for long-running jobs

## Environment Rules
- Never use production secrets in preview/dev.
- Use GitHub Environments: `preview`, `dev`, `prod`.
- Require manual approval for `prod` migration and deploy jobs.

## Release Gates
- All required checks must pass.
- Migration dry-run must pass if schema changed.
- Post-deploy health checks must pass (`/api/health`, queue heartbeat).

## Rollback Protocol
1. Web: rollback to previous Vercel deployment.
2. Worker: deploy previous container tag.
3. DB: prefer forward-fix migration; restore only for severe cases.

## Deliverables
- Workflow files under `.github/workflows/`
- Branch protection rules documented
- Secrets matrix by environment
- Release and rollback runbook

## Additional Resource
- CI/CD checklist: [workflows-checklist.md](workflows-checklist.md)
