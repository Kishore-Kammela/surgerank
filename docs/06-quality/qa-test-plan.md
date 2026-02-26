---
owner: QA
status: active
last_updated: 2026-02-26
audience: qa, engineering, pm
---

# QA Test Plan

## Purpose
Define release-grade QA coverage, severity handling, and acceptance rules for V1.

## Audience
QA, engineering, PM.

## Executive Summary
- QA focuses on high-risk workflows and release blockers.
- Test cycles align with weekly release candidate rhythm.
- Validation is scenario-driven and tied to launch gates.

## Scope
- onboarding and workspace setup
- integration connect/sync states
- SEO, keyword, GEO dashboard correctness
- report generation and scheduling flows
- billing and plan limit UX behavior

## Test Matrix
- Smoke:
  - critical user journeys and production sanity checks
- Regression:
  - previously shipped high-risk flows
- Functional:
  - new feature acceptance and edge-case behavior
- Exploratory:
  - high-change areas and integration-heavy paths

## Test Types
- smoke checks
- regression suite
- targeted exploratory testing

## Entry Criteria
- Feature acceptance criteria finalized.
- Test data and environment prepared.
- Known dependency risks documented.

## Exit Criteria
- All smoke checks pass.
- No open P0/P1 defects.
- P2 issues either fixed or accepted with workaround notes.
- Release readiness checklist completed.

## Severity and Exit Criteria
- P0/P1 unresolved -> no release
- P2 requires documented acceptance/workaround
- release decision tied to go/no-go checklist

## Defect Workflow
1. Log issue with reproducible steps and expected/actual behavior.
2. Assign severity and owner.
3. Track fix status and retest evidence.
4. Confirm closure in release notes or carry-forward log.
