# SurgeRank CI/CD Checklist

## PR Checks
- [ ] Lint passes
- [ ] Typecheck passes
- [ ] Tests pass
- [ ] Build passes
- [ ] Security checks pass
- [ ] Migration dry-run passes (if DB changed)
- [ ] Preview deploy is healthy

## Merge to Main
- [ ] Changelog/release notes updated
- [ ] Production migration approved
- [ ] Production deploy approved
- [ ] Post-deploy smoke tests pass
- [ ] Rollback path verified

## Incident Fallback
- [ ] Roll back web deployment
- [ ] Roll back worker image
- [ ] Disable risky feature flags
- [ ] Escalate and create incident log
