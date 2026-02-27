---
owner: Security
status: active
last_updated: 2026-02-26
audience: engineering, pm, stakeholders
---

# Security and Compliance Baseline

## Purpose
Define minimum security controls and compliance posture for V1.

## Audience
Engineering, PM, stakeholders.

## Executive Summary
- V1 security focuses on tenant isolation, secrets hygiene, and release safety.
- Compliance posture is practical and incremental for early-stage launch.

## Baseline Controls
- Role-based access control
- Row-level data isolation
- Secrets separation by environment
- Webhook verification and replay protection
- Audit logging for sensitive actions

## Data Protection
- Limit sensitive payload retention.
- Use encrypted transport and managed at-rest protections.
- Restrict privileged credentials to backend-only runtime.

## Operational Security
- GitHub security scanning enabled.
- Incident response runbook maintained.
- Key rotation schedule and owner assignment.
- Primary runbook: `docs/07-devops/incident-response-runbook.md`
- Exception tracking: `docs/07-devops/security-exception-register.md`
- Weekly cadence: `docs/07-devops/security-operations-weekly-rhythm.md`

## Mandatory Security Checks (V1)

| Check | Tooling | Trigger | Pass/Fail Rule | Owner |
| --- | --- | --- | --- | --- |
| Dependency risk review | `actions/dependency-review-action` | Every PR to `main` | Fail on `high`/`critical` severity advisories and denied licenses | Engineering |
| Static analysis | GitHub CodeQL | PRs, pushes to `main`, weekly schedule | No unresolved `high`/`critical` alerts for changed code before merge | Engineering |
| Secret leakage scan | Gitleaks GitHub Action | PRs and pushes to `main` | Any detected secret blocks merge until revoked/rotated and removed | Engineering |
| App quality gate | `.github/workflows/quality.yml` | PRs and pushes to `main` | Lint + build must pass | Engineering |
| Commit policy | `commitlint` | PRs and local `commit-msg` hook | Non-conforming commits are rejected | Engineering |

## Vulnerability Severity SLA

| Severity | Example | Acknowledge (SLA) | Mitigate/Contain (SLA) | Permanent Fix Target |
| --- | --- | --- | --- | --- |
| Critical | auth bypass, tenant data exposure, leaked production key | 15 minutes | 4 hours | 24 hours |
| High | SQL injection path, SSRF, unsafe webhook auth | 1 hour | 24 hours | 3 business days |
| Medium | privilege hardening gap, missing validation in non-critical path | 1 business day | 3 business days | 10 business days |
| Low | low-impact misconfiguration, non-exploitable weakness | 2 business days | 10 business days | Next planned release |

## Incident Timeline and Accountability
- **T0 to T+15m:** triage and severity assignment in incident channel.
- **T+15m to T+60m:** assign incident commander and mitigation owner.
- **T+4h (critical) / T+24h (high):** containment complete and customer impact assessed.
- **Within 48h of closure:** publish post-incident review with root cause and prevention tasks.
- **Weekly security review:** track open vulnerabilities and SLA breaches.

## Release Security Gate (Mandatory)
- No open `critical` vulnerabilities.
- No open `high` vulnerabilities without documented exception signed by PM + Engineering.
- All secrets are stored in managed environment variables; no hardcoded credentials.
- Tenant isolation checks covered in tests for any auth/data boundary change.
- Webhook endpoints verify signature + timestamp and enforce idempotency.

## Practical Limits
- No process can guarantee "zero vulnerabilities."
- V1 goal is rapid detection, fast containment, and disciplined remediation with auditable SLAs.

## Compliance Notes
- Maintain vendor and data-processing inventory.
- Track region/storage decisions and customer-facing implications.
