---
name: surgerank-orchestrator
description: Meta-skill that routes SurgeRank work to the correct project skills based on task type, project phase, and risk level. Use when deciding which of the 15 SurgeRank skills to invoke for planning, documentation, implementation, quality, launch, and operations.
---

# SurgeRank Orchestrator

## Goal
Select the right SurgeRank skill(s) for each task so execution stays fast, consistent, and scoped to V1.

## Managed Skills (15)
- `surgerank-cicd`
- `surgerank-supabase-rls`
- `surgerank-launch-ops`
- `surgerank-backend`
- `surgerank-frontend`
- `surgerank-ui`
- `surgerank-testing`
- `surgerank-qa`
- `surgerank-security`
- `surgerank-product-analytics`
- `surgerank-research-ops`
- `surgerank-business-analysis`
- `surgerank-product-requirements`
- `surgerank-project-management`
- `surgerank-docs-ops`

## Primary Routing (Task Type -> Skill)

### Strategy and Planning
- Market, competitor, provider, or feasibility research -> `surgerank-research-ops`
- Pricing, KPI, margin, segment, business trade-offs -> `surgerank-business-analysis`
- PRD updates, scope decisions, acceptance criteria -> `surgerank-product-requirements`
- Sprint planning, timeline, dependencies, blockers -> `surgerank-project-management`
- Documentation authoring, updates, and governance -> `surgerank-docs-ops`

### Product and Engineering Delivery
- API logic, jobs, integrations, service boundaries -> `surgerank-backend`
- App routing, feature pages, data loading, forms -> `surgerank-frontend`
- Design system, dashboard UX, visual hierarchy -> `surgerank-ui`
- DB schema, migrations, tenant policies, RLS -> `surgerank-supabase-rls`
- Pipelines, environments, deploy gates, rollback -> `surgerank-cicd`

### Quality, Security, and Release
- Unit/integration/e2e coverage strategy -> `surgerank-testing`
- Release validation, regression checks, readiness -> `surgerank-qa`
- Authz, secrets, webhook hardening, security controls -> `surgerank-security`
- Event tracking, activation/retention metrics, KPI instrumentation -> `surgerank-product-analytics`
- Beta operations, launch gates, partner rollout cadence -> `surgerank-launch-ops`

## Phase-Based Defaults
- Discovery and scope definition:
  - `surgerank-research-ops`, `surgerank-business-analysis`, `surgerank-product-requirements`, `surgerank-docs-ops`
- Build phase:
  - `surgerank-backend`, `surgerank-frontend`, `surgerank-ui`, `surgerank-supabase-rls`, `surgerank-cicd`
- Stabilization phase:
  - `surgerank-testing`, `surgerank-security`, `surgerank-qa`, `surgerank-product-analytics`
- Launch phase:
  - `surgerank-launch-ops`, `surgerank-project-management`, `surgerank-business-analysis`

## Multi-Skill Composition Rules
1. Prefer one primary skill and up to two supporting skills.
2. If work touches production data or auth, always include `surgerank-security`.
3. If schema changes are involved, always include `surgerank-supabase-rls` and `surgerank-testing`.
4. If release is involved, always include `surgerank-cicd` and `surgerank-qa`.
5. If scope changes are requested, include `surgerank-product-requirements` and `surgerank-project-management`.
6. If docs are created or modified, include `surgerank-docs-ops` and update decision-log references where needed.

## Conflict Resolution
- If speed and quality conflict, enforce launch-gate quality minimums.
- If scope and timeline conflict, reduce scope before extending timeline.
- If multiple skills disagree, follow this order:
  1) security/compliance
  2) data integrity/tenancy
  3) release stability
  4) feature completeness

## Standard Output Contract
For every substantial task, produce:
1. Chosen primary skill and why
2. Supporting skills and why
3. Scope boundary for this task
4. Deliverables and acceptance criteria
5. Risks and follow-up actions

## Additional Resource
- Routing examples: [examples.md](examples.md)
- Quick routing cheatsheet: [quick-routing-cheatsheet.md](quick-routing-cheatsheet.md)
