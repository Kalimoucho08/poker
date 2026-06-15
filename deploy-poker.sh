#!/usr/bin/env bash
# Déploiement poker → InfinityFree /htdocs/jeux/poker/
# Les credentials sont dans ~/.netrc

set -euo pipefail

HOST="ftpupload.net"
REMOTE_DIR="/htdocs/jeux/poker"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "→ Déploiement de $LOCAL_DIR vers $HOST:$REMOTE_DIR"

lftp -c "
set ssl:verify-certificate no
open $HOST
user if0_40103376 $(grep -A2 'machine ftpupload.net' ~/.netrc | grep password | awk '{print $2}')
mirror --reverse --verbose --delete \
  --exclude .git/ \
  --exclude .ai/ \
  --exclude v6/ \
  --exclude v7/ \
  --exclude v8/ \
  --exclude strategies/ \
  --exclude '*.md' \
  --exclude CHANGELOG-* \
  $LOCAL_DIR $REMOTE_DIR
echo '✓ Déploiement terminé'
bye
" 2>&1

echo "→ Poker en ligne : http://jeux.klms.fr/poker/"
