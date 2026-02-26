---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, qa, design
---

# Frontend Standards

## Purpose
Define frontend conventions for consistency, performance, and maintainability.

## Audience
Frontend engineers, QA, design.

## Executive Summary
- Prefer server-rendered data flows with interactive client islands.
- Build for clarity and reliability in agency workflows.

## Standards
- Route structure reflects product IA.
- Typed interfaces for all data consumed by pages/components.
- Consistent loading/empty/error states.
- Accessible forms, tables, and filters.

## Performance Guidelines
- Cache and revalidate where appropriate.
- Avoid unnecessary client-side state duplication.
- Keep component boundaries clear and testable.

## QA Hooks
- Stable selectors for test automation.
- Predictable state messaging and user feedback.
