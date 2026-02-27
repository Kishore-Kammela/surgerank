---
owner: Engineering
status: active
last_updated: 2026-02-27
audience: engineering, qa, pm
---

# Commit and PR Review Strategy

## Purpose
Define SurgeRank commit conventions, PR review quality gates, and merge rules adapted from the Pattem review framework.

## Executive Summary
- Conventional Commits are the mandatory format.
- Major changes must pass severity-based code review.
- Merge is blocked on unresolved `[BLOCKER]` and `[MUST]` findings.
- Review quality is standardized via `surgerank-code-review-quality` skill.

## Commit Convention (Required)

Format:
`type(scope): description`

Examples:
- `feat(api): add workspace onboarding endpoint`
- `fix(ui): resolve report export button loading state`
- `docs(scope): finalize pricing contradiction resolution`

### Allowed Types
`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `wip`

### Allowed Scopes (SurgeRank)
`core`, `api`, `config`, `deps`, `ci`, `supabase`, `db`, `rls`, `worker`, `jobs`, `ui`, `components`, `pages`, `layout`, `styles`, `auth`, `security`, `seo`, `geo`, `reporting`, `docs`, `test`, `qa`

## PR Review Severity Model

| Severity | Tag | Merge Impact |
| --- | --- | --- |
| Critical | `[BLOCKER]` | Must fix immediately; blocks merge |
| Major | `[MUST]` | Must fix before merge |
| Moderate | `[SHOULD]` | Discuss/fix or justify |
| Minor | `[NIT]` | Optional |
| Positive | `[PRAISE]` | Reinforce good patterns |
| Clarification | `[QUESTION]` | Response required |

## Major-Change Review Requirement
A PR is considered major if it changes one or more:
- authentication/authorization paths
- Supabase schema or RLS policies
- core API contracts
- CI/CD or deployment flows
- launch gate metrics logic

Major PRs must use:
- `surgerank-code-review-quality` report template
- QA readiness check
- security check where applicable
- `docs/06-quality/security-review-report-template.md` for high-risk/security-sensitive changes

## Merge Gate Policy (Balanced)
- Required:
  - lint/type/build checks
  - commit format compliance
  - security checks pass (`dependency review`, `codeql analysis`, `secret scan`)
  - no open `[BLOCKER]`/`[MUST]`
  - docs updated for scope/architecture/API changes
- Advisory:
  - selected `[SHOULD]` items may defer if rationale is documented

## Solo Builder Temporary Policy
- While operating as a single maintainer:
  - CI/security gates remain mandatory.
  - Self-review is accepted when documented in PR checklist.
  - Required external approvals and CODEOWNERS enforcement can be temporarily disabled.
- Re-enable team review enforcement when additional maintainers join.

## Branch and Commit Hygiene
- Keep commits atomic and descriptive.
- Clean WIP/fixup commits before final review.
- Avoid bundling unrelated refactors with functional changes.

## Tooling Baseline
- `commitlint.config.cjs` in repo root for commit standards.
- GitHub Actions workflow: `.github/workflows/quality.yml`
  - commitlint enforcement on PRs and `main`
  - Bun-based lint + build checks for `apps/web`
- GitHub Actions workflow: `.github/workflows/pr-auto-label.yml`
  - automatic PR type/area labels based on title and changed files
  - high-risk label for security/CI/data-boundary touching changes
- GitHub Actions workflow: `.github/workflows/release.yml`
  - tag-triggered release verification and GitHub Release publishing
- GitHub Actions workflow: `.github/workflows/db-rls.yml`
  - migration apply check + executable tenant isolation assertions
- GitHub Actions workflow: `.github/workflows/vercel-preview.yml`
  - PR preview deployments when Vercel secrets are configured
- PR template: `.github/PULL_REQUEST_TEMPLATE.md`
- PR template set: `.github/PULL_REQUEST_TEMPLATE/` (`feature.md`, `bugfix.md`, `refactor-chore.md`, `docs.md`, `release-hotfix.md`, `solo-self-review.md`)
- Local hook automation in `apps/web/package.json` via `simple-git-hooks`:
  - `pre-commit`: `lint-staged` (Prettier + ESLint fix on staged files)
  - `commit-msg`: commitlint check against `commitlint.config.cjs`
  - `pre-push`: lint + typecheck + build
- Prettier configuration:
  - `apps/web/.prettierrc.json`
  - `apps/web/.prettierignore`
- Review skill: `.cursor/skills/surgerank-code-review-quality/SKILL.md`

## Key Decisions
- Conventional Commits adopted as canonical strategy.
- Severity-based framework governs review decisions for major PRs.

## Open Items
- Decide whether to add repository-root workspace tooling once more apps/packages are introduced.

## Next Actions
- Add branch protection rules so required checks gate merges (`commitlint`, `web lint and build`).
- Replace `@YOUR_GITHUB_USERNAME` in `.github/CODEOWNERS` with your actual GitHub username.
- When teammates join, migrate CODEOWNERS to team handles and re-enable required reviewer approval + code-owner review.
