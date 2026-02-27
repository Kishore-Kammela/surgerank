---
owner: Engineering + Security
status: active
last_updated: 2026-02-27
audience: engineering, security, pm
---

# Security Operations Weekly Rhythm

## Purpose
Define a lightweight weekly operating model to keep vulnerabilities, exceptions, and SLAs under control without slowing product delivery.

## Weekly Cadence

| Day | Activity | Owner | Output |
| --- | --- | --- | --- |
| Monday | Security backlog and exception review | Engineering + Security | Prioritized fix list and exception updates |
| Wednesday | SLA checkpoint and escalation | Incident Commander delegate | Escalation notes for at-risk items |
| Friday | Security status summary | Security owner | Weekly status update for team/stakeholders |

## Monday Review Checklist
- Review open vulnerabilities by severity.
- Confirm no `critical` findings remain open.
- Validate `high` findings have owner + due date.
- Review `security-exception-register.md` for upcoming expiries.
- Review Dependabot PRs and security workflow failures.

## Wednesday Checkpoint
- Identify SLA breaches or near-breaches.
- Escalate blocked fixes (dependency conflicts, ownership gaps).
- Confirm compensating controls are still active.

## Friday Summary Format
`Security Weekly | Critical: <n> | High: <n> | Medium: <n> | Exceptions Open: <n> | SLA Breaches: <n> | Top Risks: <list>`

## KPI Snapshot (Track Weekly)

| KPI | Target |
| --- | --- |
| Critical vulnerabilities open | 0 |
| High vulnerabilities open > 3 business days | 0 |
| Expired exceptions | 0 |
| Security workflow pass rate (`security.yml`) | >= 95% |
| Median time to acknowledge high+ incidents | <= 1 hour |

## Escalation Triggers
- Any open `critical` vulnerability.
- Any `high` vulnerability past SLA target.
- Any expired security exception.
- Repeated secret scan failures on `main`.

## Definition of Done (Weekly Cycle)
- All open security items have owner and due date.
- Exceptions are current and non-expired.
- SLA breaches (if any) have documented corrective action.
