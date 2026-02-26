---
owner: PM
status: active
last_updated: 2026-02-26
audience: pm, engineering, stakeholders
---

# Go/No-Go Gates

## Purpose
Define objective launch decision gates for design-partner and public release.

## Executive Summary
- Launch decisions are metrics-driven, not calendar-driven.
- Any failed critical gate triggers corrective sprint, not forced release.
- Gate reviews happen weekly and are explicitly logged.

## Core Gates (V1 Default Targets)
- Activation:
  - >= 70% of new partner workspaces activated by day 10
- Retention:
  - >= 60% week-4 retained usage in design-partner cohort
- Reliability:
  - >= 98% pipeline success for critical jobs
- Quality:
  - no unresolved P0/P1 defects for release candidate
- Economics:
  - API cost and infra spend within approved threshold bands
- Commercial:
  - minimum paying partner count and acceptable churn trend

## Decision Process
1. Weekly gate review with owners.
2. Identify failed gates and root causes.
3. Decide: continue beta, extend beta, or launch.
4. Record rationale in decision log.

## Decision Outputs
- decision status (`go`, `hold`, `conditional-go`)
- failed gate list (if any)
- corrective plan with owners and due dates
- next review date

## Ownership
- PM: gate review facilitation
- Engineering: reliability and defect gates
- Business: margin and customer gates
- QA: quality and release readiness evidence
