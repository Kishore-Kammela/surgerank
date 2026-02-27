---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, devops, ops
---

# Deployment Runbook

## Purpose
Provide repeatable deployment steps for web and worker services.

## Audience
Engineering, DevOps, on-call operators.

## Preconditions
- Required checks passed.
- Migration approvals complete.
- Release notes finalized.
- Incident owner assigned for release window.

## Deployment Steps
1. Confirm target release and environment.
2. Run production migration job.
3. Deploy web application.
4. Deploy worker service.
5. Run post-deploy smoke checks.
6. Monitor error/latency and queue health.

## Preview Deployment (PR Flow)
1. Open PR targeting `main`.
2. Ensure Vercel secrets are configured in GitHub:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Wait for `.github/workflows/vercel-preview.yml` to run.
4. Open the preview URL posted by the workflow comment.
5. Execute PR smoke checks on preview before merge.

If secrets are missing, the workflow reports a clear skipped reason instead of failing the PR.

## Detailed Checks Per Step
- Migration:
  - verify dry-run success reference
  - confirm no blocking DB alerts
- Web deploy:
  - verify health endpoint and auth flow
- Worker deploy:
  - verify queue processing and heartbeat
- Post-deploy:
  - validate one end-to-end workspace flow

## Validation Checklist
- API health endpoint returns success.
- Authentication flow works.
- Core dashboard loads with expected data.
- Report generation path succeeds.

## Communication Protocol
- Post release start notice in ops channel.
- Post release complete status with smoke results.
- Escalate immediately if P0/P1 regression observed.

## Escalation
- If critical issue appears, initiate rollback runbook immediately.
