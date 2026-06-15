# Poker — contexte du projet

## Qu'est-ce que c'est
Texas Hold'em Poker — moteur JS vanilla. V9 active à la racine, versions antérieures (v6/v7/v8) dans les sous-dossiers.

## Règles de travail
- Tout le code est en anglais (jeu), les dialogues/contexte en français
- Backup git avant toute modification : `git tag backup-avant-xxx`
- Commits en français, descriptifs
- Le dossier `.ai/` contient la mémoire du projet — versionné dans git
- Le dossier `strategies/` contient l'IA des joueurs

## Architecture
- `index.html` — point d'entrée
- `game.js` — cœur du jeu (108 Ko)
- `npcs.js` — joueurs IA
- `tournament.js` — tournois
- `decide.js` — prise de décision
- `simulate.js` — simulations
- `fx.js` / `audio.js` — effets et son
- `stats.js` — statistiques

## Déploiement
- Machine : ftpupload.net (InfinityFree)
- Dossier : /htdocs/jeux/poker/
- Commande : `bash deploy-poker.sh`
