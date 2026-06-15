#!/usr/bin/env bash
# j-reprends : pull + restauration depuis GitHub
# À lancer depuis la racine du projet

set -euo pipefail

PROJECT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT"

BRANCH="$(git branch --show-current)"

echo "=== j-reprends : $PROJECT ($BRANCH) ==="

# 1. Pull depuis GitHub
git pull origin "$BRANCH"
echo "→ Pull GitHub OK"

# 2. Restaurer le .ai/ du projet
if [ -f .ai/seance.md ]; then
  echo "→ Mémoire .ai/ présente :"
  head -5 .ai/seance.md
fi

# 3. Vérifier si un bundle pCloud plus récent existe
echo "→ Vérification bundles pCloud..."
BUNDLES="$(rclone ls pcloud:coding2/bundles/ 2>/dev/null | grep poker | sort | tail -1)"
if [ -n "$BUNDLES" ]; then
  echo "   Dernier bundle : $BUNDLES"
else
  echo "   Aucun bundle trouvé"
fi

echo "=== Reprise terminée ==="
