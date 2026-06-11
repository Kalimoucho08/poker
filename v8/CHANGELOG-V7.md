# CHANGELOG — Poker V7

## Nouveautés par rapport à V6

### Son (audio.js)
- Synthétiseur procédural Web Audio API — aucun fichier audio externe
- Sons pour chaque action : distribution cartes, blinds, fold, check, call, raise, all-in
- Sons pour les phases : début de main, cartes communes (flop/turn/river)
- Fanfare de victoire et son de défaite
- Bouton 🔊/🔇 dans la barre de contrôle

### Effets visuels (fx.js)
- Particules (burst) lors des all-ins
- Confettis lors des victoires
- Explosion de jetons (chipExplosion) lors des relances
- Pulsation du pot (potPulse) quand il augmente
- Flash rouge "tapis" sur le siège du joueur

### Animations CSS (style.css)
- Cartes : animation `dealt` à la distribution, `communityReveal` au flop/turn/river
- Hover zoom sur les cartes face visible
- Jetons : transition scale au hover
- Pot : glow pulsé permanent
- Action bar : background gradient, bordure glow
- Bouton Fold : effet shake au clic
- Bouton All-in : pulse rouge menaçant
- Winner overlay : animation d'entrée spring
- Scrollbar stylée
- Fond plus profond (gradient multi-couches)
- Glow table amélioré

### Corrections héritées de V6
- Fix Fixed Limit : totalNeeded recalculé après écrasement dans playerRaise()
- Nettoyage code mort (endHand, startNewHand)
- Scroll du panneau log à l'ouverture
- Media query responsive pour le panneau log

## Fichiers ajoutés
- `audio.js` — synthétiseur de sons procéduraux
- `fx.js` — effets visuels et particules
