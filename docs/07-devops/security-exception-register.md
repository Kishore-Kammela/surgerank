---
owner: Engineering + Security + PM
status: active
last_updated: 2026-02-27
audience: engineering, security, pm, stakeholders
---

# Security Exception Register

## Purpose
Track temporary security exceptions with explicit risk ownership, approvals, compensating controls, and expiry dates.

## Executive Summary
- Exceptions are allowed only when delivery risk trade-offs are explicit and time-boxed.
- Critical/high exceptions require dual approval and strict expiry.
- No exception is "open-ended"; every item must have a closure plan.

## Policy Rules (Mandatory)
- Exceptions are permitted only for `high` or `medium` findings that cannot be fixed immediately.
- `critical` exceptions are allowed only during active incident containment and must expire within 24 hours.
- Every exception must include:
  - impact summary
  - compensating control
  - owner
  - expiry date
  - closure criteria
- Expired exceptions block release until renewed with approvals or closed.

## Approval Matrix

| Severity | Approvers | Max Duration | Renewal Allowed |
| --- | --- | --- | --- |
| Critical | Engineering Lead + Security Owner + PM | 24 hours | Once (incident only) |
| High | Engineering Lead + PM | 14 days | Yes, with justification |
| Medium | Engineering Lead | 30 days | Yes, with justification |
| Low | No formal exception needed (track as backlog) | N/A | N/A |

## Exception Register

| ID | Opened On | Severity | Area | Risk Summary | Compensating Control | Owner | Approvers | Expiry | Status | Closure PR/Issue |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-EX-001 | YYYY-MM-DD | High | Auth/API/DB/CI | | | | | YYYY-MM-DD | Open | |

## Status Definitions
- `Open`: Approved and active.
- `Mitigated`: Control in place, waiting for permanent fix rollout.
- `Closed`: Permanent fix validated and exception removed.
- `Expired`: Past expiry date without valid renewal (release-blocking state).

## Weekly Governance Cadence
- Monday security review:
  - review all open exceptions
  - confirm compensating controls still effective
  - verify upcoming expiries in next 7 days
- Wednesday checkpoint:
  - escalation on any item at risk of expiry breach
- Friday closeout:
  - publish status and owner actions for next week

## Required Fields Per New Exception
1. Evidence link (PR, workflow run, alert, or issue).
2. Clear exploitability/impact statement.
3. Reason fix is deferred.
4. Compensating control with validation method.
5. Owner + due date.
6. Exit criteria and verification test.

## Release Gate Integration
- Open `critical` exceptions: release blocked.
- Open `high` exceptions:
  - blocked unless documented approval and active compensating control.
- Any `expired` exception: release blocked.

## Audit Trail
- Reference each exception in `docs/02-planning/decision-log.md`.
- Link closure PR and test evidence before marking `Closed`.
