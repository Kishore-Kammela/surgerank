---
name: surgerank-qa
description: Runs QA validation for SurgeRank releases with checklist-driven verification of onboarding, dashboards, reports, and reliability. Use when preparing release candidates, validating fixes, performing regression checks, or certifying go/no-go readiness.
---

# SurgeRank QA

## Goal
Catch regressions and release blockers before partner-facing deployments.

## QA Focus Areas
- Onboarding and activation flow
- Cross-workspace navigation and data isolation
- SEO/keyword/GEO dashboard correctness
- Report export and scheduled delivery
- Billing and limit enforcement UX

## Regression Checklist
1. New workspace setup works end-to-end.
2. Integration connect/disconnect states are correct.
3. Data freshness indicators are correct.
4. Error messages are actionable.
5. No critical visual or functional regressions on key pages.

## Severity Model
- P0: data leak, broken onboarding, billing-critical defects
- P1: feature unusable in core flow
- P2: degraded UX with workaround
- P3: minor polish issues

## Exit Criteria for Release
- No open P0/P1 defects
- P2 defects reviewed and accepted
- Smoke tests pass on target environment
- Release notes include known limitations
