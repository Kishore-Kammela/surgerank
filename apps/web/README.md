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
- `pre-push`: lint + typecheck + tests + build

## Notes

- Prefer Bun for all package and script operations.
- CI should stay aligned with local quality commands.
