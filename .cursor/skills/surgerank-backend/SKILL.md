---
name: surgerank-backend
description: Implements backend modules for SurgeRank with Next.js API routes/server actions and background jobs. Use when building authz checks, service boundaries, integration adapters, queue jobs, error handling, and API contracts.
---

# SurgeRank Backend

## Goal
Build reliable, tenant-safe backend features with fast iteration.

## Core Principles
- Keep modular monolith boundaries clear by domain module.
- Enforce tenant checks in service/repository layer.
- Use typed request/response contracts with runtime validation.
- Push long-running work to async jobs.

## Required Patterns
1. Validate input at API boundary.
2. Resolve caller membership and tenant scope.
3. Execute service logic with explicit error mapping.
4. Emit logs/events for key state changes.
5. Return stable response shapes.

## Module Priorities
- Agency/workspace core
- Integrations (GSC, DataForSEO)
- SEO audits
- Keywords/rankings
- GEO checks
- Reports and scheduling
- Billing and usage enforcement

## Non-Negotiables
- No cross-tenant query paths.
- No direct provider calls from client code.
- Retry/backoff for provider failures.
- Idempotency for scheduled jobs and webhooks.

## Deliverables
- Domain service
- API endpoint/server action
- Integration tests
- Operational logs and error handling
