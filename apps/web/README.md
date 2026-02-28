# SurgeRank Web App

Next.js 16 + Tailwind 4 frontend for SurgeRank.

## Getting Started

Install dependencies:

```bash
bun install
```

Run local development:

```bash
bun run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `apps/web/.env.local` from `apps/web/.env.example`.

Set these required variables now (Razorpay-first mode):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (for Drizzle query layer)
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RAZORPAY_PLAN_AMOUNT_STARTER_INR` (minor unit, paise)
- `RAZORPAY_PLAN_AMOUNT_PRO_INR` (minor unit, paise)
- `RAZORPAY_PLAN_AMOUNT_SCALE_INR` (minor unit, paise)

Keep these optional Stripe variables empty until your Stripe account is available:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_STARTER`
- `STRIPE_PRICE_ID_PRO`
- `STRIPE_PRICE_ID_SCALE`

### Week 4 Billing Endpoints (Baseline)

- `POST /api/billing/stripe/checkout`
  - Creates Stripe checkout session for `starter | pro | scale` plan codes.
- `POST /api/billing/stripe/webhook`
  - Verifies Stripe webhook signatures and routes core subscription events.
- `POST /api/billing/razorpay/checkout`
  - Creates Razorpay order payload for `starter | pro | scale` plan codes.
- `POST /api/billing/razorpay/webhook`
  - Verifies Razorpay webhook signatures and routes core billing events.

## Quality Commands

```bash
bun run format:check
bun run lint
bun run typecheck
bun run test:run
bun run build
```

## Git Hooks

Hooks are managed by `simple-git-hooks` from `package.json`:

- `pre-commit`: format/lint staged files
- `commit-msg`: commitlint validation
- `pre-push`: commitlint range + lint + typecheck + tests + build

If hooks are not installed yet, run:

```bash
bun run prepare
```

If auto-install fails on your machine, run the fallback installer:

```bash
bun run hooks:install
```

## Notes

- Prefer Bun for all package and script operations.
- CI should stay aligned with local quality commands.
