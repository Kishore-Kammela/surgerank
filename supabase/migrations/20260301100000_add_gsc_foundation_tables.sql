-- Week 6 Day 1/2 draft migration:
-- - GSC connection metadata
-- - Workspace-to-property binding
-- - Initial sync run tracking

create table if not exists public.gsc_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  provider_user_ref text not null,
  scopes text[] not null default '{}',
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, provider_user_ref)
);

create table if not exists public.gsc_property_bindings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  property_uri text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  selected_by uuid not null references auth.users (id),
  selected_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, property_uri)
);

create table if not exists public.gsc_sync_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  property_uri text not null,
  window_start date not null,
  window_end date not null,
  status text not null check (status in ('queued', 'running', 'success', 'failed')),
  error_code text null,
  created_by uuid null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gsc_connections_workspace on public.gsc_connections (workspace_id);
create index if not exists idx_gsc_property_bindings_workspace on public.gsc_property_bindings (workspace_id);
create index if not exists idx_gsc_sync_runs_workspace_status on public.gsc_sync_runs (workspace_id, status);

drop trigger if exists trg_gsc_connections_set_updated_at on public.gsc_connections;
create trigger trg_gsc_connections_set_updated_at
before update on public.gsc_connections
for each row execute function public.set_updated_at();

drop trigger if exists trg_gsc_property_bindings_set_updated_at on public.gsc_property_bindings;
create trigger trg_gsc_property_bindings_set_updated_at
before update on public.gsc_property_bindings
for each row execute function public.set_updated_at();

drop trigger if exists trg_gsc_sync_runs_set_updated_at on public.gsc_sync_runs;
create trigger trg_gsc_sync_runs_set_updated_at
before update on public.gsc_sync_runs
for each row execute function public.set_updated_at();

alter table public.gsc_connections enable row level security;
alter table public.gsc_property_bindings enable row level security;
alter table public.gsc_sync_runs enable row level security;

create policy "workspace members can read gsc connections"
on public.gsc_connections
for select
to authenticated
using (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = gsc_connections.workspace_id
      and wm.user_id = auth.uid()
  )
);

create policy "workspace owners/admins can manage gsc connections"
on public.gsc_connections
for all
to authenticated
using (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = gsc_connections.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = gsc_connections.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
);

create policy "workspace members can read gsc property bindings"
on public.gsc_property_bindings
for select
to authenticated
using (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = gsc_property_bindings.workspace_id
      and wm.user_id = auth.uid()
  )
);

create policy "workspace owners/admins can manage gsc property bindings"
on public.gsc_property_bindings
for all
to authenticated
using (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = gsc_property_bindings.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = gsc_property_bindings.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
);

create policy "workspace members can read gsc sync runs"
on public.gsc_sync_runs
for select
to authenticated
using (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = gsc_sync_runs.workspace_id
      and wm.user_id = auth.uid()
  )
);

create policy "workspace owners/admins can manage gsc sync runs"
on public.gsc_sync_runs
for all
to authenticated
using (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = gsc_sync_runs.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = gsc_sync_runs.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
);
