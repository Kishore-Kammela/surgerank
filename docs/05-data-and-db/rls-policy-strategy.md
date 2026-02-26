---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: backend, data, qa, security
---

# RLS Policy Strategy

## Purpose
Define row-level security strategy for tenant-safe data access in Supabase.

## Audience
Backend engineers, data engineers, QA, security.

## Executive Summary
- RLS is mandatory for tenant-scoped V1 tables.
- Policies enforce membership-based access using `auth.uid()`.
- Cross-tenant access is treated as a critical defect category.

## Policy Design Pattern
- Resolve user identity from `auth.uid()`.
- Validate agency/workspace membership before access.
- Separate `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies.
- Prevent mutable tenant keys after record creation.
- Keep policies explicit and readable; avoid hidden logic.

## Minimum Policy Rules Per Tenant Table
- Read:
  - user must belong to same agency (and workspace where applicable)
- Insert:
  - inserted tenant keys must match allowed membership scope
- Update:
  - update allowed only within same tenant scope
  - no cross-tenant reassignment
- Delete:
  - restricted to elevated roles where needed

## Validation
- Negative tests for cross-tenant access.
- Integration checks for role-based behavior.
- CI policy checks for newly added tenant tables.

## Operational Review Checklist
- Policy and migration changed together in same PR.
- Tenant indexes exist for policy-filtered queries.
- Service-role usage paths are documented.
- QA verifies key role scenarios before release.

## Operational Notes
- Service role usage is backend-only.
- Policy changes require migration and review.
- Failed RLS tests block release candidate progression.
