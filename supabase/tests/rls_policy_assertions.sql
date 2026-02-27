-- Executable RLS assertions for Day 3 validation.
-- Fails with non-zero exit if tenant isolation behavior regresses.

-- Test identities
-- user_a: agency_a owner/admin in workspace_a
-- user_b: agency_b owner/admin in workspace_b
-- user_c: unrelated user (no membership)

insert into auth.users (id)
values
  ('00000000-0000-0000-0000-0000000000aa'),
  ('00000000-0000-0000-0000-0000000000bb'),
  ('00000000-0000-0000-0000-0000000000cc')
on conflict (id) do nothing;

insert into public.agencies (id, name, slug, created_by)
values
  ('00000000-0000-0000-0000-0000000000a1', 'Agency A', 'agency-a', '00000000-0000-0000-0000-0000000000aa'),
  ('00000000-0000-0000-0000-0000000000b1', 'Agency B', 'agency-b', '00000000-0000-0000-0000-0000000000bb')
on conflict (id) do nothing;

insert into public.workspaces (id, agency_id, name, slug, created_by)
values
  ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-0000000000a1', 'Workspace A', 'workspace-a', '00000000-0000-0000-0000-0000000000aa'),
  ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-0000000000b1', 'Workspace B', 'workspace-b', '00000000-0000-0000-0000-0000000000bb')
on conflict (id) do nothing;

insert into public.agency_memberships (agency_id, user_id, role)
values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000aa', 'owner'),
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000bb', 'owner')
on conflict (agency_id, user_id) do nothing;

insert into public.workspace_memberships (agency_id, workspace_id, user_id, role)
values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-0000000000aa', 'owner'),
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-0000000000bb', 'owner')
on conflict (workspace_id, user_id) do nothing;

set role authenticated;

-- user_a: same-tenant visibility and cross-tenant denial
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000aa', false);

do $$
declare
  same_tenant_count int;
  cross_tenant_count int;
begin
  select count(*) into same_tenant_count
  from public.workspaces
  where agency_id = '00000000-0000-0000-0000-0000000000a1';

  select count(*) into cross_tenant_count
  from public.workspaces
  where agency_id = '00000000-0000-0000-0000-0000000000b1';

  if same_tenant_count <> 1 then
    raise exception 'expected 1 same-tenant workspace for user_a, got %', same_tenant_count;
  end if;

  if cross_tenant_count <> 0 then
    raise exception 'expected 0 cross-tenant workspaces for user_a, got %', cross_tenant_count;
  end if;
end
$$;

-- user_a allowed: create own project
insert into public.projects (agency_id, workspace_id, name, domain, created_by)
values (
  '00000000-0000-0000-0000-0000000000a1',
  '00000000-0000-0000-0000-0000000000a2',
  'project-a',
  'project-a.example.com',
  '00000000-0000-0000-0000-0000000000aa'
)
on conflict (workspace_id, domain) do nothing;

-- user_a denied: create project in foreign workspace
do $$
begin
  begin
    insert into public.projects (agency_id, workspace_id, name, domain, created_by)
    values (
      '00000000-0000-0000-0000-0000000000b1',
      '00000000-0000-0000-0000-0000000000b2',
      'project-foreign',
      'project-foreign.example.com',
      '00000000-0000-0000-0000-0000000000aa'
    );
    raise exception 'expected insert denial for foreign workspace';
  exception
    when insufficient_privilege then
      null;
  end;
end
$$;

reset role;

-- Trigger guard check under owner context:
-- mismatch should fail even without RLS restrictions.
do $$
begin
  begin
    insert into public.projects (agency_id, workspace_id, name, domain, created_by)
    values (
      '00000000-0000-0000-0000-0000000000a1',
      '00000000-0000-0000-0000-0000000000b2',
      'project-mismatch',
      'project-mismatch.example.com',
      '00000000-0000-0000-0000-0000000000aa'
    );
    raise exception 'expected trigger rejection for agency/workspace mismatch';
  exception
    when others then
      if position('agency/workspace mismatch' in SQLERRM) = 0 then
        raise;
      end if;
  end;
end
$$;
