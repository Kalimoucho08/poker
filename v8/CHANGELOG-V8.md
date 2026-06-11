# CHANGELOG — Poker V8

## Nouveautés par rapport à V7

### IA PNJ — 20 archétypes + mix génétique
- **20 profils** : Nit, Roc, TAG, LAG, Maniac, Calling Station, Requin, Poisson, Pro, Flambeur, Shérif, Artiste, Robot, Tilter, Survivant, Bully, Trappeur, Spewer, Caméléon, Vieux Briscard
- **Mix génétique** : chaque PNJ = blend aléatoire de 2-3 archétypes avec pondération
- Traits détaillés (10 dimensions) : tightness, aggression, bluffFreq, rationality, adaptability, tiltResist, showdownValue, creativity, tableAwareness, tournamentIQ
- Variation aléatoire ±5% pour chaque profil blendé → chaque PNJ est unique

### Adaptation dynamique
- **Adaptation au tournoi** : ajustement des traits selon stack/BB et phase (bubble, ITM, final table)
- **Tilt progressif** : après un bad beat, le PNJ devient plus loose/agressif, se calme progressivement
- **Opponent modeling enrichi** : tracking VPIP, PFR, 3bet, fold to 3bet, AF, c-bet, WTSD, W$SD
- Classification fine (12 types au lieu de 6)
- Détection de patterns (heater, cooler)

### Mode Tournoi SNG (Sit & Go)
- Structure de blinds évolutive (15 niveaux, antes à partir du niveau 7)
- 3 vitesses : Turbo (5 mains/niveau), Normal (10), Lent (20)
- Prize pool et payout automatique (top 15-40% selon nombre de joueurs)
- Détection de la bulle (le prochain éliminé = 0€)
- Élimination avec position + gain
- Phases : running → bubble → ITM → final_table → complete

### Interface
- Toggle 🏆 Mode Tournoi dans l'écran de configuration
- Sélecteur de vitesse (Turbo / Normal / Lent)
- Log des éliminations avec position et gain
- Annonce de la bulle
- Progression automatique des blinds

### Fichiers ajoutés
- `tournament.js` — moteur de tournoi (structure blinds, payout, classement)
- `npcs.js` — réécrit avec 20 archétypes + mix génétique
- `strategies/opponent-model.js` — enrichi (3bet, c-bet, patterns)

### Fichiers modifiés
- `game.js` — intégration tournoi, nouveaux profils, éliminations
- `decide.js` — adaptation tournoi + tilt dans npcDecide
- `index.html` — toggle tournoi, script tournament.js
