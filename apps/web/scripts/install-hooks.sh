#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HOOKS_DIR="$ROOT_DIR/.git/hooks"

if [[ ! -d "$ROOT_DIR/.git" ]]; then
  echo "No .git directory found at repo root: $ROOT_DIR"
  exit 1
fi

mkdir -p "$HOOKS_DIR"

cat > "$HOOKS_DIR/pre-commit" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd apps/web
bun run lint-staged
EOF

cat > "$HOOKS_DIR/commit-msg" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
MSG_FILE="$1"
if [[ "$MSG_FILE" != /* ]]; then
  MSG_FILE="$(git rev-parse --show-toplevel)/$MSG_FILE"
fi
cd apps/web
bunx commitlint --config ./commitlint.config.cjs --edit "$MSG_FILE"
EOF

cat > "$HOOKS_DIR/pre-push" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd apps/web
bun run prepush:check
EOF

chmod +x "$HOOKS_DIR/pre-commit" "$HOOKS_DIR/commit-msg" "$HOOKS_DIR/pre-push"

echo "Git hooks installed in $HOOKS_DIR"
