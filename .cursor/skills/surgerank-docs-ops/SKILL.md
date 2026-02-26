---
name: surgerank-docs-ops
description: Creates, updates, and governs SurgeRank documentation for product, engineering, QA, PM, and stakeholders. Use when authoring or revising docs, maintaining metadata/frontmatter, reconciling scope decisions, improving PDF readability, and keeping docs as the canonical source of truth.
---

# SurgeRank Docs Ops

## Goal
Keep SurgeRank documentation clear, current, and decision-ready across all audiences.

## When To Use
- Creating new docs in `docs/` or `docs/scope/`
- Updating scope, architecture, QA, CI/CD, launch, or stakeholder docs
- Reconciling contradictory requirements or plan details
- Preparing docs for PDF sharing and presentations
- Running documentation readiness and governance checks

## Core Standards
- Every major doc must include frontmatter:
  - `owner`
  - `status` (`draft`, `review`, `active`)
  - `last_updated`
  - `audience`
- Use layered writing:
  1. Purpose
  2. Audience
  3. Executive summary
  4. Detailed sections
  5. Decisions, open items, next actions
- Keep terminology consistent across documents.

## Required Workflow
1. Identify impacted docs and canonical source location.
2. Apply content changes and reconcile contradictions.
3. Update decision log when scope/architecture trade-offs change.
4. Validate navigation links and section consistency.
5. Run PDF-readability checks (table clarity, diagram captions, heading flow).
6. Update readiness status if document maturity changed.

## PDF and Presentation Rules
- Prefer concise tables for comparisons and thresholds.
- Use mermaid diagrams for flows/timelines only when they add clarity.
- Add one-line interpretation below each diagram.
- Avoid overly long paragraphs; keep section blocks scannable.

## Change Governance
- Scope, architecture, API, security, and launch-gate changes must update docs.
- No implementation should proceed on outdated scope docs.
- Canonical docs are under `docs/`; avoid parallel shadow copies.

## Deliverables
- Updated documents with metadata
- Cross-link updates in relevant README hubs
- Decision log updates for major trade-offs
- Readiness or review notes when applicable

## Additional Resources
- Docs update checklist: [docs-update-checklist.md](docs-update-checklist.md)
- Documentation template: [`../../docs/_templates/doc-template.md`](../../docs/_templates/doc-template.md)
- Documentation readiness report: [`../../docs/docs-readiness-report.md`](../../docs/docs-readiness-report.md)
