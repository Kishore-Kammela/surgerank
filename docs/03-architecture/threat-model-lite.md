---
owner: Engineering + Security
status: active
last_updated: 2026-02-27
audience: engineering, security, pm, qa
---

# Threat Model Lite

## Purpose
Provide a lightweight, repeatable threat modeling process for new features without slowing V1 delivery.

## When This Is Mandatory
- New authentication or authorization flow
- New external integration (API, webhook, crawler, file ingestion)
- Any feature that reads/writes tenant-sensitive data
- Any feature that introduces privileged actions

## Executive Summary
- Spend 15-30 minutes before implementation.
- Identify likely abuse paths and highest-impact failures.
- Define compensating controls and tests before merging.

## Threat Model Canvas (Fill Per Feature)

| Section | Notes |
| --- | --- |
| Feature name | |
| Owner | |
| Related PR/issue | |
| Data touched (PII/secrets/tenant data) | |
| Entry points (API, UI, webhook, job) | |
| Trust boundaries crossed | |
| External dependencies/services | |
| Privileged operations involved | |

## Common Threat Prompts (STRIDE-Lite)

| Category | Quick Prompt | Example |
| --- | --- | --- |
| Spoofing | Can an attacker impersonate a user/system? | forged webhook sender |
| Tampering | Can request/data be modified undetected? | manipulated workspace_id |
| Repudiation | Could actions lack audit trace? | destructive change without log |
| Information Disclosure | Could tenant/private data leak? | cross-tenant query bug |
| Denial of Service | Can this be abused for resource exhaustion? | unbounded crawler queue |
| Elevation of Privilege | Can lower-priv users gain elevated access? | role check bypass |

## Required Output (Before Merge)
- Top 3 realistic threats listed.
- One control per threat (preventive or detective).
- One verification method per control (test/check/monitor).
- Residual risk decision (`accept`, `mitigate now`, `defer with exception`).

## Controls Mapping Template

| Threat | Control | Verification | Owner | Status |
| --- | --- | --- | --- | --- |
| | | | | |

## Minimum Control Baseline
- Authz validated server-side (never trust client role/tenant claims alone).
- Tenant scoping enforced in every data query path.
- Input validation on all external or user-controlled payloads.
- Timeouts/retries/allowlist applied for external network calls.
- Sensitive actions generate audit log events.

## Sign-off
- Engineering owner: ___
- Security reviewer (if high risk): ___
- PM notified of residual risk: yes/no

## Links
- Security baseline: `docs/03-architecture/security-and-compliance-baseline.md`
- Incident response: `docs/07-devops/incident-response-runbook.md`
- Security exceptions: `docs/07-devops/security-exception-register.md`
