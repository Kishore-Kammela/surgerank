---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, devops, security
---

# Environments and Secrets

## Purpose
Define environment strategy and secret handling for secure and predictable deployments.

## Audience
Engineering, DevOps, security.

## Executive Summary
- Separate preview, dev, and production environments.
- Isolate secrets by environment with strict least privilege.
- Treat secret handling as release-critical, not optional hygiene.

## Environment Model
- Preview: PR validation
- Dev: integration and QA flow
- Prod: customer-facing environment

## Environment Responsibilities
- Preview:
  - feature validation, UI checks, and PR-level smoke tests
- Dev:
  - integration testing, migration rehearsal, QA validation
- Prod:
  - stable customer operations and launch-gated releases

## Secret Rules
- No secrets in repo or logs.
- Production secrets never reused in non-prod.
- Rotation owner and schedule required.

## Required Secret Categories
- App runtime secrets
- Supabase service credentials
- External integration API keys
- CI/CD deployment tokens
- Monitoring and alerting webhooks

## Rotation Policy
- High-risk keys: quarterly rotation baseline.
- Incident-triggered immediate rotation when compromise is suspected.
- Offboarding-triggered rotation for shared access credentials.

## Governance
- Access controls documented.
- Secret changes tracked in operations log.
- Production secret access limited to minimum required maintainers.
