-- Day 2 baseline migration:
-- - core multi-tenant tables
-- - tenancy constraints
-- - starter RLS policies

create extension if not exists pgcrypto;

create table if not exists public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  name text not null,
  slug text not null,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (agency_id, slug)
);

create table if not exists public.agency_memberships (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (agency_id, user_id)
);

create table if not exists public.workspace_memberships (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  domain text not null,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, domain)
);

create index if not exists idx_workspaces_agency_id on public.workspaces (agency_id);
create index if not exists idx_agency_memberships_user on public.agency_memberships (user_id, agency_id);
create index if not exists idx_workspace_memberships_user on public.workspace_memberships (user_id, workspace_id);
create index if not exists idx_projects_workspace on public.projects (workspace_id, created_at desc);

-- Guard workspace and project records from cross-tenant mismatches.
create or replace function public.ensure_workspace_agency_match()
returns trigger
language plpgsql
as $$
declare
  ws_agency_id uuid;
begin
  select w.agency_id into ws_agency_id
  from public.workspaces w
  where w.id = new.workspace_id;

  if ws_agency_id is null then
    raise exception 'workspace % not found', new.workspace_id;
  end if;

  if ws_agency_id <> new.agency_id then
    raise exception 'agency/workspace mismatch: agency_id % does not own workspace %', new.agency_id, new.workspace_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_workspace_memberships_agency_match on public.workspace_memberships;
create trigger trg_workspace_memberships_agency_match
before insert or update on public.workspace_memberships
for each row execute function public.ensure_workspace_agency_match();

drop trigger if exists trg_projects_agency_match on public.projects;
create trigger trg_projects_agency_match
before insert or update on public.projects
for each row execute function public.ensure_workspace_agency_match();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_agencies_set_updated_at on public.agencies;
create trigger trg_agencies_set_updated_at
before update on public.agencies
for each row execute function public.set_updated_at();

drop trigger if exists trg_workspaces_set_updated_at on public.workspaces;
create trigger trg_workspaces_set_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists trg_projects_set_updated_at on public.projects;
create trigger trg_projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

alter table public.agencies enable row level security;
alter table public.workspaces enable row level security;
alter table public.agency_memberships enable row level security;
alter table public.workspace_memberships enable row level security;
alter table public.projects enable row level security;

-- Agency visibility
create policy "agency members can read agencies"
on public.agencies
for select
to authenticated
using (
  exists (
    select 1
    from public.agency_memberships am
    where am.agency_id = agencies.id
      and am.user_id = auth.uid()
  )
);

create policy "agency members can update agencies with owner/admin role"
on public.agencies
for update
to authenticated
using (
  exists (
    select 1
    from public.agency_memberships am
    where am.agency_id = agencies.id
      and am.user_id = auth.uid()
      and am.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.agency_memberships am
    where am.agency_id = agencies.id
      and am.user_id = auth.uid()
      and am.role in ('owner', 'admin')
  )
);

create policy "authenticated users can create agencies"
on public.agencies
for insert
to authenticated
with check (created_by = auth.uid());

-- Agency memberships visibility
create policy "users can read own agency memberships"
on public.agency_memberships
for select
to authenticated
using (agency_memberships.user_id = auth.uid());

-- Workspace visibility and management
create policy "agency members can read workspaces"
on public.workspaces
for select
to authenticated
using (
  exists (
    select 1
    from public.agency_memberships am
    where am.agency_id = workspaces.agency_id
      and am.user_id = auth.uid()
  )
);

create policy "owners/admins can create workspaces"
on public.workspaces
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.agency_memberships am
    where am.agency_id = workspaces.agency_id
      and am.user_id = auth.uid()
      and am.role in ('owner', 'admin')
  )
);

create policy "owners/admins can update workspaces"
on public.workspaces
for update
to authenticated
using (
  exists (
    select 1
    from public.agency_memberships am
    where am.agency_id = workspaces.agency_id
      and am.user_id = auth.uid()
      and am.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.agency_memberships am
    where am.agency_id = workspaces.agency_id
      and am.user_id = auth.uid()
      and am.role in ('owner', 'admin')
  )
);

-- Workspace memberships visibility and management
create policy "users can read own workspace memberships"
on public.workspace_memberships
for select
to authenticated
using (workspace_memberships.user_id = auth.uid());

-- Projects visibility and management
create policy "workspace members can read projects"
on public.projects
for select
to authenticated
using (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = projects.workspace_id
      and wm.user_id = auth.uid()
  )
);

create policy "workspace owners/admins can create projects"
on public.projects
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = projects.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
);

create policy "workspace owners/admins can update projects"
on public.projects
for update
to authenticated
using (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = projects.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = projects.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
);

create policy "workspace owners can delete projects"
on public.projects
for delete
to authenticated
using (
  exists (
    select 1
    from public.workspace_memberships wm
    where wm.workspace_id = projects.workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin')
  )
);
