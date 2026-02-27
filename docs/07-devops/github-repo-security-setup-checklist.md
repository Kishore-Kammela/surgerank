---
owner: Engineering + DevOps
status: active
last_updated: 2026-02-27
audience: engineering, devops, pm
---

# GitHub Repo Security Setup Checklist

## Purpose
Provide an exact, copy-follow setup for GitHub repository settings so SurgeRank quality and security gates are actually enforced.

## Executive Summary
- Configure branch protection on `main` with required checks and code owner reviews.
- Enable GitHub security features (Dependabot, secret scanning, code scanning).
- Protect environments (`prod`) with approval gates and scoped secrets.
- Validate the setup with one test PR before relying on it for releases.

## Operating Modes

| Mode | Use When | Review Settings |
| --- | --- | --- |
| Solo Maintainer (now) | Only one active maintainer | Keep required checks ON, keep PR flow optional, disable required approvals + code owner review until teammates join |
| Team Mode (later) | 2+ active maintainers | Require PR + approvals + code owner reviews |

## Prerequisites
- Admin access to the GitHub repository.
- Existing workflows in `.github/workflows`:
  - `quality.yml`
  - `security.yml`
- Existing policy files:
  - `.github/CODEOWNERS` (replace placeholder team names first)
  - `.github/dependabot.yml`

## 1) Branch Protection: `main` (Mandatory)

Path in GitHub: `Settings` -> `Branches` -> `Branch protection rules` -> `Add rule`

Set:
- **Branch name pattern:** `main`
- **Require a pull request before merging:** ON
  - Required approvals:
    - Solo mode: `0` (or disable approval requirement)
    - Team mode: `1` (or `2` for stricter mode)
  - Dismiss stale pull request approvals when new commits are pushed: ON
  - Require review from Code Owners:
    - Solo mode: OFF
    - Team mode: ON
- **Require status checks to pass before merging:** ON
  - Require branches to be up to date before merging: ON
  - Required checks:
    - `commitlint`
    - `web lint and build`
    - `dependency review`
    - `codeql analysis`
    - `secret scan`
- **Require conversation resolution before merging:** ON
- **Require linear history:** ON
- **Restrict who can push to matching branches:** ON (maintainers only)
- **Allow force pushes:** OFF
- **Allow deletions:** OFF

## 2) Pull Request Hygiene Settings

Path in GitHub: `Settings` -> `General` -> `Pull Requests`

Set:
- Allow merge commits: OFF
- Allow squash merging: ON
- Allow rebase merging: ON (optional; choose one merge style if you want stricter history)
- Automatically delete head branches: ON

Recommended convention:
- Title format: `type(scope): short description`
- Keep PR size focused (prefer under ~500 changed lines excluding lockfiles/generated files).

## 3) Security Features

Path in GitHub: `Settings` -> `Security` and `Code security and analysis`

Enable:
- Dependency graph: ON
- Dependabot alerts: ON
- Dependabot security updates: ON
- Secret scanning: ON
- Push protection for secrets: ON
- Code scanning (CodeQL): ON
- Private vulnerability reporting: ON (if applicable)

## 4) Environments and Secrets

Path in GitHub: `Settings` -> `Environments`

Create environments:
- `preview`
- `prod`

For `prod`, set protection rules:
- Required reviewers: at least 1 maintainer
- Wait timer: optional (5-10 minutes for extra safety)
- Restrict deployments to `main` only

Secrets strategy:
- Put production secrets only in `prod` environment.
- Use repo-level secrets only for non-sensitive/shared CI values.
- Never duplicate production secrets in repo-level secrets.

Minimum secrets checklist:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `SUPABASE_ACCESS_TOKEN` (if using Supabase CLI in CI)
- `SUPABASE_DB_PASSWORD` (if migration workflows require it)

## 5) Access Control

Path in GitHub: `Settings` -> `Collaborators and teams`

Set:
- Least privilege access (read by default, write/admin only where needed).
- Team-based access (avoid direct user-based admin grants where possible).
- Require 2FA for organization members (org setting).

## 6) SLA and Escalation Mapping

Use these targets from `docs/03-architecture/security-and-compliance-baseline.md`:
- Critical: acknowledge 15 min, contain 4h, fix 24h.
- High: acknowledge 1h, contain 24h, fix 3 business days.
- Medium: acknowledge 1 business day, fix 10 business days.

Escalation owner map:
- CI/security check failures: Engineering on-call.
- Secret leaks: Security owner + Engineering lead.
- Branch protection bypass requests: Engineering manager approval required.

## 7) Validation Drill (Run Once Now)

1. Create a test branch and PR to `main`.
2. Confirm all required checks appear and must pass.
3. Confirm CODEOWNERS auto-requests reviewers on sensitive files.
4. Attempt to merge with a failing check (must be blocked).
5. Attempt to push a fake test secret token (must be blocked by push protection).
6. Close drill with a short note in `docs/02-planning/decision-log.md`.

## Done Criteria
- Branch protection saved and active on `main`.
- Required checks are selected exactly as listed.
- Security features are enabled.
- `prod` environment has reviewer gate and scoped secrets.
- One validation drill completed successfully.

## Transition Plan (Solo -> Team)
1. Replace `@YOUR_GITHUB_USERNAME` in `.github/CODEOWNERS` with real team handles.
2. Enable `Require review from Code Owners`.
3. Set required PR approvals to `1` (or `2` for stricter operations).
4. Update incident/security role assignments from single-owner to primary+backup.
