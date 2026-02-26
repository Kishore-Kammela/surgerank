---
owner: PM
status: active
last_updated: 2026-02-26
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

## Scope Migration Decisions (2026-02-26)

| Decision ID | Decision | Rationale | Owner | Revisit Trigger |
| --- | --- | --- | --- | --- |
| SD-001 | Replace legacy DOCX scope docs with canonical markdown scope package under `docs/scope/` | Improve maintainability, version control, and PDF sharing | PM | If stakeholder workflow requires a different publication format |
| SD-002 | Use modular scope set instead of a single monolithic file | Better audience-based consumption and easier updates | PM | If fragmentation causes review friction |
| SD-003 | Adopt balanced visuals (tables + focused mermaid diagrams) | Improve readability without overloading document pages | PM/Engineering | If PDF rendering quality issues appear |
| SD-004 | Canonical pricing baseline set to `500/2000/10000` keyword limits and GEO in Pro+ | Resolve contradictions across legacy scope docs | PM/Founder | After design-partner pricing validation cycle |
| SD-005 | Decommission legacy `scope/*.docx` after scope package sign-off | Avoid dual-source scope drift | PM | If legal/compliance requires archived originals elsewhere |

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
