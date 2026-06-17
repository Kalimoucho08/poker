# Poker — projet test coding2

## Système
Ce projet est dans le dossier `~/coding2/poker/` — nouveau workflow.
La mémoire du projet est dans `.ai/` (versionné dans git).
Le code + la mémoire voyagent ensemble.

## Travail
- `.ai/contexte.md` : règles et architecture du projet
- `.ai/seance.md` : ce qu'on fait en ce moment, prochaines étapes
- Mets à jour `.ai/seance.md` à chaque changement significatif
- Ne touche pas au dossier `v6/`, `v7/`, `v8/` sauf demande explicite

## Commandes
- `bash j-archive.sh` : commit + push GitHub + backup bundle pCloud
- `bash j-reprends.sh` : pull GitHub + vérification pCloud
- `bash deploy-poker.sh` : déploiement vers InfinityFree

## Sync entre machines
- Sur la machine A : travaille, puis `bash j-archive.sh`
- Sur la machine B : `bash j-reprends.sh`, puis continue
- Ne pas travailler sur les deux machines en même temps sur le même projet

---

## Commandes vocales (quand Claude Code tourne)

Quand je dis **« je reprends »** :
1. `hostname` et `whoami` → détermine la machine (jdema=fixe, gege=laptop)
2. `git status` → vérifie l'état du projet
3. `git pull origin main` → synchronise avec GitHub
4. Mets à jour `.ai/seance.md` avec la machine actuelle
5. Résume l'état : où on en est, prochaine étape

Quand je dis **« on archive »** ou **« sauvegarde »** :
→ Exécute `bash j-archive.sh` (qui fait git add/commit/tag/push + bundle pCloud) et mets à jour `.ai/seance.md`.

Quand je dis **« je suis sur le fixe »** ou **« je suis sur le laptop »** :
→ Met à jour `.ai/seance.md` avec la bonne machine

---

## Rappel
- `./lancer.sh` fait déjà la synchro (git pull) avant de lancer Claude
- Les commandes ci-dessus servent **pendant** la session, si besoin
