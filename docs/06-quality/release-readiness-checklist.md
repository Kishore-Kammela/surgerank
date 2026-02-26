---
owner: QA
status: active
last_updated: 2026-02-26
audience: qa, engineering, pm, ops
---

# Release Readiness Checklist

## Purpose
Define the minimum release criteria for production deployment.

## Audience
Engineering, QA, PM, operations.

## Pre-Release
- [ ] Scope and acceptance criteria confirmed.
- [ ] Required tests passed.
- [ ] Security checks passed.
- [ ] Migration risk reviewed.
- [ ] Release notes drafted.

## Deploy Readiness
- [ ] CI/CD gates green.
- [ ] Environment variables validated.
- [ ] Rollback path verified.
- [ ] Incident owner on-call.

## Post-Deploy
- [ ] Health checks passing.
- [ ] Error rate within baseline.
- [ ] Core flows smoke-tested.
- [ ] Stakeholder update sent.
