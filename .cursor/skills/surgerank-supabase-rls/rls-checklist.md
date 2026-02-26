# Supabase RLS Checklist

## Table Design
- [ ] `agency_id` present on tenant-scoped tables
- [ ] `workspace_id` present on workspace-scoped tables
- [ ] Tenant foreign keys are enforced

## Policies
- [ ] RLS enabled on all tenant tables
- [ ] Read policy checks membership
- [ ] Insert policy checks tenant ownership
- [ ] Update policy prevents tenant key tampering
- [ ] Delete policy is role-restricted

## Testing
- [ ] Same-tenant access works
- [ ] Cross-tenant access fails
- [ ] Service-role only paths are server-side

## Operations
- [ ] Migration dry-run passes in CI
- [ ] Rollback/forward-fix path documented
- [ ] Backup/restore drill completed
