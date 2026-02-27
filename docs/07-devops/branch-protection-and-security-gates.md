---
owner: Engineering + DevOps
status: active
last_updated: 2026-02-27
audience: engineering, devops, pm, qa
---

# Branch Protection and Security Gates

## Purpose
Define mandatory GitHub branch protections and required checks so `main` stays releasable and resistant to common vulnerabilities.

## Executive Summary
- Protect `main` with required status checks, review rules, and linear history.
- Enforce security checks (`dependency review`, `codeql analysis`, `secret scan`) on all merge paths.
- Use defined SLAs to triage and remediate findings by severity.

## Mandatory Branch Protection Settings (`main`)

| Setting | Required Value | Why |
| --- | --- | --- |
| Require pull request before merge | Enabled (solo optional) | Prevent direct unreviewed changes |
| Require approvals | Solo: `0` or disabled; Team: minimum `1` (or `2` for security-sensitive PRs) | Avoid solo deadlock while preserving team review quality |
| Dismiss stale approvals on new commits | Enabled | Prevents outdated approvals |
| Require review from Code Owners | Solo: disabled; Team: enabled | Prevent self-blocking during solo phase, enforce specialist review later |
| Require status checks to pass | Enabled | Blocks merges on broken or insecure changes |
| Restrict who can push | Enabled for maintainers only | Limits accidental bypass |
| Require linear history | Enabled | Keeps history auditable and clean |
| Allow force pushes / deletions | Disabled | Protects branch integrity |

## Solo Phase vs Team Phase

| Mode | Reviewer Model | Recommended Duration | Exit Criteria |
| --- | --- | --- | --- |
| Solo Phase | Self-review + required CI/security checks | Until at least 1 additional maintainer joins | Real team handles configured in `CODEOWNERS` |
| Team Phase | PR approvals + CODEOWNERS enforcement | Ongoing | Standard protected branch operations |

## Required Status Checks

| Check Name | Source Workflow | Merge Requirement |
| --- | --- | --- |
| `commitlint` | `.github/workflows/quality.yml` | Required |
| `web lint and build` | `.github/workflows/quality.yml` | Required |
| `dependency review` | `.github/workflows/security.yml` | Required |
| `codeql analysis` | `.github/workflows/security.yml` | Required |
| `secret scan` | `.github/workflows/security.yml` | Required |

## Security Finding SLA Mapping

| Severity | Merge Policy | Acknowledge | Contain/Mitigate | Permanent Fix |
| --- | --- | --- | --- | --- |
| Critical | Block merge and release | 15 minutes | 4 hours | 24 hours |
| High | Block merge unless approved exception | 1 hour | 24 hours | 3 business days |
| Medium | Merge allowed with tracked follow-up ticket | 1 business day | 3 business days | 10 business days |
| Low | Merge allowed with backlog item | 2 business days | 10 business days | Next release |

## Exception Process (High/Critical Only)
1. Create an exception record in `docs/02-planning/decision-log.md`.
2. Document affected area, customer impact, and compensating control.
3. Add expiry date (max 14 days) and owner.
4. Require PM + Engineering approval before merge.

## Weekly Operating Cadence
- Monday: review Dependabot/security PRs and outstanding findings.
- Wednesday: verify SLA compliance and exception expiry.
- Friday: publish short security status update in project channel.

## Definition of Done (Security Governance)
- All required checks are marked required in GitHub branch settings.
- CODEOWNERS references a real owner (solo username now, teams later).
- No open critical vulnerabilities on `main`.
- High vulnerabilities either fixed or time-boxed with approved exceptions.
