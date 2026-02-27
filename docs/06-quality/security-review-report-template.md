---
owner: Security + Engineering
status: active
last_updated: 2026-02-27
audience: engineering, security, qa, pm
---

# Security Review Report Template

## Purpose
Standardize security review output for major or high-risk PRs so decisions, severity, and SLA ownership are explicit.

## Use This Template When
- PR affects auth/authorization, tenant boundaries, external integrations, webhooks, CI/CD security, or secrets handling.
- PR introduces new data flows, privileged actions, or background job execution paths.

## Review Header

| Field | Value |
| --- | --- |
| PR Link | |
| Feature / Change | |
| Reviewer | |
| Review Date | |
| Risk Level (Low/Medium/High) | |
| Threat Model Used (`yes/no`) | |

## Scope Reviewed
- Files/areas reviewed:
  - 
- Out of scope:
  - 

## Findings (Severity Tagged)

| ID | Severity Tag | Area | Finding | Exploit/Risk Impact | Recommendation | Owner | Due Date | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-001 | `[BLOCKER]` / `[MUST]` / `[SHOULD]` / `[NIT]` | | | | | | | Open |

## SLA Mapping (Required for `[BLOCKER]` / `[MUST]`)

| Finding ID | Severity | Acknowledge By | Mitigate By | Permanent Fix By | Exception Needed |
| --- | --- | --- | --- | --- | --- |
| SEC-001 | Critical / High / Medium | | | | yes/no |

## Verification Checklist
- [ ] Tenant boundary checks validated.
- [ ] Authorization checks validated server-side.
- [ ] Input validation and output exposure reviewed.
- [ ] Webhook/integration safeguards verified (if applicable).
- [ ] Secrets handling verified (no client exposure or repo leakage).
- [ ] CI security checks pass (`dependency review`, `codeql analysis`, `secret scan`).

## Decision
- Merge recommendation:
  - [ ] Approve
  - [ ] Approve with conditions
  - [ ] Block until `[BLOCKER]`/`[MUST]` resolved
- Notes:
  - 

## Exceptions (If Any)
- If any high/critical item is deferred, create/update:
  - `docs/07-devops/security-exception-register.md`
- Exception IDs:
  - 

## Links
- Threat model: `docs/03-architecture/threat-model-lite.md`
- Secure coding checklist: `docs/04-engineering/secure-coding-checklist.md`
- Incident response: `docs/07-devops/incident-response-runbook.md`
