---
owner: Engineering
status: active
last_updated: 2026-02-27
audience: engineering, devops, pm, stakeholders
---

# Tags and Releases

## Purpose
Define a lightweight release process for SurgeRank using SemVer tags and GitHub Releases.

## Executive Summary
- Use semantic version tags (`v0.x.y`) as release checkpoints.
- Create releases only from `main` after required checks pass.
- Publish a GitHub Release automatically when a valid tag is pushed.
- Keep rollback simple by tagging every production candidate.

## Versioning Policy (V1)

| Change Type | Version Bump | Example |
| --- | --- | --- |
| Backward-compatible bug fix | Patch (`v0.1.0 -> v0.1.1`) | small fix, no API/scope change |
| Backward-compatible feature | Minor (`v0.1.1 -> v0.2.0`) | new endpoint, new UI module |
| Breaking change | Minor in pre-1.0 (`v0.2.0 -> v0.3.0`) | schema/contract change requiring migration |

## Release Gate (Mandatory)
- `main` branch protections and required checks are green.
- Security checks are green (`dependency review`, `codeql analysis`, `secret scan`).
- Release notes and known risks are reviewed.
- Rollback path is known and documented.

## GitHub Automation
- Workflow: `.github/workflows/release.yml`
  - Triggers:
    - push tags matching `v*.*.*`
    - manual run from GitHub Actions (`workflow_dispatch`)
  - Verify: install, lint, typecheck, test, build (`apps/web`)
  - Publish: create GitHub Release with generated notes
- Release notes config: `.github/release.yml`

## Manual Release Steps

```bash
git checkout main
git pull

# choose next version
git tag v0.2.0
git push origin v0.2.0
```

After push:
1. Wait for `release` workflow to finish.
2. Validate GitHub Release content and deployment notes.
3. Deploy from the release tag commit.

## GitHub UI Release Steps (No Local Tag Command)
1. Open GitHub -> `Actions` -> `release` workflow.
2. Click `Run workflow`.
3. Fill inputs:
   - `version`: example `v0.2.0`
   - `target_branch`: `main`
   - `prerelease`: `false` for stable release
4. Run workflow and wait for `verify release build` + `publish github release`.
5. Open `Releases` and confirm the generated notes.

## Rollback
- Identify last known-good release tag (example: `v0.1.4`).
- Redeploy that tag commit.
- Record incident context in `docs/07-devops/incident-response-runbook.md`.

## Solo Maintainer Notes
- Keep cadence simple: one batched release per week unless hotfix is needed.
- Prefer patch releases for urgent fixes; avoid large mixed releases.
- Close release with a short stakeholder summary in plain language.
