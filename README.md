# SurgeRank

SurgeRank is an agency-first SEO and GEO SaaS platform.

## Repository Structure

- `apps/web`: Next.js 16 frontend (App Router, TypeScript, Tailwind 4)
- `docs`: product, architecture, engineering, quality, and DevOps documentation
- `.github`: CI/CD workflows, PR templates, CODEOWNERS, Dependabot

## Local Setup

```bash
cd apps/web
bun install
bun run dev
```

## Local Quality Gate

Run before pushing:

```bash
cd apps/web
bun run format:check
bun run lint
bun run typecheck
bun run test:run
bun run build
```

## Workflow

- Commit style: Conventional Commits
- PR templates: `.github/PULL_REQUEST_TEMPLATE/`
- Solo maintainer mode is currently active with strict CI/security checks

## Key Docs

- Scope: `docs/scope/README.md`
- Week 1 board: `docs/02-planning/week-1-execution-board.md`
- Engineering review strategy: `docs/04-engineering/commit-and-pr-review-strategy.md`
- Security setup checklist: `docs/07-devops/github-repo-security-setup-checklist.md`
