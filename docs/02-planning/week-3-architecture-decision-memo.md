---
owner: Engineering
status: active
last_updated: 2026-02-27
audience: pm, engineering, stakeholders
---

# Week 3 Architecture Decision Memo

## Purpose
Capture Week 3 architecture decisions before Week 4 payments implementation begins.

## Executive Summary
- Week 3 delivery is complete for Drizzle foundation and project CRUD slices.
- We evaluated adding TanStack Query and GraphQL now versus later.
- Decision: defer TanStack Query + GraphQL until clear product and API pressure appears.
- Decision: proceed with dual payment providers in Week 4 (Stripe + Razorpay).

## Decision 1: TanStack Query + GraphQL Timing

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Add now | Early standardization, rich client cache patterns | High complexity while core product is still stabilizing | Not selected |
| Add later | Keeps architecture simple while server actions mature | Requires future migration planning for selected screens | Selected |

### Why later
- Current app flow is server-action and revalidation centered.
- GraphQL introduces schema/resolver/client-cache overhead not required for current scope.
- We should avoid adding two abstraction layers (GraphQL + client query cache) before core monetization is live.

### Revisit triggers
- Multiple API consumers (web + mobile + partner integrations).
- Complex dashboard pages needing aggressive client-side orchestration.
- Repeated invalidation/cache pain with server-action-only patterns.

## Decision 2: Payments Provider Strategy

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Stripe only | Faster implementation and fewer moving parts | Weaker local payment fit for India-first customers | Not selected |
| Stripe + Razorpay | Better local conversion and payment method coverage | More webhook/reconciliation complexity | Selected |

### Week 4 implementation order
1. Provider-neutral billing interfaces and metadata model.
2. Stripe checkout/webhook baseline.
3. Razorpay order/checkout/webhook baseline.
4. Unified subscription status sync + plan enforcement checks.

## Risk Notes
- Dual provider events can diverge; enforce idempotency and a shared internal billing event model.
- Build provider-specific observability early (event logs, signature verification failures, replay count).
- Keep plan enforcement based on internal subscription state, not direct provider response at request time.

