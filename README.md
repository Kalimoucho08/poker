# Poker — mode d'emploi pour le laptop

## 1. Installer Claude Code DeepSeek (une seule fois)

Sur le laptop, ouvre un terminal et colle ça :

```bash
# Installer Claude Code via npm
npm install -g @anthropic-ai/claude-code

# Créer le fichier d'environnement DeepSeek
cat > ~/.claude-deepseek-env << 'EOF'
export ANTHROPIC_BASE_URL="https://api.deepseek.com/v1"
export CLAUDE_API_KEY="ta_cle_deepseek_ici"
EOF
nano ~/.claude-deepseek-env
```

> **Où trouver ta clé DeepSeek ?**  
> Sur le fixe, regarde dans `~/.claude-deepseek-env` — la clé est dans ce fichier. Copie-la.

Puis vérifie que ça marche :

```bash
source ~/.claude-deepseek-env && claude --version
```

Tu devrais voir `2.1.153 (Claude Code)`.

---

## 2. Récupérer le projet

```bash
# Créer le dossier coding2
mkdir -p ~/coding2

# Cloner le projet
cd ~/coding2
git clone https://github.com/Kalimoucho08/poker.git

# Rendre les scripts exécutables
cd poker
chmod +x claude.sh j-archive.sh j-reprends.sh deploy-poker.sh
```

---

## 3. Travailler

```bash
cd ~/coding2/poker
./claude.sh
```

Claude Code démarre en mode isolé (`--bare`) : pas de hooks, pas de mémoires de l'ancien système.  
Il lit directement :
- `CLAUDE.md` (instructions locales)
- `.ai/contexte.md` (contexte du projet)
- `.ai/seance.md` (session en cours)

---

## 4. Le cycle entre les deux machines

### Sur le fixe, en partant :
```bash
cd ~/coding2/poker
bash j-archive.sh
```
→ Commite tout, push vers GitHub, backup pCloud

### Sur le laptop, en arrivant :
```bash
cd ~/coding2/poker
git pull origin main
```
→ Récupère le travail du fixe

### Sur le laptop, en partant :
```bash
cd ~/coding2/poker
bash j-archive.sh
```

### Sur le fixe, en arrivant :
```bash
cd ~/coding2/poker
git pull origin main
```

**Règle : ne jamais travailler sur les deux machines en même temps.**

---

## 5. Déploiement

```bash
cd ~/coding2/poker
bash deploy-poker.sh
```

Le jeu est en ligne :  
https://generateurs-scolaires.free.nf/jeux/poker/

---

## 6. Dépannage

**"claude : commande introuvable"** → npm install -g @anthropic-ai/claude-code

**"claude.sh ne trouve pas DeepSeek"** → vérifie que `~/.claude-deepseek-env` existe avec la bonne clé

**"git push refuse"** → tu dois configurer GitHub sur le laptop :
```bash
git config --global user.name "Kalimoucho08"
git config --global user.email "ton@email.com"
gh auth login
```

**"Le projet n'est pas à jour"** → `git pull origin main`

---

## Structure du projet

```
~/coding2/poker/
├── .ai/contexte.md     → mémoire du projet (versionnée dans git)
├── .ai/seance.md       → séance en cours
├── CLAUDE.md           → instructions pour Claude Code (locales)
├── claude.sh           → lance Claude Code en mode isolé
├── j-archive.sh        → sauvegarde (commit + push + pCloud)
├── j-reprends.sh       → restaure depuis GitHub
├── deploy-poker.sh     → déploiement FTP
├── AGENTS.md           → instructions pour autres IA
├── assets/             → images, icônes, avatars
└── ...                 → le code du jeu
```
