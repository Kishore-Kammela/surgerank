---
owner: PM
status: active
last_updated: 2026-02-26
audience: engineering, pm, stakeholders
---

# Retention and Cost Controls

## Purpose
Define data retention, archival, and cost guardrails for sustainable V1 operations.

## Audience
Engineering, PM, stakeholders.

## Executive Summary
- Keep high-value aggregates longer and raw payloads shorter.
- Track provider and infra spend with threshold alerts.

## Data Retention Tiers
- Long-term: core business entities and daily aggregates.
- Mid-term: ranking and GEO snapshots.
- Short-term: raw provider payloads and verbose logs.

## Cost Controls
- API budget caps by agency/workspace.
- Caching strategy by provider and endpoint type.
- Scheduled cleanup jobs for short-term data.

## Monitoring
- spend by provider
- cost per active workspace
- storage growth trends
