---
owner: PM
status: active
last_updated: 2026-02-26
audience: pm, growth, engineering, stakeholders
---

# Activation and KPI Framework

## Purpose
Define activation criteria, KPI hierarchy, and review cadence.

## Audience
PM, growth, engineering, stakeholders.

## Executive Summary
- Activation and retention are the primary early indicators of product value.
- KPI definitions must remain stable and auditable across releases.
- Metrics are owned, reviewed weekly, and tied to go/no-go decisions.

## Activation Definition
Workspace is activated when all required setup and first-value actions are complete.

## V1 Activation Checklist
- GSC connected successfully.
- Initial data sync completed.
- At least 50 keywords configured/imported.
- First audit completed and visible.
- First report exported or scheduled.

## KPI Hierarchy
- North star: weekly value-active workspaces
- Leading indicators: activation rate, setup completion, first report time
- Lagging indicators: retention, MRR, churn, gross margin

## Metric Ownership
- PM: activation and retention reporting
- Engineering: reliability and data integrity metrics
- Business: MRR, margin, and expansion signals
- QA: release quality indicators

## Review Cadence
- weekly KPI review
- monthly cohort and segment analysis
- launch-gate checkpoint cadence

## Decision Use
- If activation drops below threshold, prioritize onboarding and setup flow improvements.
- If reliability drops, freeze feature expansion and focus on stabilization.
- If costs rise faster than usage value, tighten budget guardrails and cache strategy.

## Instrumentation Notes
- Required events and properties documented in analytics specs.
- Data quality checks required for decision-critical metrics.
