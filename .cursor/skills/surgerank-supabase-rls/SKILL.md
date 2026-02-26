---
name: surgerank-supabase-rls
description: Designs and enforces Supabase schema and row-level security for SurgeRank multi-tenant data isolation. Use when creating tables, policies, migrations, auth mappings, tenancy checks, and performance-safe index strategy.
---

# SurgeRank Supabase RLS

## Goal
Guarantee tenant isolation from day one with practical Supabase policies.

## Tenancy Standard
- Every tenant-scoped table includes:
  - `agency_id uuid not null`
  - `workspace_id uuid not null` for workspace-scoped data
- Use `auth.uid()` through membership tables to verify access.

## Policy Pattern
1. Enable RLS on each tenant table.
2. Add `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies.
3. Validate with negative tests (cross-tenant read/write must fail).

## Migration Rules
- SQL migrations in `supabase/migrations` only.
- No dashboard-only schema changes.
- Use expand/contract for risky schema updates.

## Performance Baseline
- Add access-path indexes on membership and tenant keys.
- Add hot-path indexes for ranking/audit/GEO tables.
- Add JSONB indexes only after measured need.

## Security Rules
- `service_role` key server-only.
- Never expose privileged keys to the client.
- Restrict security-definer functions and document purpose.

## Deliverables
- Migration files
- RLS policy SQL
- Access tests
- Data retention notes

## Additional Resource
- Policy and migration checklist: [rls-checklist.md](rls-checklist.md)
