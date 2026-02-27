---
owner: PM
status: active
last_updated: 2026-02-27
audience: pm, engineering, qa, stakeholders
---

# Week 2 Execution Board

## Purpose
Define Week 2 execution after Week 1 foundations, focused on auth wiring, tenant context, and first usable product slice.

## Executive Summary
- Week 2 goal is a usable authenticated tenant flow, not broad feature expansion.
- Auth and tenancy enforcement are release-critical and must stay server-side.
- Deliver one narrow end-to-end slice: sign in -> tenant context -> workspace/project shell.
- Drizzle and Stripe are accepted scope additions but phased to Week 3/4 to avoid destabilizing Week 2 delivery.

## Week 2 Objectives

| Objective | Outcome by End of Week |
| --- | --- |
| Auth baseline | Supabase auth wired in app with server-side session checks |
| Tenant context | Agency/workspace context resolved and enforced in server paths |
| First vertical slice | User can reach a tenant-scoped workspace/project shell |
| Operability | Basic logs, error handling, and runbook updates captured |

## Day-by-Day Plan

| Day | Workstream | Tasks | Primary Owner | Supporting | Definition of Done |
| --- | --- | --- | --- | --- | --- |
| Day 1 | Auth wiring | Add Supabase client utilities, env baseline, server auth context | Engineering | QA | Session/user context resolves on server and UI reflects signed-in state |
| Day 2 | Session flows | Add sign-in and callback routes with protected shell behavior | Engineering | QA | Unauthenticated users are redirected and callback flow is stable |
| Day 3 | Tenant routing | Select/persist active tenant context and guard tenant routes | Engineering | QA | Cross-tenant access is blocked in app route/API checks |
| Day 4 | Vertical slice | Add workspace/project shell page backed by tenant-scoped reads | Engineering | PM, QA | First usable authenticated tenant page available |
| Day 5 | Readiness | Smoke tests, risk review, docs update, week closeout | PM | Engineering, QA | Week 2 objectives reviewed and week 3 handoff prepared |

## Workstream Backlog (Week 2)

### Auth and Access
- [ ] Add Supabase auth UI + callback route.
- [ ] Add protected route behavior for authenticated app area.
- [ ] Add sign-out behavior and session invalidation checks.

### Tenant Context and Data Boundaries
- [ ] Load agency/workspace memberships server-side.
- [ ] Persist active tenant context per session.
- [ ] Enforce tenant checks in server actions/routes before data access.

### Product Slice
- [ ] Deliver tenant-scoped workspace/project shell page.
- [ ] Add empty/loading/error states for tenant views.

### Quality and Ops
- [ ] Add tests for auth redirects and tenant context loading.
- [ ] Add logging hooks for auth/session boundary errors.
- [ ] Update decision log and risk register with Week 2 findings.

### Accepted Scope Additions (Phased)
- [ ] Week 3: Introduce Drizzle ORM query layer aligned with existing Supabase SQL migrations.
- [ ] Week 4: Introduce Stripe subscription flow (checkout, webhook sync, billing portal).
- [ ] Add plan enforcement checks tied to subscription status and workspace/usage limits.

## Risk Watch (Week 2)

| Risk | Early Signal | Mitigation |
| --- | --- | --- |
| Auth callback instability | intermittent login redirect loops | add deterministic callback handler + integration test |
| Tenant context drift | wrong agency/workspace loaded for user | enforce server-side source of truth + explicit tenant checks |
| Feature scope creep | too many UI modules in week 2 | keep to one vertical slice and defer extras to week 3 |

## Exit Criteria
- Auth flow works in preview and local environments.
- Tenant context is server-resolved and enforced.
- One end-to-end tenant-scoped page is stable.
- Week 3 priorities are defined with known blockers.
