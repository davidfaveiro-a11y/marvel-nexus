# Supabase local

## Demarrage

```bash
supabase start
supabase db reset
```

`db reset` applique les migrations puis les seeds. Pour les buckets prives, executer aussi:

```bash
supabase db query --file supabase/seed/storage_buckets.sql
supabase db query --file supabase/seed/dev_seed.sql
```

## Variables locales

Recuperer les valeurs affichees par `supabase status`, puis remplir `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Premier administrateur

1. Creer un compte via l'app ou Supabase Studio.
2. Copier `scripts/create-first-admin.sql`.
3. Remplacer `admin@example.test`.
4. Executer la requete avec un acces service role ou via Studio local.

## Verification rapide

```bash
supabase status
pnpm run verify
```
