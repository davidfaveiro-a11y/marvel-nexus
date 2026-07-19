# Guide de deploiement

## Supabase

```bash
supabase link --project-ref your-project-ref
supabase db push
supabase functions deploy
```

Creer les buckets prives:

- `card-artworks`
- `card-thumbnails`
- `collection-covers`
- `avatars`

## Admin

Deployer `apps/admin` sur Vercel ou une plateforme compatible Next.js. Configurer:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` uniquement si une route serveur en a besoin.

## Mobile

Configurer les identifiants dans `apps/mobile/app.json`, puis:

```bash
npx eas build --platform android --profile preview
npx eas build --platform ios --profile preview
```

Distribuer Android en interne via EAS. Pour iOS, utiliser TestFlight ou une distribution privee adaptee au compte Apple.
