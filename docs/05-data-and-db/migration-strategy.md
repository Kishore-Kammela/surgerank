---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, devops, qa
---

# Migration Strategy

## Purpose
Define how schema changes are created, reviewed, deployed, and recovered safely.

## Audience
Engineering, DevOps, QA.

## Executive Summary
- All schema changes are migration-driven and CI-gated.
- Expand/contract approach minimizes production risk.

## Migration Workflow
1. Create migration in version control.
2. Run local validation and tests.
3. Run CI dry-run and lint checks.
4. Apply to dev environment.
5. Apply to production with approval gate.

## Safety Rules
- No untracked dashboard schema edits.
- Backward-compatible changes first.
- Forward-fix preferred over destructive rollback.

## Required Documentation
- Migration purpose
- impacted tables/policies
- risk level
- verification steps
