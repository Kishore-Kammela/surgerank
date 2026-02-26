---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, qa, security
---

# Supabase Schema Plan

## Purpose
Define V1 schema strategy and constraints for multi-tenant agency/workspace operations in Supabase.

## Executive Summary
- Use shared-schema Postgres with strict tenant scoping.
- Apply RLS on tenant-scoped tables.
- Keep migration-driven schema management in version control.
- Design for reliable reporting and trend analysis without over-optimizing early.

## Core Model
- Agency-level entities:
  - `agency`, `agency_membership`, `subscription`, `usage_meter`
- Workspace-level entities:
  - `workspace`, `property`, `audit_run`, `audit_issue`, `keyword`, `ranking_snapshot`, `geo_query`, `geo_result`, `report`, `report_schedule`
- Platform entities:
  - `job_run`, `event_outbox`, `activity_log`

## Schema Rules
- Tenant tables include `agency_id`.
- Workspace tables include `agency_id` and `workspace_id`.
- All keys and constraints enforce isolation boundaries.

## Indexing Priorities
- Membership and authorization path indexes.
- Time-series indexes for `ranking_snapshot`, `geo_result`, and `audit_run`.
- Workspace list and report history indexes.
- Add JSON indexes only after measured query need.

## Retention Strategy
- Keep long-lived aggregates for trend views.
- Keep raw provider payloads shorter-term.
- Archive or compact high-volume historical data as needed.

## Migration and Validation
- Migrations only via `supabase/migrations`.
- CI dry-run for schema changes.
- Policy tests for cross-tenant denial.

## Data Quality Controls
- Enforce idempotency keys for ingestion runs where applicable.
- Store source and timestamp metadata for auditability.
- Validate required relationships before report generation tasks.
