# Projet Poker — Guide Claude Code

## Règles de base
- Le code est en anglais (jeu poker)
- Commits en français, descriptifs
- Toute modification → backup tag git → commit
- La mémoire du projet est dans `.ai/` — versionnée dans git
- `.ai/contexte.md` : description du projet, règles, architecture
- `.ai/seance.md` : ce qu'on fait maintenant, prochaines étapes

## Workflow
- **j-archive** → `bash j-archive.sh` : commit + push + backup vers pCloud
- **j-reprends** → `bash j-reprends.sh` : pull depuis GitHub + restauration pCloud
- **Déploiement** → `bash deploy-poker.sh` : envoi vers InfinityFree

## Synchronisation entre machines
Ce projet est dans `~/coding2/` — c'est le bac à sable du nouveau workflow.
- Le code + la mémoire voyagent ensemble via git (remote = GitHub)
- pCloud sert de backup supplémentaire (git bundle)
- Les deux machines partagent le même remote

## À ne pas faire
- Ne pas modifier les scripts bash sans explication
- Ne pas créer de skills Hermes pour ce projet
- Ne pas lancer de destructive sans validation
