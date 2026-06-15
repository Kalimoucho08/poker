#!/usr/bin/env bash
# Lance Claude Code en mode coding2 (propre, sans hooks ni global CLAUDE.md)
# Usage : ./claude.sh [options]
# Depuis : ~/coding2/poker/

set -euo pipefail

cd "$(dirname "$0")"

echo "=== Claude Code — mode coding2 ==="
echo "Projet : $(pwd)"
echo ""

# --bare = pas de hooks, pas de CLAUDE.md global, pas de mémoires auto
# --append-system-prompt = injecte nos instructions locales
source ~/.claude-deepseek-env 2>/dev/null || true
exec claude --bare --append-system-prompt "$(cat CLAUDE.md)" "$@"
