---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, qa, pm
---

# CI/CD Architecture

## Purpose
Define the delivery pipeline for reliable, low-friction releases using GitHub, Vercel, and Supabase.

## Executive Summary
- PRs must pass quality, security, and migration checks.
- Preview deploys run for every PR.
- Production deploys require approval gates.
- Deployment and rollback paths must be deterministic and documented.

## Pipeline Components
- CI workflow (lint, typecheck, test, build)
- Security workflow (dependency and scanning checks)
- PR routing workflow (auto-label by type/area/risk)
- DB/RLS workflow (migration apply + tenant isolation assertions)
- Migration workflow (dry-run, dev apply, prod apply)
- Deploy workflows (Vercel preview + release-tagged publish)

## Branch and Environment Model
- `feature/*` -> pull request validation
- `develop` -> integration environment
- `main` -> production environment
- Environments:
  - preview (PR)
  - dev (shared non-prod)
  - prod (customer-facing)

## Environment Strategy
- `develop` for non-prod flow.
- `main` for production.
- Separate secrets by environment.
- Preview deploys are PR-triggered through `.github/workflows/vercel-preview.yml` when Vercel secrets are configured.

## Current GitHub Workflows

| Workflow | Purpose | Trigger |
| --- | --- | --- |
| `.github/workflows/quality.yml` | commit policy + web lint/build gate | PRs and pushes to `main` |
| `.github/workflows/security.yml` | dependency/security scanning baseline | PRs, pushes to `main`, weekly |
| `.github/workflows/db-rls.yml` | migration apply + executable RLS assertions | PRs and pushes to `main` |
| `.github/workflows/pr-auto-label.yml` | PR routing labels | PR lifecycle events |
| `.github/workflows/vercel-preview.yml` | PR preview deployment to Vercel | PRs to `main` |
| `.github/workflows/release.yml` | tagged/manual release verification + GitHub Release | `v*.*.*` tags and manual dispatch |

## Required Release Gates
- All required checks are green.
- Migration dry-run passes when schema changes exist.
- Deployment approval granted for production.
- Post-deploy smoke checks complete.

## Migration Safety
- Migrations are version-controlled.
- Production migration requires manual approval.
- Expand/contract approach for risky schema changes.
- Forward-fix preferred over emergency rollback.

## Failure and Recovery
- Web rollback to previous deploy.
- Worker rollback to previous image tag.
- Migration forward-fix as default recovery path.

## Observability Requirements
- Health endpoint checks
- Error-rate and exception monitoring
- Queue lag and worker heartbeat visibility
- Deployment event logging with timestamps and owners
