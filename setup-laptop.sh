#!/usr/bin/env bash
# setup-laptop.sh : prépare coding2/poker sur le laptop
# À lancer depuis n'importe où sur le laptop

set -euo pipefail

echo "=== Setup coding2/poker ==="
echo ""

# 1. Dossier coding2
if [ ! -d "$HOME/coding2" ]; then
  mkdir -p "$HOME/coding2"
  echo "→ ~/coding2/ créé"
else
  echo "→ ~/coding2/ existe déjà"
fi

# 2. Cloner le projet
if [ -d "$HOME/coding2/poker" ]; then
  echo "→ ~/coding2/poker/ existe déjà (git pull pour mettre à jour)"
  cd "$HOME/coding2/poker"
  git pull origin main
else
  echo "→ Clonage du repo poker..."
  cd "$HOME/coding2"
  git clone https://github.com/Kalimoucho08/poker.git
fi

cd "$HOME/coding2/poker"
chmod +x claude.sh j-archive.sh j-reprends.sh deploy-poker.sh

# 3. Vérifier rclone (pour les bundles pCloud)
if command -v rclone &>/dev/null && rclone listremotes 2>/dev/null | grep -q pcloud; then
  echo "→ rclone + pCloud OK"
  # Créer le dossier bundles si besoin
  rclone mkdir pcloud:coding2/bundles 2>/dev/null || true
else
  echo "⚠️  rclone ou pCloud non configuré"
  echo "   Les bundles pCloud ne seront pas disponibles."
  echo "   (le push/pull GitHub fonctionne sans)"
fi

# 4. Vérifier Claude Code DeepSeek
if [ -f "$HOME/.claude-deepseek-env" ]; then
  echo "→ Claude Code DeepSeek trouvé"
else
  echo "⚠️  ~/.claude-deepseek-env non trouvé"
  echo "   Pour lancer Claude Code : cd ~/coding2/poker && ./claude.sh"
  echo "   (le script claude.sh utilise --bare pour être isolé)"
fi

# 5. Résumé
echo ""
echo "=== Prêt ! ==="
echo ""
echo "Pour travailler sur poker :"
echo "  cd ~/coding2/poker"
echo "  ./claude.sh"
echo ""
echo "Pour récupérer le travail du fixe :"
echo "  git pull origin main"
echo "  (ou : bash j-reprends.sh)"
echo ""
echo "Pour envoyer le travail au fixe :"
echo "  bash j-archive.sh"
echo ""
echo "Déploiement :"
echo "  bash deploy-poker.sh"
echo "  → https://generateurs-scolaires.free.nf/jeux/poker/?i=1"
