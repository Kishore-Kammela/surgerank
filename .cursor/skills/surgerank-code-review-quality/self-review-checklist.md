# Self-Review Checklist

## PR Hygiene
- [ ] PR title uses `type(scope): description`
- [ ] PR description explains what/why/how
- [ ] No unrelated changes in same PR

## Commit Standards
- [ ] Conventional commit format used
- [ ] No WIP/fixup commits in final branch
- [ ] Commits are atomic and descriptive

## Code and Type Safety
- [ ] No unjustified `any`
- [ ] Null/undefined handled safely
- [ ] No dead code or commented-out blocks

## React/Next/Tailwind
- [ ] Client components used only when needed
- [ ] Loading/error/empty states handled
- [ ] UI is responsive and accessible

## Security and Data
- [ ] No secrets in code
- [ ] Supabase tenancy and RLS behavior preserved
- [ ] Authz checks present on protected paths

## Docs and Governance
- [ ] Relevant docs updated
- [ ] Decision log updated if scope/architecture changed
- [ ] No unresolved `[BLOCKER]` or `[MUST]` findings
