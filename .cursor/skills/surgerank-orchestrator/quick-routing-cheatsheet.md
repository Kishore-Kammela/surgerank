# SurgeRank Quick Routing Cheatsheet

## Fast Pick by Task
- Research question -> `surgerank-research-ops`
- Pricing/KPI decision -> `surgerank-business-analysis`
- Scope/PRD/change request -> `surgerank-product-requirements`
- Sprint/blockers/timeline -> `surgerank-project-management`
- Documentation create/update/governance -> `surgerank-docs-ops`
- API/integration/job logic -> `surgerank-backend`
- App pages/flows -> `surgerank-frontend`
- Visual/dashboard/report UX -> `surgerank-ui`
- DB schema/RLS/migrations -> `surgerank-supabase-rls`
- Pipelines/deployments -> `surgerank-cicd`
- Tests/coverage -> `surgerank-testing`
- Release validation/regression -> `surgerank-qa`
- Major PR review and quality scoring -> `surgerank-code-review-quality`
- Security controls -> `surgerank-security`
- Funnel/KPI instrumentation -> `surgerank-product-analytics`
- Beta/launch operations -> `surgerank-launch-ops`

## Common Combinations
- Schema change: `surgerank-supabase-rls` + `surgerank-backend` + `surgerank-testing`
- Production release: `surgerank-cicd` + `surgerank-qa` + `surgerank-security`
- Major PR approval: `surgerank-code-review-quality` + `surgerank-qa` + `surgerank-security`
- Scope change: `surgerank-product-requirements` + `surgerank-project-management`
- Scope-doc refresh: `surgerank-docs-ops` + `surgerank-product-requirements` + `surgerank-project-management`
- Onboarding optimization: `surgerank-frontend` + `surgerank-ui` + `surgerank-product-analytics`

## Safety Rules
- Auth/data boundary touched -> always include `surgerank-security`
- Tenant data touched -> always include `surgerank-supabase-rls`
- Release touched -> always include `surgerank-qa`
