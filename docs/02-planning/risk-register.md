---
owner: PM
status: active
last_updated: 2026-02-27
audience: pm, engineering, stakeholders
---

# Risk Register

## Purpose
Capture project risks with ownership and mitigation actions.

## Audience
PM, engineering, QA, stakeholders.

## Executive Summary
- Risks are tracked weekly with clear severity, likelihood, and owner.
- High-impact risks must include mitigation and fallback paths.
- Risk review is part of weekly operating rhythm and launch-governance.

## Risk Log Template
- Risk ID:
- Category:
- Description:
- Likelihood (Low/Med/High):
- Impact (Low/Med/High):
- Severity:
- Owner:
- Mitigation:
- Contingency:
- Status:
- Review date:

## Initial V1 Risk Areas
- API/provider instability
- Scope creep
- Data quality and tenancy errors
- Release readiness and regression risk
- Cost overrun from external APIs

## Week 4 Dual-Provider Operational Risks

| Risk ID | Category | Description | Likelihood | Impact | Severity | Owner | Mitigation | Contingency | Status | Review date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RISK-W4-001 | Operational risk | Stripe outage blocks checkout for global customers in a launch window. | Medium | High | High | Engineering | Maintain Razorpay path + clear degraded-mode messaging; monitor provider status and alert on checkout failures. | Temporarily route new paid conversions to alternate provider where eligible and queue manual follow-up. | Active | 2026-03-01 |
| RISK-W4-002 | Operational risk | Razorpay outage impacts India-first customers and delays subscription activation. | Medium | High | High | Engineering | Keep Stripe fallback for supported accounts, retry webhook processing, and track failed order creation metrics. | Provide temporary assisted activation workflow and replay failed events after recovery. | Active | 2026-03-01 |
| RISK-W4-003 | Technical risk | Event ordering/retry differences between providers cause stale internal subscription state. | Medium | High | High | Engineering + QA | Enforce idempotent event persistence and add reconciliation checks for `billing_subscriptions` drift. | Run bounded replay + manual reconciliation for mismatched workspaces. | Active | 2026-03-01 |
| RISK-W4-004 | Commercial risk | Pricing/plan mapping drift between provider configs leads to wrong tier activation. | Low | High | Medium | PM + Engineering | Lock config review checklist for price IDs/amounts per environment and require dual review before changes. | Freeze affected plan, correct mapping, and notify impacted customers with compensation path. | Active | 2026-03-01 |

## Active Risk Categories
- Product risk
- Delivery risk
- Technical risk
- Security/compliance risk
- Operational risk
- Commercial risk

## Escalation Rules
- Any risk marked High impact and High likelihood requires:
  - immediate owner assignment
  - mitigation plan within 48 hours
  - status update at next operating review
- Any unmitigated critical risk blocks release progression.
