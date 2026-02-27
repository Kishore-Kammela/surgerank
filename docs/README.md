---
owner: PM
status: active
last_updated: 2026-02-26
audience: all
---

# SurgeRank Documentation Hub

## Purpose
Single entry point for V1 planning, execution, and stakeholder communication.

## Audience
- Developers
- QA
- PM
- Business stakeholders

## How to Use This Hub
1. Start with `01-product` for scope and priorities.
2. Use `03-architecture` and `05-data-and-db` for technical decisions.
3. Use `06-quality` and `07-devops` for release readiness.
4. Use `08-launch-and-ops` and `09-stakeholder-briefs` for launch communication.

## Document Principles
- Layered format: executive summary first, details after.
- Plain language first, technical depth where needed.
- Every major doc includes owner, status, and last updated date.
- Scope changes must update relevant docs and decision logs.

## Sections
- [`01-product/README.md`](01-product/README.md)
- [`02-planning/README.md`](02-planning/README.md)
- [`03-architecture/README.md`](03-architecture/README.md)
- [`04-engineering/README.md`](04-engineering/README.md)
- [`05-data-and-db/README.md`](05-data-and-db/README.md)
- [`06-quality/README.md`](06-quality/README.md)
- [`07-devops/README.md`](07-devops/README.md)
- [`08-launch-and-ops/README.md`](08-launch-and-ops/README.md)
- [`09-stakeholder-briefs/README.md`](09-stakeholder-briefs/README.md)

## Start Here by Audience
- Stakeholders:
  - [`09-stakeholder-briefs/executive-summary-v1.md`](09-stakeholder-briefs/executive-summary-v1.md)
  - [`01-product/v1-scope-and-priorities.md`](01-product/v1-scope-and-priorities.md)
  - [`08-launch-and-ops/go-no-go-gates.md`](08-launch-and-ops/go-no-go-gates.md)
- PM and Operations:
  - [`02-planning/roadmap-v1.md`](02-planning/roadmap-v1.md)
  - [`02-planning/week-1-execution-board.md`](02-planning/week-1-execution-board.md)
  - [`02-planning/risk-register.md`](02-planning/risk-register.md)
  - [`08-launch-and-ops/activation-and-kpi-framework.md`](08-launch-and-ops/activation-and-kpi-framework.md)
- Engineering and QA:
  - [`03-architecture/system-overview.md`](03-architecture/system-overview.md)
  - [`05-data-and-db/supabase-schema-plan.md`](05-data-and-db/supabase-schema-plan.md)
  - [`07-devops/cicd-architecture.md`](07-devops/cicd-architecture.md)
  - [`07-devops/github-repo-security-setup-checklist.md`](07-devops/github-repo-security-setup-checklist.md)
  - [`06-quality/qa-test-plan.md`](06-quality/qa-test-plan.md)
  - [`06-quality/security-review-report-template.md`](06-quality/security-review-report-template.md)

## Metadata Standard
For major docs, include frontmatter fields:
- `owner`
- `status` (`draft`, `active`, `review`)
- `last_updated`
- `audience`

## Documentation Status Dashboard

### Active and Core
- Product:
  - `01-product/v1-scope-and-priorities.md`
  - `01-product/personas-and-jtbd.md`
- Planning:
  - `02-planning/roadmap-v1.md`
  - `02-planning/risk-register.md`
  - `02-planning/decision-log.md`
- Architecture:
  - `03-architecture/system-overview.md`
  - `03-architecture/tech-stack.md`
  - `03-architecture/data-architecture-and-tenancy.md`
- Delivery and quality:
  - `05-data-and-db/supabase-schema-plan.md`
  - `06-quality/qa-test-plan.md`
  - `07-devops/cicd-architecture.md`
  - `08-launch-and-ops/go-no-go-gates.md`
- Stakeholder communication:
  - `09-stakeholder-briefs/executive-summary-v1.md`

### In Review or Evolving
- `01-product/v2-preview.md`
- Integration/provider strategy docs as launch constraints evolve
- Cost and retention thresholds as real usage data arrives

## Documentation Review Workflow
1. Author updates document and metadata.
2. Add decision log reference if scope/architecture changed.
3. Request review from document owner and one cross-functional reviewer.
4. Mark status:
   - `draft` while being prepared
   - `review` during active review
   - `active` once approved
5. Update `last_updated` on publish.

## Writing Guidelines
- Start with executive summary and business outcome.
- Keep language plain, then add technical depth.
- Prefer short sections and clear bullet points.
- End with decisions, risks, and next actions when relevant.

## Templates
- Standard document template:
  - [`_templates/doc-template.md`](_templates/doc-template.md)

## Governance and Audit
- Documentation readiness report:
  - [`docs-readiness-report.md`](docs-readiness-report.md)

## Scope Migration Note
- Legacy scope files in `scope/*.docx` have been retired.
- Canonical scope source is now:
  - [`scope/README.md`](scope/README.md)
