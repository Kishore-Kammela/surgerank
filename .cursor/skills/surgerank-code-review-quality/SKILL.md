---
name: surgerank-code-review-quality
description: Applies SurgeRank PR review and code quality standards for major changes. Use when reviewing pull requests, running self-review before merge, enforcing severity-based findings, and validating commit/PR quality for Next.js, TypeScript, Supabase, and Bun workflows.
---

# SurgeRank Code Review and Quality

## Goal
Enforce consistent, teachable, and production-safe review standards across all major changes.

## When To Use
- Any PR with major feature, refactor, security, data-model, or release impact
- Pre-merge self-review by the author
- Reviewer-led quality checks and decision-making
- AI-assisted review reports

## Severity Model
- `[BLOCKER]` critical correctness/security/data risk, must fix immediately
- `[MUST]` major issue, must fix before merge
- `[SHOULD]` important quality/maintainability issue, discuss and resolve
- `[NIT]` minor optional improvement
- `[PRAISE]` positive pattern reinforcement
- `[QUESTION]` clarification required

## Review Priority Order
1. Security
2. Correctness
3. Performance
4. Maintainability
5. Style and consistency

## Review Categories (SurgeRank Stack)
1. PR hygiene
2. Commit standards
3. TypeScript and type safety
4. React and Next.js patterns
5. Code quality and modularity
6. Naming and readability
7. Import organization
8. Performance
9. Security
10. Accessibility
11. Tailwind and UI consistency
12. Supabase and data policies
13. Documentation and decision-log updates

## Required Output Format
- Use the review report template in [review-report-template.md](review-report-template.md)
- Findings grouped by severity
- Include educational "why it matters" notes for non-trivial findings
- End with explicit merge recommendation:
  - `APPROVE`
  - `CHANGES REQUESTED`
  - `NEEDS DISCUSSION`

## Merge Rules
- No open `[BLOCKER]` or `[MUST]` findings at merge time
- `[SHOULD]` items either fixed or explicitly accepted with rationale
- PR must pass required CI gates
- Scope/architecture changes must update docs and decision log

## Self-Review Workflow
1. Run checklist in [self-review-checklist.md](self-review-checklist.md)
2. Run local quality commands (lint, build, tests where applicable)
3. Validate docs impact
4. Confirm commit message format compliance

## Stack Adaptation Notes
- Package manager: Bun (commands should use Bun by default)
- App stack: Next.js + TypeScript + Tailwind
- Data/auth: Supabase (RLS and tenancy checks are review-critical)
- Treat data boundary mistakes as `[BLOCKER]`

## Additional Resources
- Review report template: [review-report-template.md](review-report-template.md)
- Self-review checklist: [self-review-checklist.md](self-review-checklist.md)
