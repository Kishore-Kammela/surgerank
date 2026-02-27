---
owner: Engineering + Security
status: active
last_updated: 2026-02-27
audience: engineering, security, pm, stakeholders
---

# Incident Response Runbook

## Purpose
Provide a clear, low-friction process to detect, contain, communicate, and remediate security incidents and major production failures.

## Executive Summary
- Use severity-based response with strict SLA targets.
- Prioritize customer impact containment before root-cause perfection.
- Keep decision-making auditable through timeline logs and postmortems.

## Incident Severity and SLA

| Severity | Typical Example | Acknowledge | Contain | Permanent Fix |
| --- | --- | --- | --- | --- |
| Critical | tenant data leak, auth bypass, leaked prod credential | 15 minutes | 4 hours | 24 hours |
| High | exploitable injection/SSRF path, webhook auth failure | 1 hour | 24 hours | 3 business days |
| Medium | non-critical authorization hardening gap | 1 business day | 3 business days | 10 business days |
| Low | low-impact misconfiguration | 2 business days | 10 business days | Next release |

## Roles and Responsibilities

| Role | Primary Responsibility | Backup |
| --- | --- | --- |
| Incident Commander (IC) | Own timeline, decisions, and priorities | Engineering lead |
| Mitigation Owner | Implements containment and rollback/fix | Senior engineer |
| Communications Owner | Updates internal stakeholders and customers | PM |
| Security Owner | Validates exploitability, evidence, and controls | Security reviewer |

## Trigger Conditions
- Security workflow failures indicating real exposure (`secret scan`, `codeql analysis`, dependency criticals).
- Reports from customers, security researchers, or team members.
- Production alarms for auth/data boundary failures or severe outages.

## Response Timeline (Checklist)

### 0-15 Minutes
- Open incident channel and assign IC.
- Record start time, suspected scope, and current impact.
- Set initial severity (`critical`, `high`, `medium`, `low`).
- Freeze risky deployments if incident is active in production.

### 15-60 Minutes
- Assign mitigation owner and security owner.
- Confirm blast radius:
  - affected tenants/users
  - affected endpoints/services
  - possible data exposure
- Choose containment path:
  - revoke key/token
  - disable feature/route
  - roll back deployment
  - block malicious source patterns

### 1-4 Hours (Critical) / 1-24 Hours (High)
- Complete containment steps.
- Validate containment with logs, smoke tests, and targeted checks.
- Send first stakeholder update (impact, mitigation status, ETA).
- Start permanent fix branch and test plan.

### Post-Containment
- Deploy permanent fix.
- Verify no regression via quality + security checks.
- Document exact timeline and decisions.
- Close incident only after monitoring window confirms stability.

## Communication Templates

### Internal Update (Short)
`Incident <ID> | Severity: <level> | Impact: <summary> | Mitigation: <status> | Next update: <time>`

### Customer-Facing Update (If Needed)
`We identified an issue affecting <scope>. We have contained the issue and are implementing a permanent fix. Current status: <status>. Next update by <time>.`

## Evidence and Audit Requirements
- Save relevant logs, alerts, and commit/deploy identifiers.
- Track key decisions in `docs/02-planning/decision-log.md`.
- Link PRs and workflow runs used for containment and permanent fix.
- Store postmortem in project docs and mark follow-up owners/due dates.

## Postmortem Template

| Field | Details |
| --- | --- |
| Incident ID | |
| Severity | |
| Start / End Time | |
| Detection Method | |
| Root Cause | |
| Customer Impact | |
| Containment Actions | |
| Permanent Fix | |
| Preventive Actions | |
| Owners and Due Dates | |

## Recovery and Preventive Controls
- Add/adjust tests for failed boundary (tenant isolation, auth, validation).
- Add security rule/check if missing (lint, CodeQL pattern, dependency policy).
- Tighten alert threshold if detection lagged.
- Track all preventive tasks to completion in weekly security review.

## Billing Provider Outage and Event Replay

### Trigger Conditions (Billing-Specific)
- Checkout creation fails repeatedly for a single provider (Stripe or Razorpay).
- Webhook delivery failures spike or webhook retry backlog grows.
- Subscription state in app diverges from provider dashboard for active workspaces.

### Immediate Response (0-30 Minutes)
- Declare incident with category `operational` and severity based on customer impact.
- Identify impacted provider (`stripe` or `razorpay`) and affected regions/workspaces.
- Freeze non-essential billing changes and notify stakeholders of degraded path.
- Switch user messaging in `/billing` and support channels to indicate provider degradation.

### Containment (30-120 Minutes)
- Keep alternate provider path available where possible for new checkouts.
- Pause risky manual edits to `billing_subscriptions` unless IC-approved.
- Capture evidence:
  - provider status page incident links
  - failed request/webhook examples (sanitized)
  - affected workspace IDs and timestamps

### Replay Procedure (Post-Recovery)
1. Confirm provider recovery and webhook delivery stability.
2. Build replay window from outage start/end timestamps.
3. Re-send provider events for impacted window (provider dashboard or API).
4. Verify idempotency behavior (`billing_events` duplicate-safe writes).
5. Reconcile sampled workspaces:
   - provider subscription status
   - internal `billing_subscriptions` status
   - plan enforcement behavior in app
6. Publish reconciliation summary with any manual corrections made.

### Exit Criteria
- New checkouts succeed for the impacted provider.
- Replay completed with no unresolved subscription mismatches.
- Stakeholder update sent with incident timeline and residual actions.

## Definition of Done (Incident Closed)
- Containment completed and verified.
- Permanent fix deployed and monitored.
- Stakeholder communication completed.
- Postmortem published with actionable preventive work and owners.
