---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, qa
---

# Backend Standards

## Purpose
Define backend implementation standards for consistency and reliability.

## Executive Summary
- Backend must enforce tenancy and authorization at every boundary.
- Long-running tasks must run asynchronously via worker jobs.
- API contracts must be validated at runtime.

## Standards
- Validate all API input/output.
- Enforce `agency_id` and `workspace_id` scoping in services and queries.
- Use consistent error format and status mapping.
- Log critical state changes for observability and debugging.

## Required Checks
- Unit tests for domain logic.
- Integration tests for tenant boundaries and provider adapters.
- Security checks for authz and webhook handling.

## Anti-Patterns
- Provider calls directly from client code.
- Implicit tenant scoping.
- Silent error handling.
