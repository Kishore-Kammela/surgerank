---
owner: PM
status: active
last_updated: 2026-02-28
audience: all
---

# Decision Log

## Purpose
Maintain traceable records of project decisions and rationale.

## Audience
All project roles.

## Executive Summary
- Every major scope, architecture, and delivery decision is logged.
- Decisions include owner, alternatives, rationale, and revisit trigger.
- Decision logging is mandatory for scope, architecture, API, security, and launch-gate trade-offs.

## Entry Template
- Date:
- Decision ID:
- Decision:
- Context:
- Options considered:
- Selected option:
- Rationale:
- Risks accepted:
- Owner:
- Revisit trigger/date:

## Current Key Decisions
- V1 scope profile: balanced.
- Launch model: design-partner first.
- Stack baseline: Next.js + Tailwind + Supabase + Vercel + GitHub CI/CD.
- Package manager baseline: Bun for install/run/build workflows.

## Scope Migration Decisions (2026-02-26)

| Decision ID | Decision | Rationale | Owner | Revisit Trigger |
| --- | --- | --- | --- | --- |
| SD-001 | Replace legacy DOCX scope docs with canonical markdown scope package under `docs/scope/` | Improve maintainability, version control, and PDF sharing | PM | If stakeholder workflow requires a different publication format |
| SD-002 | Use modular scope set instead of a single monolithic file | Better audience-based consumption and easier updates | PM | If fragmentation causes review friction |
| SD-003 | Adopt balanced visuals (tables + focused mermaid diagrams) | Improve readability without overloading document pages | PM/Engineering | If PDF rendering quality issues appear |
| SD-004 | Canonical pricing baseline set to `500/2000/10000` keyword limits and GEO in Pro+ | Resolve contradictions across legacy scope docs | PM/Founder | After design-partner pricing validation cycle |
| SD-005 | Decommission legacy `scope/*.docx` after scope package sign-off | Avoid dual-source scope drift | PM | If legal/compliance requires archived originals elsewhere |

## Architecture and Monetization Decisions (2026-02-27)

| Decision ID | Decision | Rationale | Owner | Revisit Trigger |
| --- | --- | --- | --- | --- |
| AD-006 | Adopt Drizzle ORM as application query layer while keeping `supabase/migrations` as schema source of truth | Improve typed data access in app code without splitting migration ownership | Engineering | If migration/tooling friction appears between Drizzle schema and SQL migrations |
| AD-007 | Integrate Stripe as V1 payment provider for subscription checkout, webhook sync, and plan enforcement | Fastest reliable path for recurring SaaS billing and customer portal flows | PM/Engineering | If regional payment requirements require additional providers |
| AD-008 | Phase rollout: finish Week 2 auth/tenant baseline first, then implement Drizzle (Week 3) and payments (Week 4) | Reduces delivery risk by not combining auth, tenancy, and billing changes in one sprint | PM | If launch timeline or design-partner feedback requires reprioritization |
| AD-009 | Defer TanStack Query + GraphQL adoption; continue server-action-first data flow for now | Current app is server-driven and still stabilizing core behavior; adding GraphQL/client-cache stack now increases complexity without immediate customer value | Engineering | Revisit when we have multi-client consumers or client-heavy data orchestration pain |
| AD-010 | Use dual payment provider strategy: Stripe + Razorpay for India-first customer coverage | Indian SMB/agency audience often prefers local rails (UPI/cards/netbanking) while Stripe remains global baseline | PM/Engineering | Revisit if provider overlap creates high operational or reconciliation complexity |
| AD-011 | Run Razorpay-first client UX with Stripe auto-activation behind env configuration | Stripe onboarding availability is uncertain for India entities; hiding Stripe until configured avoids user confusion while preserving rapid future enablement | PM/Engineering | Revisit when Stripe account access is available and production-validated |

## Required Decision Types
- Scope and priority changes
- Architecture and stack decisions
- API contract and data model changes
- Security and compliance exceptions
- Release and launch gate decisions

## Decision Quality Criteria
- Clear problem statement
- Options considered with trade-offs
- Explicit rationale
- Owner accountability
- Revisit trigger/date documented
