---
name: surgerank-security
description: Applies a low-overhead security baseline for SurgeRank across Vercel, Supabase, and GitHub. Use when handling authz, secrets, webhook validation, crawler safeguards, dependency risk, and incident response readiness.
---

# SurgeRank Security

## Goal
Prevent common multi-tenant SaaS failures without slowing delivery.

## Baseline Controls
- Enforce RBAC and tenant isolation.
- Keep privileged keys server-side only.
- Verify webhook signatures and idempotency.
- Add SSRF controls for URL fetch/crawl features.
- Enable GitHub secret scanning and dependency checks.

## Security Checklist Per Feature
1. Authz and tenant boundary validated.
2. Sensitive data not exposed in responses/logs.
3. External calls have timeout/retry/allowlist controls.
4. Audit event is emitted for sensitive actions.

## Incident Basics
- Severity levels with owner assignment.
- Key revocation and rollback playbook.
- Post-incident corrective actions tracked.

## Deliverables
- Security notes in PR
- Required controls implemented
- Follow-up tasks for deferred hardening
