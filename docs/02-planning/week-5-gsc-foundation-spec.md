---
owner: Engineering
status: active
last_updated: 2026-02-28
audience: engineering, pm, qa, stakeholders
---

# Week 5 GSC Foundation Spec

## Purpose
Define the technical slice for Google Search Console (GSC) onboarding and first ingestion so Week 6 can execute implementation without ambiguity.

## Executive Summary
- Week 5 delivers design and contracts only (not full production ingestion).
- First implementation slice is: connect Google account -> select verified property -> queue initial ingest.
- Data model stays tenant-scoped and provider-agnostic where possible.

## User Flow (V1 Slice)

1. User opens integrations page in active workspace.
2. User starts `Connect Google Search Console`.
3. OAuth consent completes and app receives authorization callback.
4. App lists verified GSC properties available to the connected account.
5. User selects one property for the workspace.
6. App stores linkage and enqueues initial data sync job.

## Data Contract (Initial)

| Entity | Source | Purpose | Required Fields |
| --- | --- | --- | --- |
| `gsc_connection` | OAuth callback | Link workspace to Google account token set | `workspace_id`, `provider_user_ref`, `scopes`, `created_at` |
| `gsc_property_binding` | Property selection | Track chosen Search Console property per workspace | `workspace_id`, `property_uri`, `status`, `selected_by`, `selected_at` |
| `gsc_sync_run` | Worker execution | Track ingestion attempts and outcomes | `workspace_id`, `property_uri`, `window_start`, `window_end`, `status`, `error_code` |

## API and Server Action Boundaries

| Operation | Boundary | Input | Output |
| --- | --- | --- | --- |
| Start OAuth | Route/Action | `workspace_id` | redirect URL |
| OAuth callback | Route | `code`, `state` | connection success/failure |
| List properties | Server-side fetch | workspace context | property list |
| Bind property | Server Action | `workspace_id`, `property_uri` | binding result |
| Trigger initial sync | Job enqueue | `workspace_id`, `property_uri` | `sync_run_id` |

## Security and Tenancy Requirements
- OAuth state must include signed workspace context and anti-CSRF nonce.
- Property listing and binding must enforce active workspace membership checks.
- Tokens stored encrypted-at-rest and never returned to client components.
- Every sync run must be auditable with workspace-scoped logs.

## Non-Goals (Week 5/6 Boundary)
- Full keyword/landing-page analytics UI.
- Competitor tracking or GEO integration.
- Advanced backfill controls beyond first baseline window.

## Week 6 Implementation Readiness Checklist
- [x] User flow finalized and agreed.
- [x] Initial data contract defined.
- [x] Security constraints documented.
- [x] API/action boundary identified.
- [ ] Concrete schema migration file drafted.
- [ ] Worker job implementation PR opened.
