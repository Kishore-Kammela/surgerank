---
owner: QA
status: active
last_updated: 2026-02-26
audience: qa, engineering, pm
---

# Testing Strategy

## Purpose
Define the V1 testing approach for confidence and release speed.

## Executive Summary
- Risk-based test coverage over vanity coverage numbers.
- Prioritize tenant isolation, core workflows, and report reliability.

## Test Layers
- Unit tests for domain logic.
- Integration tests for API, DB policy, and worker jobs.
- Smoke e2e for onboarding and report flow.

## Mandatory Coverage
- Tenant boundaries and authz.
- Integration sync and failure handling.
- Keyword/GEO trend calculations.
- Report generation and schedule delivery.

## CI Policy
- Tests run on every PR.
- Flaky tests are release blockers until fixed.
