---
name: surgerank-product-requirements
description: Defines and maintains SurgeRank requirements with controlled scope and acceptance criteria. Use when writing PRDs, refining stories, managing P0/P1/P2 priorities, handling change requests, and keeping scope aligned to launch goals.
---

# SurgeRank Product Requirements

## Goal
Keep scope disciplined and requirements implementation-ready.

## Scope Framework
- `P0`: required for launch value
- `P1`: important but can ship after P0
- `P2`: defer unless explicitly approved

## Requirement Standard
Each requirement must include:
1. Problem statement
2. User and workflow impacted
3. Functional requirement
4. Non-functional expectations (performance/security/reliability)
5. Acceptance criteria
6. Out-of-scope note

## Change Control
- Any new requirement needs:
  - impact on timeline
  - impact on dependencies
  - impact on launch gates
- No scope adds without explicit re-prioritization.

## Deliverables
- PRD section updates
- Acceptance criteria list
- Scope decision log
- Documentation updates routed through `surgerank-docs-ops` for canonical consistency

## Additional Resource
- Requirement template: [requirement-template.md](requirement-template.md)
