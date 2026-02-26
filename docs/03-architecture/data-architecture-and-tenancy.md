---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, security, qa
---

# Data Architecture and Tenancy

## Purpose
Define how V1 data is modeled, isolated, and validated across agencies and client workspaces.

## Audience
Engineering, security, QA.

## Executive Summary
- V1 uses shared-schema multi-tenancy in Supabase/Postgres.
- Tenant safety is enforced with key design (`agency_id`, `workspace_id`), RLS policies, and test coverage.
- Access is denied by default unless membership is explicitly valid.

## Tenancy Model
- Agency account as top-level tenant boundary.
- Workspaces as client-level isolation units.
- Membership and roles define access permissions.

## Core Entity Boundaries
- Agency-scoped:
  - agency, membership, billing, usage summaries
- Workspace-scoped:
  - properties, audits, keywords, rankings, GEO queries/results, reports
- System/internal:
  - job metadata, event outbox, platform telemetry

## Isolation Controls
- `agency_id` across tenant entities.
- `workspace_id` for workspace-scoped records.
- RLS and service-layer authorization.

## Authorization Model
- Authentication handled via Supabase Auth.
- Authorization resolved from membership and role records.
- Service role is backend-only and never exposed to the client.
- Sensitive actions require both role and resource-level checks.

## Data Flow
1. Provider ingestion jobs
2. Normalization and aggregation
3. Dashboard/report consumption
4. Usage and cost accounting

## Integrity and Quality Controls
- Idempotent ingestion for repeated provider sync jobs.
- Timestamped snapshots for trends and historical reporting.
- Clear stale-data indicators when provider sync is delayed.
- Cost-aware caching by endpoint type and freshness need.

## Performance Strategy
- Index by tenant keys and time windows on high-volume tables.
- Keep raw payload retention short and aggregate retention longer.
- Introduce partitioning only when growth thresholds are met.

## Validation
- Policy tests for cross-tenant denial.
- Integration tests for authorization and data visibility.
- Regression tests for role changes and workspace access transitions.
