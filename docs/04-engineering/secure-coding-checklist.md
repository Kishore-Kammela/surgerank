---
owner: Engineering + Security
status: active
last_updated: 2026-02-27
audience: engineering, qa
---

# Secure Coding Checklist

## Purpose
Define a practical pre-merge secure coding checklist for backend, frontend, integrations, and infrastructure changes.

## How to Use
- Authors run this checklist before requesting review.
- Reviewers use it for `[BLOCKER]` and `[MUST]` findings.
- For high-risk features, combine with `threat-model-lite.md`.

## Identity and Access
- [ ] Authorization is enforced server-side for every sensitive action.
- [ ] Role and tenant checks are explicit and test-covered.
- [ ] No privileged operation is callable without auth context validation.

## Data and Privacy
- [ ] Query/filter paths enforce tenant boundaries (`agency_id`, `workspace_id`).
- [ ] Sensitive fields are not exposed in API responses by default.
- [ ] Logs do not include secrets, tokens, or raw sensitive payloads.

## Input/Output Safety
- [ ] User/external input is validated and normalized.
- [ ] Error responses do not leak internal implementation details.
- [ ] File/URL processing has allowlist + size/type/time limits.

## Integration and Webhook Safety
- [ ] Webhooks validate signature and freshness.
- [ ] Idempotency is enforced for retryable inbound events.
- [ ] External calls use timeout, retry, and circuit-breaker style limits.

## Frontend Safety
- [ ] No secrets embedded in client code.
- [ ] User-generated content rendering is safe (no unsafe HTML injection).
- [ ] Auth/session state is not trusted for authorization decisions.

## Dependency and Supply Chain
- [ ] New dependencies are justified and maintained.
- [ ] CI security checks pass (`dependency review`, `codeql analysis`, `secret scan`).
- [ ] License and vulnerability risks are reviewed for new packages.

## Operational Readiness
- [ ] Security-relevant events have logs/metrics.
- [ ] Runbook impact assessed for incident handling and rollback.
- [ ] Any deferred security fix is logged in `security-exception-register.md`.

## Merge Rule
- Any failed checklist item that introduces exploit risk is `[BLOCKER]` or `[MUST]` and must be resolved before merge unless exception policy explicitly applies.
