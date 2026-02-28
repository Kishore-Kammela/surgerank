---
owner: PM
status: active
last_updated: 2026-02-28
audience: pm, engineering, qa, stakeholders
---

# Week 6 Execution Board

## Purpose
Execute the first GSC value slice: OAuth onboarding, property binding, and initial ingestion baseline.

## Executive Summary
- Week 6 begins delivery of the `Core integrations` phase from the roadmap.
- Focus is one complete path from connect -> bind -> sync status, not broad analytics UI.
- Tenant safety, auditability, and retry-safe ingestion are release-critical.

## Week 6 Objectives

| Objective | Outcome by End of Week |
| --- | --- |
| OAuth onboarding | Workspace can connect a GSC account successfully |
| Property binding | Workspace can select/store a verified property |
| Initial ingestion | First sync job can run and persist status |
| Operational visibility | Sync failures and retries are visible in logs/state |

## Day-by-Day Plan

| Day | Workstream | Tasks | Primary Owner | Supporting | Definition of Done |
| --- | --- | --- | --- | --- | --- |
| Day 1 | OAuth setup | Add Google OAuth route + callback + secure state handling | Engineering | QA | Connection flow works in local/preview with workspace checks |
| Day 2 | Property listing/binding | Fetch verified properties and persist workspace binding | Engineering | QA | Property selection saved and visible in workspace context |
| Day 3 | Ingestion baseline | Add initial sync job contract and persistence model | Engineering | PM | Sync run record created with status lifecycle |
| Day 4 | Error handling/retry | Add retry-safe sync handling and operator diagnostics | Engineering | QA | Failures captured with actionable error state |
| Day 5 | Closeout | End-to-end validation, docs/risk updates, Week 7 handoff | PM | Engineering, QA | Week 6 outcomes reviewed and blockers documented |

## Workstream Backlog (Week 6)

### GSC Connection
- [x] Implement OAuth start/callback endpoints.
- [x] Enforce signed state and workspace-scoped validation.
- [ ] Persist connection metadata securely.

### Property Binding
- [ ] Implement verified property listing in server path.
- [ ] Add property selection action with tenant checks.
- [ ] Persist active property per workspace.

### Sync Execution and Visibility
- [ ] Implement initial ingestion trigger and sync run state.
- [ ] Add failure diagnostics + retry-safe behavior.
- [ ] Expose sync status in workspace/integration UI.

### Quality and Governance
- [ ] Add integration tests for OAuth callback and property bind actions.
- [ ] Add risk-register updates for Google API dependencies and quota constraints.
- [ ] Confirm quality gates remain green across all Week 6 PRs.

## Risk Watch (Week 6)

| Risk | Early Signal | Mitigation |
| --- | --- | --- |
| OAuth callback instability | redirect/state mismatch errors | deterministic signed state + callback test coverage |
| API quota/permission gaps | property list or sync responses fail frequently | scoped retries + clear diagnostics + quota monitoring |
| Tenant leakage risk | cross-workspace binding visibility | enforce server-side workspace checks on all integration actions |

## Exit Criteria
- At least one workspace can connect GSC and bind a property successfully.
- Initial sync run lifecycle is recorded and observable.
- Errors are diagnosable and retry path is documented.
- Week 7 scope is based on validated integration feedback.
