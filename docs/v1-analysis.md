# Marvel Nexus - Analyse V1

## 1. Perimetre precis de la version 1

La V1 est une application privee de collection de cartes, centree sur un petit groupe invite. Elle doit permettre a un joueur autorise de creer son compte via invitation, se connecter, consulter son profil, parcourir les collections et cartes actives, ouvrir un pack gratuit toutes les 3 heures, recevoir une carte tiree cote serveur, obtenir de l'XP, gerer les doublons et consulter sa progression.

Le panneau d'administration V1 couvre les operations indispensables a la vie du jeu: invitations, joueurs, collections, personnages, raretes, cartes, illustrations fournies manuellement, parametres de tirage et audit des actions sensibles.

Hors perimetre V1: echanges de cartes, marche prive, saisons, quetes, achats integres, publicites, generation automatique d'illustrations, scraping d'images, packs payants, fabrication de cartes avec fragments. L'architecture reserve des points d'extension pour ces sujets sans les implementer.

## 2. Hypotheses

- Le projet Supabase est gere par le proprietaire et les secrets restent hors depot.
- Les illustrations sont importees manuellement via le panneau admin ou Supabase Storage.
- La V1 utilise un pack contenant une carte, mais la base de donnees supporte plusieurs items par ouverture.
- Le mobile n'utilise jamais la service role key Supabase.
- Les fonctions SQL securisees restent l'autorite pour les ouvertures de pack, l'XP, les niveaux et les compensations.
- Les comptes administrateurs sont attribues par migration, script serveur ou action manuelle controlee, jamais depuis l'app mobile.

## 3. Risques principaux

- Proprietes intellectuelles: ne pas inclure d'assets Marvel officiels dans le depot, ni automatiser leur recuperation.
- Triche: toute logique critique doit rester cote Supabase, en transaction.
- Concurrence: l'ouverture de pack doit verrouiller le profil joueur pour eviter les doubles ouvertures.
- RLS: une erreur de politique peut exposer l'historique, les emails ou les journaux admin.
- Stockage prive: les buckets doivent rester prives avec URL signees a duree limitee.
- Scalabilite UI: les grilles mobile doivent paginer et charger des miniatures.

## 4. Architecture generale

```text
apps/mobile        Application Expo Router, React Native, TypeScript.
apps/admin         Panneau Next.js, TypeScript, Tailwind CSS.
packages/types     Types partages et contrats metier.
packages/validation Schemas Zod partages.
packages/config    Configuration partagee, constantes, design tokens.
supabase/migrations Schema, RLS, fonctions SQL.
supabase/seed      Donnees de demonstration neutres.
supabase/functions Fonctions edge futures si necessaire.
docs               Guides produit, securite et deploiement.
```

Le mobile et l'admin consomment Supabase avec la cle anon publique. Les operations sensibles passent par des RPC Supabase en `security definer`, qui verifient `auth.uid()` et le role. Les validations communes sont partagees par `packages/validation`, afin d'eviter des divergences entre mobile et admin.

## 5. Arborescence complete cible

```text
project-root/
  apps/
    mobile/
      app/
        (auth)/
        (tabs)/
        _layout.tsx
        index.tsx
      components/
      features/
        catalog/
        pack/
      hooks/
      lib/
      store/
      theme/
      assets/
      package.json
      app.json
      tsconfig.json
    admin/
      app/
        (dashboard)/
        login/
        layout.tsx
        page.tsx
      components/
      lib/
      package.json
      next.config.ts
      tsconfig.json
  packages/
    config/
    types/
    validation/
  supabase/
    migrations/
    functions/
    seed/
    tests/
  docs/
  scripts/
  .github/workflows/
  .env.example
  eas.json
  package.json
  README.md
```

## 6. Schema detaille de la base de donnees

Tables principales:

- `profiles`: profil public et progression serveur du joueur.
- `user_roles`: roles `player`, `moderator`, `admin`.
- `invitations`: codes d'invitation, email optionnel, expiration, limites d'utilisation.
- `characters`: personnages configurables.
- `collections`: collections configurables, actives ou non.
- `rarities`: raretes avec poids, XP, couleurs et effets.
- `storage_assets`: references d'assets prives stockes dans Supabase Storage.
- `cards`: cartes reliees a personnage, collection, rarete et assets.
- `player_cards`: etat agrege des cartes possedees par joueur.
- `pack_openings`: historique d'ouverture.
- `pack_opening_items`: cartes obtenues pendant une ouverture.
- `xp_transactions`: journal des gains ou corrections XP.
- `player_levels`: courbe de progression.
- `game_settings`: parametres actifs du jeu.
- `draw_configurations`: versions publiees des poids et modes de tirage.
- `player_favorites`: favoris joueur.
- `notifications`: preferences et journal de notification.
- `admin_audit_logs`: journal immuable des actions admin.

Contraintes clefs:

- UUID comme cle primaire.
- `cards(collection_id, public_number)` unique.
- `player_cards(player_id, card_id)` unique.
- `profiles(username)` unique.
- `invitations(code)` unique.
- Index sur les FK, statuts actifs, dates d'ouverture et historiques admin.

## 7. Politiques RLS V1

- `profiles`: un utilisateur lit son profil et les profils publics autorises; il modifie uniquement ses preferences publiques.
- `user_roles`: lecture limitee a son propre role; modification admin via fonction serveur uniquement.
- `invitations`: aucune lecture publique; validation via RPC; gestion admin uniquement.
- `characters`, `collections`, `rarities`, `cards`: lecture des contenus actifs par joueurs autorises; ecriture admin.
- `storage_assets`: lecture metadata active par joueurs autorises; ecriture admin.
- `player_cards`, `pack_openings`, `pack_opening_items`, `xp_transactions`: lecture propre utilisateur; ecriture interdite au client.
- `player_favorites`: lecture/ecriture propre utilisateur.
- `game_settings`, `draw_configurations`: lecture parametres publies; ecriture admin.
- `notifications`: lecture/ecriture propre utilisateur pour preferences; ecriture systeme pour journal.
- `admin_audit_logs`: lecture/ecriture admin uniquement, insertion via fonctions sensibles.

## 8. Parcours utilisateur

Joueur:

1. Ouvre l'application.
2. Session verifiee avec Supabase.
3. Si non connecte, connexion ou inscription avec invitation.
4. Apres connexion, arrive sur l'accueil avec niveau, XP et compte a rebours.
5. Si pack disponible, lance l'ouverture.
6. L'app appelle `open_free_pack`, puis joue l'animation avec le resultat serveur.
7. Le joueur consulte ses collections, cartes obtenues, doublons et progression.

Administrateur:

1. Se connecte au panneau web.
2. Verifie son role admin cote Supabase.
3. Cree une invitation.
4. Cree collection, personnage, rarete ou carte.
5. Importe une illustration fournie manuellement.
6. Publie ou desactive le contenu.
7. Consulte joueurs, ouvertures, audits et statistiques.

## 9. Plan de developpement etape par etape

1. Initialiser le monorepo, TypeScript strict, lint, formatage, CI et documentation.
2. Creer les migrations Supabase: tables, index, contraintes, RLS et fonctions RPC.
3. Ajouter seeds de demonstration neutres et tests SQL de securite.
4. Implementer auth mobile: connexion, inscription par invitation, session, profil.
5. Implementer catalogue mobile: collections, detail, filtres, cartes verrouillees.
6. Implementer ouverture de pack: RPC, TanStack Query, animation, haptics, etats offline.
7. Implementer panneau admin: dashboard, invitations, CRUD catalogue, upload assets.
8. Ajouter tests unitaires partages et tests d'integration Supabase.
9. Optimiser cache, pagination, accessibilite et URL signees.
10. Finaliser guides: installation, administration, deploiement, securite, distribution privee.

## 10. Choix techniques initiaux

- Expo SDK 57, aligne avec React Native 0.86 et React 19.2 selon la documentation Expo actuelle.
- Next.js 16.2.x, version stable npm actuelle.
- Tailwind CSS 4.3.x pour l'administration.
- Supabase JS v2 pour mobile et admin.
- Vitest pour les tests de packages partages.
- SQL Supabase pour la logique critique de tirage en transaction.
