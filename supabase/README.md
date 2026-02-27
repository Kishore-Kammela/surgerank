# Supabase Folder

This folder contains migration and policy verification assets for SurgeRank.

## Structure

- `migrations/`: ordered SQL migrations applied to database environments
- `tests/`: SQL smoke checks for tenancy and RLS behavior

## Baseline Migration

- `migrations/20260227151000_init_core_schema_and_rls.sql`
  - creates core agency/workspace/project tenancy tables
  - enables RLS
  - adds initial membership-based policies
  - adds trigger guards for agency/workspace consistency

## Validation

- Run schema migration in dev first.
- Validate deny/allow behavior using `tests/rls_smoke_checks.sql`.
- Treat any cross-tenant read/write success as a release-blocking defect.
