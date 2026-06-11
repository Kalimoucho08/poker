# CHANGELOG — Poker V9

## Nouveautés par rapport à V8

### Panneau Classement Live
- Bouton 🏅 Classement dans le header du jeu
- 3 modes :
  - **Cash game** : classement par stacks (médailles 🥇🥈🥉)
  - **Tournoi** : joueurs actifs + éliminés (position, gain, niveau)
  - **Circuit** : classement cumulé (points, victoires, ITM, gains)
- Design : pastilles de couleur, joueurs éliminés grisés

### Mode Circuit
- Série de 2 à 5 tournois avec les mêmes joueurs
- **Classement cumulé** : points par position, totaux
- **Adaptation inter-tournois** :
  - Perdants → plus agressifs, s'adaptent
  - Leaders → plus conservateurs, rationnels
  - Milieu → stables
- Écran de fin de circuit : classement final, champion, stats
- Enchaînement automatique des tournois

### Payout adaptatif
- 4-5 joueurs : top 2 payés (60/40)
- 6 joueurs : top 3 payés (50/30/20)
- 7-8 joueurs : top 4
- 9+ joueurs : top 5+

### Corrections
- IDs d'archétypes mis à jour dans init()
- Fonctions manquantes (preflopStrength, npcRaiseSizing) intégrées

### Fichiers modifiés
- `tournament.js` — payout adaptatif, fonctions circuit
- `game.js` — panneau classement, handlers circuit, finishCircuitTournament
- `index.html` — toggle circuit, panneau classement
- `style.css` — styles rankings-panel
