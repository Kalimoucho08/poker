# Workflow Git — Poker

## Principe

Le projet vit sur **deux machines** (PC fixe + laptop) et sur **GitHub** au milieu.
On ne travaille **jamais** sur les deux machines en même temps.

```
[PC fixe]  ←── push/pull ──→  [GitHub]  ←── push/pull ──→  [Laptop]
```

---

## Commandes du projet (scripts prêts à l'emploi)

| Commande | Ce que ça fait |
|----------|---------------|
| `bash j-archive.sh` | commit tout + tag backup + push GitHub + backup pCloud |
| `bash j-reprends.sh` | pull GitHub + vérifie le backup pCloud |
| `bash deploy-poker.sh` | envoie les fichiers vers le serveur FTP InfinityFree |

> Ces scripts se lancent depuis la racine du projet (`~/coding2/poker/`).

---

## Workflow type : changer de machine

### 1. Avant de quitter la machine A

```bash
cd ~/coding2/poker
bash j-archive.sh
```

Ça fait :
- `git add -A`
- `git commit -m "..."` (ou message automatique)
- `git tag backup-avant-YYYYMMDD-HHMM`
- `git push origin main`
- Bundle vers pCloud (backup supplémentaire)

### 2. En arrivant sur la machine B

```bash
cd ~/coding2/poker
bash j-reprends.sh
```

Ça fait :
- `git pull origin main`
- Vérifie la présence du .ai/
- Liste le dernier bundle pCloud

---

## Commandes Git brutes (si besoin en manuel)

### Voir l'état
```bash
git status                 # qu'est-ce qui a changé ?
git log --oneline -10      # les 10 derniers commits
git diff                   # voir les modifications non commitées
git diff --stat            # juste la liste des fichiers modifiés
```

### Commit
```bash
git add -A                          # ajouter tout
git add fichier1.js fichier2.html   # ajouter des fichiers spécifiques
git commit -m "message descriptif"  # commit en français
```

### Synchro
```bash
git pull origin main      # récupérer le travail de l'autre machine
git push origin main      # envoyer son travail
```

### Tags de backup (avant une modif risquée)
```bash
git tag backup-avant-nom-de-la-modif
git push origin --tags
```

### Revenir en arrière
```bash
git log --oneline              # trouver le hash du commit
git reset --hard abc123        # revenir à ce commit (perd les modifs locales !)
git revert abc123              # annuler un commit en en créant un nouveau (safe)
```

---

## Déploiement FTP

Le script `deploy-poker.sh` envoie les fichiers vers InfinityFree :
```
ftp://ftpupload.net → /htdocs/jeux/poker/
```

**Ce qui est déployé :**
- `*.html`, `*.js`, `*.css`
- `*.png` (images)
- Dossier `assets/`
- Dossier `strategies/`

**Ce qui n'est PAS déployé :**
- `.ai/` (mémoire, privée)
- `.git/` et `.gitignore`
- `v6/`, `v7/`, `v8/` (anciennes versions)
- `poker1.png` (screenshot)
- Scripts shell (`*.sh`)
- Fichiers `CHANGELOG-*.md`, `AGENTS.md`, `TODO.md`

> Le site est accessible sur : `https://generateurs-scolaires.free.nf/jeux/poker/?i=1`

---

## Checklist avant de quitter

- [ ] `git status` → propre (rien en attente)
- [ ] `git log --oneline -3` → les derniers commits ont du sens
- [ ] `bash j-archive.sh` → push + backup faits
- [ ] `.ai/seance.md` → à jour (machine actuelle, prochaine étape)
- [ ] Machine éteinte ou session fermée
