insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('card-artworks', 'card-artworks', false, 10485760, array['image/webp', 'image/png', 'image/jpeg', 'image/avif']),
  ('card-thumbnails', 'card-thumbnails', false, 3145728, array['image/webp', 'image/png', 'image/jpeg', 'image/avif']),
  ('collection-covers', 'collection-covers', false, 5242880, array['image/webp', 'image/png', 'image/jpeg', 'image/avif']),
  ('avatars', 'avatars', false, 2097152, array['image/webp', 'image/png', 'image/jpeg'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
