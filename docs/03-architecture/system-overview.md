---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, pm, stakeholders
---

# System Overview

## Purpose
Explain how SurgeRank works end-to-end, from user action to data ingestion, analysis, and reporting.

## Executive Summary
- Web app runs on Vercel with Next.js.
- Data, auth, and storage are managed in Supabase.
- Background jobs run in a worker service for long-running tasks.
- Architecture is optimized for early-stage speed with clear upgrade paths.

## Core Components
- Web application (UI + API)
- Supabase (Postgres, Auth, Storage)
- Worker runtime (crawls, GEO checks, report generation)
- External providers (GSC, DataForSEO, GEO APIs)

## Request and Processing Flow
1. Agency user creates workspace and connects integrations.
2. API validates membership/permissions and stores config.
3. Job queue triggers ingestion and processing tasks.
4. Worker normalizes provider payloads and writes snapshots/aggregates.
5. UI reads tenant-scoped views for dashboards and reports.
6. Reporting pipeline generates export artifacts and delivery events.
7. Metrics pipeline records activation, usage, and reliability signals.

## Module Boundaries
- Identity and access
- Workspace and tenancy management
- Integrations and ingestion
- SEO audits and technical health
- Keywords and ranking trends
- GEO visibility and citation tracking
- Reporting and scheduling
- Billing and usage limits

## Reliability Design
- Async processing for expensive workflows.
- Idempotent jobs for retry safety.
- Clear stale-data indicators when provider sync is delayed.
- Health checks for API and worker heartbeat.

## Non-Functional Priorities
- Tenant isolation
- Operational reliability
- Cost-aware API usage

## Evolution Path (Post-V1)
- Add read-optimized aggregates as volume grows.
- Introduce deeper queue controls and scaling policies.
- Expand integration adapters without changing core domain contracts.
