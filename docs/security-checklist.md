# Checklist securite

- RLS activee sur toutes les tables applicatives.
- Aucune service role key dans mobile, admin browser ou logs CI.
- Buckets d'illustrations prives.
- URL signees a duree limitee pour les assets.
- Ouverture de pack uniquement via RPC transactionnelle.
- Roles admin verifies cote base de donnees.
- Invitations validees cote serveur.
- Journaux d'audit pour actions sensibles.
- Pas de generation automatique ni scraping d'images protegees.
- Variables d'environnement documentees sans valeur reelle.
