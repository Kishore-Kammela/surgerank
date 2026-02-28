---
owner: Engineering
status: active
last_updated: 2026-02-28
audience: engineering, qa, pm, operations
---

# Billing Reconciliation Runbook

## Purpose
Provide a repeatable procedure to detect and resolve drift between payment provider state and internal billing state (`billing_subscriptions` and `billing_events`).

## Executive Summary
- Reconciliation is required because webhook delays/retries can temporarily desync internal plan state.
- During pilot, run reconciliation daily; after stabilization, run weekly and after incidents.
- Treat unresolved mismatches as operational risk with explicit SLA ownership.

## Reconciliation Cadence

| Stage | Frequency | Owner | Trigger |
| --- | --- | --- | --- |
| Pilot (design partners) | Daily | Engineering on-call | Business day start |
| Post-pilot steady state | Weekly | Engineering | Weekly operations review |
| Incident or outage recovery | Immediate + 24h follow-up | Incident Commander delegate | Provider outage, webhook backlog, replay event |

## Inputs Required
- Provider dashboard/API records for sampled workspaces:
  - provider subscription id
  - status
  - plan reference
  - period end (if available)
- Internal DB records:
  - `billing_subscriptions`
  - `billing_events`
- Time window under review (`from`, `to`).

## Step-by-Step Procedure

### 1) Select Workspace Sample
- Include all workspaces changed in the last 24h plus random active subscriptions.
- Always include recently upgraded/cancelled workspaces.

### 2) Pull Internal State Snapshot
- Query current internal subscription rows and recent events.
- Record query timestamp and reviewer.

### 3) Compare Provider vs Internal
- Match by `workspace_id` and `external_subscription_id`.
- Validate fields:
  - status
  - plan code
  - provider name
  - period end (if populated)

### 4) Classify Mismatch
- `status_mismatch`: provider status differs from internal status.
- `plan_mismatch`: provider plan differs from internal `plan_code`.
- `missing_internal_row`: provider has active subscription but no internal row.
- `stale_event_window`: internal state older than latest provider event.

### 5) Resolve
- Re-run webhook replay for impacted interval where possible.
- For unresolved cases, perform controlled manual correction in `billing_subscriptions`.
- Add incident note if mismatch impacts paid access or customer billing confidence.

### 6) Verify and Close
- Re-check corrected workspaces.
- Confirm app behavior (plan gating and `/billing` state) matches expected status.
- Publish reconciliation summary in weekly operations note.

## SQL Helpers (Supabase/Postgres)

```sql
-- Current internal billing state snapshot
select
  workspace_id,
  provider,
  external_subscription_id,
  status,
  plan_code,
  current_period_end,
  updated_at
from billing_subscriptions
order by updated_at desc;
```

```sql
-- Recent billing events (last 7 days)
select
  provider,
  external_event_id,
  event_type,
  workspace_id,
  occurred_at,
  created_at
from billing_events
where occurred_at >= now() - interval '7 days'
order by occurred_at desc;
```

```sql
-- Candidate stale rows (no recent event in 24h)
select
  s.workspace_id,
  s.provider,
  s.status,
  s.plan_code,
  s.updated_at
from billing_subscriptions s
left join billing_events e
  on e.workspace_id = s.workspace_id
 and e.provider = s.provider
 and e.occurred_at >= now() - interval '24 hours'
where e.id is null
order by s.updated_at asc;
```

## Mismatch Resolution SLA

| Severity | Example | Owner | Target Resolution |
| --- | --- | --- | --- |
| High | Active customer loses paid access due to mismatch | Engineering on-call | 4 hours |
| Medium | Plan label mismatch without access impact | Engineering | 1 business day |
| Low | Historical event metadata inconsistency | Engineering | Next ops cycle |

## Reconciliation Report Template

| Field | Details |
| --- | --- |
| Date / Window | |
| Reviewer | |
| Workspaces sampled | |
| Mismatches found | |
| Actions taken | |
| Incidents/risks opened | |
| Follow-up owner and due date | |
