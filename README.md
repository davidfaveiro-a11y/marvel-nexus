# Marvel Nexus

Application mobile privee de collection de cartes inspiree de personnages Marvel, avec panneau d'administration et backend Supabase securise. Le depot ne contient aucune image officielle ni contenu scrape.

## Etat actuel

Cette base initialise la V1:

- monorepo npm workspaces;
- application mobile Expo Router;
- panneau admin Next.js;
- packages partages types, validation et config;
- migration Supabase initiale avec RLS et RPC d'ouverture de pack;
- seed neutre de developpement;
- CI GitHub Actions;
- documentation d'analyse V1.

## Prerequis

- Node.js 22.13 ou plus recent pour Expo SDK 57.
- pnpm 11.
- Supabase CLI pour appliquer les migrations localement ou sur un projet distant.
- Expo CLI via `npx expo`.
- EAS CLI via `npx eas`.

## Installation

```bash
pnpm install
cp .env.example .env
pnpm run typecheck
```

Apres installation des dependances Expo, lancer:

```bash
pnpm --filter @marvel-nexus/mobile exec expo install --fix
```

## Developpement

Mobile:

```bash
pnpm run dev:mobile
```

Admin:

```bash
pnpm run dev:admin
```

Verification:

```bash
pnpm run verify
```

Verification Supabase de bout en bout:

```bash
pnpm run supabase:verify-e2e
```

## Supabase

1. Creer un projet Supabase prive.
2. Copier les valeurs publiques dans `.env`.
3. Appliquer les migrations dans `supabase/migrations`.
4. Creer les buckets prives `card-artworks`, `card-thumbnails`, `collection-covers`, `avatars`.
5. Executer le seed neutre seulement en developpement.
6. Creer le premier administrateur via SQL controle ou script serveur avec service role.

La logique critique d'ouverture de pack est dans la RPC `public.open_free_pack`. Le client ne choisit jamais la carte, l'XP, le niveau ou le delai.

Pour travailler en local, suivre [Supabase local](./docs/local-supabase.md).

## Documentation

- [Analyse V1](./docs/v1-analysis.md)
- [Guide securite](./docs/security-checklist.md)
- [Guide deploiement](./docs/deployment.md)
- [Supabase local](./docs/local-supabase.md)

## Secrets

Ne jamais committer `.env`, service role keys, certificats EAS, keystores Android ou profils Apple.
