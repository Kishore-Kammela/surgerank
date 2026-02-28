---
owner: PM
status: active
last_updated: 2026-02-28
audience: pm, engineering, qa, stakeholders
---

# Week 5 Execution Board

## Purpose
Define Week 5 execution to close monetization readiness in a Razorpay-first setup and re-align delivery to the scope roadmap (core integrations and initial dashboard value).

## Executive Summary
- Week 5 shifts from baseline billing implementation to launch-grade billing operations and reconciliation.
- Stripe is deferred for now (invite-based availability); Razorpay is the active payment rail.
- Scope alignment for Weeks 3-5 requires starting core integration foundation (GSC onboarding and first ingestion path) in parallel with billing hardening.

## Week 5 Objectives

| Objective | Outcome by End of Week |
| --- | --- |
| Billing lifecycle readiness | `/billing` supports clear upgrade/manage states with Razorpay-first behavior |
| Operational correctness | Replay/reconciliation procedure can detect and resolve subscription drift |
| Core integration restart | GSC connect + property selection baseline is implementation-ready |
| Launch governance | Week 5 risks, decisions, and handoff are documented for Week 6 |

## Day-by-Day Plan

| Day | Workstream | Tasks | Primary Owner | Supporting | Definition of Done |
| --- | --- | --- | --- | --- | --- |
| Day 1 | Billing UX hardening | Finalize manage-plan UX states (`active`, `pending`, `cancelled`, `db_unavailable`) and user guidance | Engineering | QA | `/billing` clearly communicates next action for each subscription state |
| Day 2 | Razorpay-first ops | Validate Razorpay-only env/profile, remove Stripe dependency assumptions in run paths | Engineering | PM | Local/preview behavior is correct with Stripe keys absent |
| Day 3 | Reconciliation | Add reconciliation workflow spec + execution checklist for billing state drift | Engineering | QA | Repeatable checklist exists and sample reconciliation run is documented |
| Day 4 | GSC integration foundation | Prepare OAuth/property-connect technical slice and data contract for initial ingestion | Engineering | PM | Technical design + first implementation task list approved |
| Day 5 | Weekly closeout | Risk/decision updates, quality review, and Week 6 handoff | PM | Engineering, QA | Week 5 objectives reviewed with explicit Week 6 backlog |

## Workstream Backlog (Week 5)

### Billing Lifecycle and UX
- [ ] Improve `/billing` manage-plan state messaging and action clarity.
- [ ] Add explicit fallback behavior for `db_unavailable` and sync-delay states.
- [ ] Confirm project gating and upgrade CTA behavior remains consistent after state changes.

### Razorpay-First Operations
- [ ] Validate all required Razorpay env variables in local + preview.
- [ ] Keep Stripe path optional and non-blocking while account invite is pending.
- [ ] Add operator note for enabling Stripe later without breaking Razorpay flow.

### Reconciliation and Reliability
- [ ] Document recurring reconciliation cadence (daily during pilot, weekly post-pilot).
- [ ] Add drift detection checklist between provider state and `billing_subscriptions`.
- [ ] Define owner and SLA for resolving mismatched subscription states.

### Core Integrations (Scope Realignment)
- [ ] Finalize GSC onboarding flow requirements (connect, property select, consent copy).
- [ ] Define initial ingestion contract and storage touchpoints.
- [ ] Prepare Week 6 implementation board for GSC-first data value slice.

### Quality and Governance
- [ ] Update decision log with Razorpay-first temporary provider strategy.
- [ ] Update risk register with Week 5 integration + operational risks.
- [ ] Confirm quality gates remain green on all Week 5 PRs.

## Razorpay-First Environment Baseline

| Variable | Required Now | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Browser Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Browser Supabase auth/data access |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side privileged operations |
| `DATABASE_URL` | Yes | Drizzle + internal billing state persistence |
| `RAZORPAY_KEY_ID` | Yes | Razorpay checkout initialization |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay server API auth |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Razorpay webhook signature verification |
| `RAZORPAY_PLAN_AMOUNT_STARTER_INR` | Yes | Starter amount in paise |
| `RAZORPAY_PLAN_AMOUNT_PRO_INR` | Yes | Pro amount in paise |
| `RAZORPAY_PLAN_AMOUNT_SCALE_INR` | Yes | Scale amount in paise |
| `STRIPE_SECRET_KEY` | No (deferred) | Stripe server API auth |
| `STRIPE_WEBHOOK_SECRET` | No (deferred) | Stripe webhook verification |
| `STRIPE_PRICE_ID_STARTER` | No (deferred) | Stripe starter plan mapping |
| `STRIPE_PRICE_ID_PRO` | No (deferred) | Stripe pro plan mapping |
| `STRIPE_PRICE_ID_SCALE` | No (deferred) | Stripe scale plan mapping |

## Risk Watch (Week 5)

| Risk | Early Signal | Mitigation |
| --- | --- | --- |
| Razorpay-only dependency risk | checkout failures without alternate rail | add outage messaging + assisted recovery flow |
| Billing sync drift | workspace plan mismatch vs provider dashboard | enforce reconciliation cadence + replay procedure |
| Scope re-alignment delay | GSC work keeps slipping due billing tasks | reserve Day 4 explicitly for integration foundation |

## Exit Criteria
- Razorpay-first mode is fully documented and operationally validated.
- Billing lifecycle messaging is clear for users and operators.
- Reconciliation workflow is documented and assigned.
- Week 6 board is ready for GSC implementation start.
