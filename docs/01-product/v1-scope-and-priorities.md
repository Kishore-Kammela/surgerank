---
owner: PM
status: active
last_updated: 2026-02-26
audience: developers, qa, pm, stakeholders
---

# V1 Scope and Priorities

## Purpose
Define exactly what ships in SurgeRank V1, what is deferred, and how scope decisions are made.

## Audience
Developers, QA, PM, and business stakeholders.

## Executive Summary
- V1 is built to deliver one core business outcome: agencies can onboard clients quickly, monitor SEO/GEO status, and produce client-ready reports with confidence.
- Scope is intentionally constrained to support a balanced 12-20 week launch timeline.
- Any new scope must follow replacement logic: add one item only by deferring an equal or larger item.

## V1 Success Criteria
- New workspace reaches first value in under 15 minutes.
- Weekly SEO and keyword insights are available and understandable.
- GEO visibility baseline is measurable for tracked queries.
- Reports can be exported manually and scheduled reliably.
- Design-partner launch gates are measurable each week.

## In Scope

### P0 Must-Have
- Multi-tenant foundation:
  - agency account, workspace model, role-based membership, basic billing controls
- Core data integrations:
  - Google Search Console connection and sync
  - DataForSEO integration for keyword and competitor enrichment
- Core product workflows:
  - SEO audit health score and issue buckets
  - keyword tracking and trend visibility
  - reporting (in-app + manual PDF + scheduled delivery)
- Delivery foundation:
  - CI/CD gates, release checks, monitoring baseline, rollback path

### P1 Should-Have
- Competitor basics:
  - setup, overlap, rank comparison snapshot
- Limited GEO module:
  - query set setup, 1-2 engines, citation/mention trend and evidence snapshot
- Monetization integration:
  - Stripe checkout + subscription status sync + basic customer billing portal

## Deferred (V2+)
- White-label platform and client-facing portal.
- Public API access and ecosystem-level extensibility.
- Full GEO depth across broader engines and advanced citation analytics.
- CMS push workflows and broader martech connectors.

## Scope Governance Rules
- Every requirement must map to:
  - a target user problem
  - a measurable acceptance criterion
  - a launch gate or KPI impact
- New requests require:
  - impact assessment on timeline, risk, and dependencies
  - explicit PM decision logged in `02-planning/decision-log.md`

## Current Open Decisions
- Final pricing/package limits by plan tier.
- Exact initial GEO engine pair for launch.
- Final partner cohort size for beta wave 1.

## Scope Change Notes (2026-02-27)
- Drizzle ORM adopted for typed query access in app code.
- Stripe selected as canonical V1 payment integration provider.
- Delivery sequencing adjusted to protect current momentum:
  - Week 2: auth + tenancy baseline
  - Week 3: Drizzle integration on top of existing Supabase SQL migrations
  - Week 4: Stripe subscription and billing flow
