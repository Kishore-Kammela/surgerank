---
name: surgerank-frontend
description: Builds SurgeRank frontend features using Next.js App Router patterns for agency workflows. Use when implementing route structure, server/client boundaries, data loading, forms, dashboards, and user onboarding flows.
---

# SurgeRank Frontend

## Goal
Deliver fast, clear agency workflows with predictable data behavior.

## App Patterns
- Server Components by default.
- Client Components only for interactive islands.
- Keep data fetching server-side unless live polling is required.
- Revalidate selectively after writes.

## UX Priorities
- Agency command center first.
- Client workspace drill-down second.
- Onboarding flow that reaches first value in under 15 minutes.
- Report generation and export visibility.

## Implementation Rules
1. Route segments reflect product IA.
2. Every page has loading, empty, and error states.
3. Actions provide visible success/failure feedback.
4. Keep filters and date ranges consistent across modules.

## Accessibility Baseline
- Keyboard navigation for core flows.
- Proper labels and focus management.
- Semantic structure for tables/charts/forms.

## Deliverables
- Page or feature route
- Shared UI state handling
- Typed data interface
- Unit/integration coverage for critical interactions
