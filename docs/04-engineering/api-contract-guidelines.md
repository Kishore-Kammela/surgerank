---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: backend, frontend, qa
---

# API Contract Guidelines

## Purpose
Standardize API contract design for reliability and cross-team clarity.

## Audience
Backend, frontend, QA.

## Executive Summary
- Contracts must be explicit, versioned, and validated.
- Breaking changes require planned migration and communication.

## Contract Rules
- Version base path for API surface.
- Use consistent pagination and error formats.
- Validate request and response payloads.
- Keep naming conventions consistent.

## Change Policy
- Additive changes preferred in V1.
- Breaking changes require decision log entry and release notes.
- QA contract tests required for changed endpoints.

## Documentation Expectations
- Endpoint purpose
- auth requirements
- request/response examples
- error scenarios
