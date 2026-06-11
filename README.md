# Texas Hold'em Poker — Moteur JS Vanilla

Moteur de poker Texas Hold'em en JavaScript vanilla (pas de frameworks), jouable dans le navigateur.

## Version active : **V9** (racine)

- 🃏 Moteur de poker complet (préflop → showdown)
- 🤖 20 profils PNJ avec personnalités, traits génétiques, tilt
- 🏆 Mode tournoi SNG (blinds progressifs, éliminations, payout)
- 🔄 Mode Circuit (série de tournois, classement cumulé, adaptation des PNJ)
- 📊 Stats carrière (localStorage)
- 🎵 Audio procédural + FX visuels (particules, confettis)
- 🧠 Stratégies avancées : GTO, position, board texture, stack depth, multiway, opponent modeling

## Versions antérieures

| Version | Dossier | Contenu |
|---------|---------|---------|
| V6 | `v6/` | Base : moteur de jeu, 6 joueurs, interface |
| V7 | `v7/` | + Sons procéduraux, animations, FX |
| V8 | `v8/` | + 20 PNJ, tournoi, opponent model, stratégies |
| V9 | racine | + Classement live, circuit, payout, stats carrière |

## Lancer

```bash
python3 -m http.server 8080 --bind 0.0.0.0
# Puis ouvrir http://localhost:8080
```

## Structure

```
.
├── game.js          # Moteur principal (2850 lignes)
├── index.html       # Interface
├── style.css        # Styles
├── npcs.js          # Profils et décisions PNJ
├── tournament.js    # Logique tournoi + circuit
├── decide.js        # Décision stratégique
├── stats.js         # Stats carrière
├── audio.js         # Synthèse audio procédurale
├── fx.js            # Effets visuels
├── strategies/      # Modules stratégiques (GTO, position, etc.)
├── v6/              # Version 6
├── v7/              # Version 7
└── v8/              # Version 8
```
