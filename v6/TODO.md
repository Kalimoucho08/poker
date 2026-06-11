# TODO — Poker V6

## En cours
- [ ] Tests visuels Chrome DevTools (layout, responsive, logs)

## Fait (11/06/2026)
- [x] Fix Fixed Limit : totalNeeded pas recalculé dans playerRaise() (PNJ perdaient trop de jetons)
- [x] Nettoyage code mort dans endHand() et startNewHand()
- [x] Scroll du panneau log à l'ouverture
- [x] Media query responsive pour le panneau log sur mobile

## Reste à faire
- [ ] Layout : pas de recalcul des positions au resize fenêtre
- [ ] Pot Limit : vérifié OK (formules correctes)
- [ ] Showdown : side pots vérifiés OK

## Idées
- [ ] IA PNJ améliorée (heuristiques → Monte Carlo/CFR si besoin)
- [ ] Mode tournoi
- [ ] Statistiques de session

## Notes
- Repo git : origin/master
- Application HTML/JS vanilla (index.html + game.js + npcs.js + simulate.js)
- Serveur HTTP : `python3 -m http.server 8080 --bind 0.0.0.0`

## Références
- Synthèse algorithmes PNJ : `synthese_pnj_poker_webapp.md`
- Changelogs : `CHANGELOG-V5.md`, `CHANGELOG-V6.md`
