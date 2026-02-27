---
owner: Engineering
status: active
last_updated: 2026-02-27
audience: engineering, qa, security, pm
---

# Day 2 Initial Schema and RLS Baseline

## Purpose
Capture the first Supabase migration and tenant isolation baseline delivered for Week 1 Day 2/3.

## Scope Included

| Area | Included in Baseline |
| --- | --- |
| Core tables | `agencies`, `workspaces`, `agency_memberships`, `workspace_memberships`, `projects` |
| Tenant keys | `agency_id` and `workspace_id` where required |
| Constraints | FK boundaries + uniqueness constraints for membership/domain/slug |
| RLS | Table-level RLS with membership-based policies |
| Safety checks | Trigger guard to prevent agency/workspace mismatch |
| Verification | Starter smoke checks for allow/deny access paths |

## Migration Artifacts

| Artifact | Path |
| --- | --- |
| Core migration SQL | `supabase/migrations/20260227151000_init_core_schema_and_rls.sql` |
| RLS smoke checks | `supabase/tests/rls_smoke_checks.sql` |

## Policy Model (Baseline)
- Read access requires matching membership.
- Write access (`insert`, `update`, `delete`) is restricted to owner/admin roles.
- Agency/workspace joins are validated by trigger before write.
- Cross-tenant access is denied by default under RLS.
- Membership row management is service-role/backend-managed in this baseline (client-side membership writes are not enabled yet).

## QA Verification Checklist
- [ ] Non-member cannot read another agency's workspaces.
- [ ] Non-member cannot create projects in foreign workspace.
- [ ] Owner/admin can create and update projects in own workspace.
- [ ] Agency/workspace mismatch inserts are rejected.
- [ ] Membership constraints prevent duplicate membership rows.

## Follow-up (Day 3+)
- [x] Add executable SQL-based RLS assertions for CI (`supabase/tests/rls_policy_assertions.sql`).
- [x] Add DB validation workflow (`.github/workflows/db-rls.yml`).
- [ ] Add service-role-only operations documentation for backend jobs.
- [ ] Extend schema to `property`, `audit_run`, and `ranking_snapshot` after baseline validation.
