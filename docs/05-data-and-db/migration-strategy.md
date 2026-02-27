---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, devops, qa
---

# Migration Strategy

## Purpose
Define how schema changes are created, reviewed, deployed, and recovered safely.

## Audience
Engineering, DevOps, QA.

## Executive Summary
- All schema changes are migration-driven and CI-gated.
- Expand/contract approach minimizes production risk.

## Migration Workflow
1. Create migration in version control.
2. Run local validation and tests.
3. Run CI dry-run and lint checks.
4. Apply to dev environment.
5. Apply to production with approval gate.

## Current Validation Pipeline
- Workflow: `.github/workflows/db-rls.yml`
  - Boots a clean PostgreSQL service in CI.
  - Applies `supabase/migrations/*.sql` in order.
  - Executes RLS assertions in `supabase/tests/rls_policy_assertions.sql`.
- Local bootstrap helper: `supabase/tests/bootstrap_auth_schema.sql`
  - Creates minimal `auth` schema/function surface required for RLS checks.
- Expected behavior:
  - cross-tenant reads are denied
  - cross-tenant writes are denied
  - agency/workspace mismatch writes are rejected

## Safety Rules
- No untracked dashboard schema edits.
- Backward-compatible changes first.
- Forward-fix preferred over destructive rollback.

## Required Documentation
- Migration purpose
- impacted tables/policies
- risk level
- verification steps
