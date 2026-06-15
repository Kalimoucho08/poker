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

### Génération d'assets graphiques (clipart, images)

Sur le **PC fixe uniquement**, un script permet de générer des images clipart pour les jeux :
- `python3 ~/workspace/generate_clipart.py`
- Utilise ComfyUI + DreamShaperXL_Lightning-SFW via Forge WebUI (port :7860)
- Paramètres : dpmpp_sde+karras, 5 steps, CFG 2, 768px
- Prompts en français (universel, sans article)
- **Ne JAMAIS analyser/vérifier le résultat des images générées** — Jérôme valide visuellement

Sur le laptop : pas de GPU, pas de génération clipart.

## Règles de travail
- Tout le code est en anglais (jeu), les dialogues/contexte en français
- Backup git avant toute modification : `git tag backup-avant-xxx`
- Commits en français, descriptifs
- Le dossier `.ai/` contient la mémoire du projet — versionné dans git
- Le dossier `strategies/` contient l'IA des joueurs
- Ce projet est dans `~/coding2/` — c'est un bac à sable pour tester le nouveau workflow

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
