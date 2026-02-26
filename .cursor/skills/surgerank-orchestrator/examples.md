# SurgeRank Orchestrator Examples

## 1) Add GEO Citation Endpoint
- Task: Add endpoint to fetch citation trend for a workspace.
- Primary skill: `surgerank-backend`
- Supporting skills: `surgerank-supabase-rls`, `surgerank-testing`, `surgerank-security`
- Why: API/domain logic + tenant-safe query + tests + authz controls.

## 2) New Dashboard Card for GEO Delta
- Task: Add a new card in client dashboard showing 7-day GEO delta.
- Primary skill: `surgerank-frontend`
- Supporting skills: `surgerank-ui`, `surgerank-product-analytics`
- Why: page implementation + visual clarity + metric instrumentation.

## 3) Migration for Competitor Limits
- Task: Add plan-based competitor limit columns and enforce in DB.
- Primary skill: `surgerank-supabase-rls`
- Supporting skills: `surgerank-backend`, `surgerank-testing`, `surgerank-cicd`
- Why: schema/policies + service enforcement + tests + migration gating.

## 4) Production Deploy Pipeline Failure
- Task: Fix failed deploy caused by workflow misconfiguration.
- Primary skill: `surgerank-cicd`
- Supporting skills: `surgerank-qa`, `surgerank-security`
- Why: pipeline correctness + release validation + secret safety.

## 5) Design-Partner Weekly Review
- Task: Analyze partner usage and decide beta adjustments.
- Primary skill: `surgerank-launch-ops`
- Supporting skills: `surgerank-business-analysis`, `surgerank-product-analytics`, `surgerank-project-management`
- Why: operational cadence + business decisions + metrics + follow-up planning.

## 6) Scope Change Request Mid-Sprint
- Task: Add GA4 integration request while critical path is active.
- Primary skill: `surgerank-product-requirements`
- Supporting skills: `surgerank-project-management`, `surgerank-business-analysis`
- Why: scope control + dependency impact + business trade-off.

## 7) Report Export Layout Improvements
- Task: Improve PDF readability and export consistency.
- Primary skill: `surgerank-ui`
- Supporting skills: `surgerank-frontend`, `surgerank-qa`
- Why: visual/report quality + integration into report flow + regression checks.

## 8) Security Hardening for Webhooks
- Task: Add signature validation, replay protection, and audit logs.
- Primary skill: `surgerank-security`
- Supporting skills: `surgerank-backend`, `surgerank-testing`
- Why: security controls + endpoint changes + validation tests.

## 9) Activation Funnel Drop-Off Investigation
- Task: Investigate why users fail before first report export.
- Primary skill: `surgerank-product-analytics`
- Supporting skills: `surgerank-research-ops`, `surgerank-business-analysis`, `surgerank-launch-ops`
- Why: event and funnel diagnosis + evidence review + business/action plan.

## 10) Release Candidate Go/No-Go
- Task: Decide whether to deploy this week to production.
- Primary skill: `surgerank-qa`
- Supporting skills: `surgerank-cicd`, `surgerank-launch-ops`, `surgerank-project-management`
- Why: quality gate decision + deployment readiness + launch criteria and planning.

## 11) Scope Docs Refresh Before Team PDF Share
- Task: Update `docs/scope/` package with latest pricing and launch gate changes.
- Primary skill: `surgerank-docs-ops`
- Supporting skills: `surgerank-product-requirements`, `surgerank-project-management`
- Why: documentation governance + scope consistency + change-control alignment.
