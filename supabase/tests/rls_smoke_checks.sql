-- RLS smoke checks (manual/CI SQL assertions)
-- Expected: statements marked "DENY" must fail for non-member user contexts.
-- This file documents the minimum Day 2/Day 3 verification cases.

-- Setup assumptions:
-- - user_a is owner/admin in agency_a, workspace_a
-- - user_b is owner/admin in agency_b, workspace_b
-- - test harness can issue `set local request.jwt.claim.sub = '<uuid>'`

-- As user_a:
-- ALLOW: read same-agency workspace
select id
from public.workspaces
where agency_id = '00000000-0000-0000-0000-0000000000a1';

-- DENY: read cross-agency workspace
select id
from public.workspaces
where agency_id = '00000000-0000-0000-0000-0000000000b1';

-- ALLOW: create project in own workspace
insert into public.projects (agency_id, workspace_id, name, domain, created_by)
values (
  '00000000-0000-0000-0000-0000000000a1',
  '00000000-0000-0000-0000-0000000000a2',
  'alpha project',
  'alpha.example.com',
  '00000000-0000-0000-0000-0000000000aa'
);

-- DENY: create project in foreign workspace
insert into public.projects (agency_id, workspace_id, name, domain, created_by)
values (
  '00000000-0000-0000-0000-0000000000b1',
  '00000000-0000-0000-0000-0000000000b2',
  'foreign project',
  'foreign.example.com',
  '00000000-0000-0000-0000-0000000000aa'
);

-- DENY: cross-tenant mismatch in insert should fail trigger check
insert into public.projects (agency_id, workspace_id, name, domain, created_by)
values (
  '00000000-0000-0000-0000-0000000000a1',
  '00000000-0000-0000-0000-0000000000b2',
  'mismatch project',
  'mismatch.example.com',
  '00000000-0000-0000-0000-0000000000aa'
);
