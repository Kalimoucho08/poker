#!/usr/bin/env bash
# j-archive : commit + push + backup pCloud
# À lancer depuis la racine du projet

set -euo pipefail

PROJECT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT"

BRANCH="$(git branch --show-current)"
DATE="$(date +%Y-%m-%d_%H%M)"
TAG="backup-$DATE"

echo "=== j-archive : $PROJECT ($BRANCH) ==="

# 1. Backup tag
git tag "$TAG"
echo "→ Tag créé : $TAG"

# 2. Commit si fichiers modifiés
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "archive $DATE"
  echo "→ Commit effectué"
else
  echo "→ Rien à commiter"
fi

# 3. Push vers GitHub
git push origin "$BRANCH" --tags
echo "→ Push GitHub OK"

# 4. Bundle vers pCloud
echo "→ Création du bundle..."
git bundle create "../poker-$DATE.bundle" --all
rclone copy "../poker-$DATE.bundle" pcloud:coding2/bundles/
rm "../poker-$DATE.bundle"
echo "→ Bundle envoyé sur pCloud"

echo "=== Archive terminée ==="
