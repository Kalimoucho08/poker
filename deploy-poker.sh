#!/usr/bin/env bash
# Déploiement poker → InfinityFree /htdocs/jeux/poker/
set -euo pipefail

HOST="ftpupload.net"
REMOTE_DIR="/htdocs/jeux/poker"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"
PASS="VGA5GC2cJVXy"

echo "→ Déploiement de $LOCAL_DIR vers $HOST:$REMOTE_DIR"

lftp -c "
set ssl:verify-certificate no
set ftp:ssl-allow no
open $HOST
user if0_40103376 $PASS
mirror --reverse --verbose --delete \
  --exclude .git/ \
  --exclude .ai/ \
  --exclude v6/ \
  --exclude v7/ \
  --exclude v8/ \
  --exclude strategies/ \
  --exclude-glob '*.md' \
  --exclude-glob 'CHANGELOG-*' \
  --exclude-glob '*.sh' \
  --exclude-glob '.gitignore' \
  $LOCAL_DIR $REMOTE_DIR
echo '✓ Déploiement terminé'
bye
" 2>&1

echo "→ Poker en ligne : http://generateurs-scolaires.free.nf/jeux/poker/"
