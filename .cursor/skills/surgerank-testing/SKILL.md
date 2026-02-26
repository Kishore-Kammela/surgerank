---
name: surgerank-testing
description: Creates a practical test strategy for SurgeRank across unit, integration, and workflow-critical paths. Use when adding coverage for tenant isolation, data pipelines, report generation, provider integrations, and regression prevention.
---

# SurgeRank Testing

## Goal
Protect velocity by covering high-risk product paths first.

## Test Pyramid (V1)
- Unit tests for business logic and utility functions.
- Integration tests for APIs, DB policies, and background jobs.
- End-to-end smoke tests for onboarding and report workflow.

## Mandatory Coverage
1. Tenant isolation and authorization.
2. Integration sync success/failure handling.
3. Keyword and GEO trend calculations.
4. Report generation and delivery status.
5. Billing/usage limit enforcement.

## Writing Rules
- Keep tests deterministic.
- Use fixtures with explicit tenant/workspace boundaries.
- Prefer behavior assertions over implementation details.

## CI Expectations
- Tests run on PR and main merges.
- Flaky tests are treated as blocking defects.
- Coverage focus is risk-based, not vanity percentages.

## Deliverables
- New or updated tests
- Test data fixtures
- Failure case coverage
