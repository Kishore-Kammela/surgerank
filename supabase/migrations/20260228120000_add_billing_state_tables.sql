-- Week 4 Day 4 baseline:
-- - unified internal billing subscription state
-- - idempotent provider event inbox for Stripe + Razorpay

create table if not exists public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  provider text not null check (provider in ('stripe', 'razorpay')),
  external_subscription_id text not null,
  status text not null,
  plan_code text,
  customer_ref text,
  current_period_end timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  last_event_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists billing_subscriptions_workspace_key
on public.billing_subscriptions (workspace_id);

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('stripe', 'razorpay')),
  external_event_id text not null,
  event_type text not null,
  workspace_id uuid references public.workspaces (id) on delete set null,
  occurred_at timestamptz not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create unique index if not exists billing_events_provider_external_event_key
on public.billing_events (provider, external_event_id);

drop trigger if exists trg_billing_subscriptions_set_updated_at on public.billing_subscriptions;
create trigger trg_billing_subscriptions_set_updated_at
before update on public.billing_subscriptions
for each row execute function public.set_updated_at();
