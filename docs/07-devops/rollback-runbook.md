---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, devops, ops
---

# Rollback Runbook

## Purpose
Define fast recovery procedures when a release causes critical issues.

## Audience
Engineering, DevOps, incident responders.

## Trigger Conditions
- severe production outage
- data integrity risk
- critical user-facing regression
- sustained job-processing failure that blocks core workflows

## Rollback Steps
1. Declare incident and assign owner.
2. Roll back web deployment to last stable version.
3. Roll back worker image to last stable tag.
4. Pause risky background jobs if needed.
5. Verify system health and critical flows.

## Vercel-Specific Rollback Notes
- If production deploy is from a release tag, redeploy the prior stable tag commit.
- If issue is detected during PR validation, close/revert PR without promoting preview to production.
- Maintain a short mapping of `release tag -> deployed Vercel URL` in release notes for fast recovery.

## Rollback Validation
- API health endpoint stable.
- Authentication and dashboard access restored.
- Report flow and queue consumption resumed.
- Error rates return to baseline band.

## Database Guidance
- Prefer forward-fix where possible.
- Restore from backup only when necessary and approved.

## Communication During Rollback
- Send incident start update with impact scope.
- Send rollback completion update with validation status.
- Publish follow-up action plan and owners.

## Post-Rollback
- Publish internal incident summary.
- Create corrective actions with owners and due dates.
