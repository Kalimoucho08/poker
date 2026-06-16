# Poker — contexte du projet

## Qu'est-ce que c'est
Texas Hold'em Poker — moteur JS vanilla. V9 active à la racine, versions antérieures (v6/v7/v8) dans les sous-dossiers.

## Environnement de travail — deux machines

Ce projet vit sur **deux machines** :
- **PC fixe** (jdema) — i7, RTX 3080, WSL2 — machine principale
- **Laptop** (gege) — portable ULIS, pas de GPU, WSL2 — machine secondaire

Le code + la mémoire (.ai/) **voyagent entre les machines via GitHub**.
Un backup supplémentaire est copié sur **pCloud** sous forme de bundle.

### Synchronisation
- `bash j-archive.sh` → commit + tag de backup + push GitHub + bundle pCloud
- `bash j-reprends.sh` → pull GitHub + vérification bundle pCloud
- **Ne jamais travailler sur les deux machines en même temps**
- **Toujours lancer j-archive avant de changer de machine**
- **Toujours lancer j-reprends en arrivant sur l'autre machine**

### Lancement de Claude Code
- `./claude.sh` depuis `~/coding2/poker/` (ou `bash claude.sh`)
- Utilise `--bare` pour éviter les hooks et le CLAUDE.md global de l'ancien système

## Outils disponibles (MCP)

Les serveurs MCP sont chargés depuis `~/.claude/.mcp.json` via `--mcp-config`.
Tous ne sont pas disponibles sur les deux machines :

| Outil | PC fixe (jdema) | Laptop (gege) |
|---|---|---|
| gemini-vision | ✅ analyse d'images | ✅ (via clés Gemini) |
| chrome-devtools | ✅ Chrome Windows :9222 | ❌ (pas de Chrome configuré) |
| perplexity-web | ✅ recherche Perplexity | ✅ |
| image-gen | ✅ Stable Diffusion (Forge :7860) | ❌ (pas de GPU) |
| civitai | ✅ recherche modèles | ❌ |

Si un outil est noté ❌ sur la machine courante, ne pas proposer de l'utiliser.
Ne pas essayer de lancer image-gen sur le laptop.

### Génération d'assets graphiques

Deux scripts existent, chacun avec son serveur et ses paramètres :

**A. Assets pour le jeu Poker** (jetons, avatars, icônes, dos de carte, tapis)
- Script : `python3 ~/workspace/gen_poker_v2.py`
- Serveur : **Forge** (port 7860) — API A1111 (`/sdapi/v1/`)
- Modèle : DreamShaperXL_Lightning-SFW + LoRA Flat_Vector_XL
- Paramètres : 6 steps, CFG 3.5, DPM++ 2M SDE Karras, 512x512
- **Lancer Forge d'abord :** `bash /home/jdema/forge/webui.sh` (attendre "Running on local URL")
- Les images vont dans `assets/` du projet poker

**B. Cliparts éducatifs génériques** (objets, animaux, formes)
- Script : `python3 ~/workspace/generate_clipart.py`
- Serveur : **ComfyUI** (port 8188) — API directe
- Modèle : DreamShaperXL_Lightning-SFW
- Paramètres : 5 steps, CFG 2, dpmpp_sde + karras, 768x768
- **Lancer ComfyUI d'abord :** (à définir — pas Forge)

**C. Via MCP image-gen** (Forge également, port 7860)
- Utile pour une génération ponctuelle
- Mêmes paramètres que le script A

**Règle impérative : Ne JAMAIS analyser/vérifier le résultat des images générées** — Jérôme valide visuellement ce qui lui plaît ou pas.

Sur le laptop : pas de GPU, pas de génération d'images.

## Règles de travail
- Tout le code est en anglais (jeu), les dialogues/contexte en français
- Backup git avant toute modification : `git tag backup-avant-xxx`
- Commits en français, descriptifs
- Le dossier `.ai/` contient la mémoire du projet — versionné dans git
- Le dossier `strategies/` contient l'IA des joueurs
- Ce projet est dans `~/coding2/` — c'est un bac à sable pour tester le nouveau workflow
- **Pédagogie** : montrer ce qui est fait concrètement (commandes lancées, fichiers modifiés) et expliquer comment Jérôme peut le refaire par lui-même

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
