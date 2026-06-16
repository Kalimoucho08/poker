#!/usr/bin/env bash
# claude.sh — Lance Claude Code en mode coding2
# Détecte automatiquement l'environnement DeepSeek s'il existe
# Usage : ./claude.sh [options]

set -euo pipefail

cd "$(dirname "$0")"

echo "=== Claude Code — mode coding2 ==="
echo "Projet : $(pwd)"
echo ""

# Détection de l'environnement DeepSeek
DEEPSEEK_ENV="$HOME/.claude-deepseek-env"
CLAUDE_CMD="claude"

if [ -f "$DEEPSEEK_ENV" ]; then
  echo "→ Environnement DeepSeek trouvé"
  source "$DEEPSEEK_ENV" 2>/dev/null || true
else
  echo "→ Claude Code standard"
fi

# Vérifier que claude est accessible
if ! command -v "$CLAUDE_CMD" &>/dev/null; then
  echo "❌ claude introuvable dans le PATH"
  echo "   Installe Claude Code ou configure ~/.claude-deepseek-env"
  exit 1
fi

# Lancer avec --bare (pas de hooks, pas de CLAUDE.md global)
# + MCP config si disponible
MCP_CONFIG="$HOME/.claude/.mcp.json"
MCP_FLAG=""
[ -f "$MCP_CONFIG" ] && MCP_FLAG="--mcp-config $MCP_CONFIG"

exec claude --bare $MCP_FLAG --append-system-prompt "$(cat CLAUDE.md)" "$@"
