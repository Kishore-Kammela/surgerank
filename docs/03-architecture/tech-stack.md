---
owner: Engineering
status: active
last_updated: 2026-02-26
audience: engineering, pm, stakeholders
---

# Tech Stack

## Purpose
Document the V1 stack choices, decision rationale, and upgrade triggers.

## Audience
Engineering, PM, stakeholders.

## Executive Summary
- The stack is optimized for speed, reliability, and low operational cost in early-stage execution.
- Decisions favor managed services and open-source tooling where they reduce delivery risk.
- Upgrade decisions are trigger-based, not assumption-based.

## V1 Baseline Stack
- Frontend: Next.js 16, TypeScript, Tailwind v4, shadcn/ui
- Package manager and scripts: Bun
- Backend: Next.js API routes/server actions + worker runtime
- Data/Auth/Storage: Supabase
- CI/CD: GitHub Actions
- Hosting: Vercel (web) + worker service runtime (Railway/Render/Fly/VPS)
- Monitoring: Sentry + health checks + queue heartbeat checks

## Why This Stack
- Fast iteration loop for small teams.
- Strong TypeScript ecosystem and developer productivity.
- Native support for multi-tenant relational data patterns.
- Built-in preview and deployment workflows.
- Minimal operational burden before first customers.

## Selection Criteria
- Time-to-market impact
- Operational complexity
- Total cost during pre-revenue phase
- Security and tenancy support
- Long-term migration flexibility

## Cost-Control Defaults
- Use managed defaults first; avoid premature infra expansion.
- Keep to two environments initially (`dev`, `prod`) plus preview deploys.
- Add services only when a measured bottleneck appears.

## Upgrade Triggers
- Application:
  - build/deploy cycle time becomes release blocker
- Database:
  - sustained latency or compute pressure on key flows
- Queue/worker:
  - backlog growth impacts SLA or partner workflows
- Observability:
  - incident diagnosis time too high with current telemetry

## Known Constraints
- Avoid deep provider lock-in by isolating adapters and contracts.
- Keep infra complexity low until launch gates are stable.
