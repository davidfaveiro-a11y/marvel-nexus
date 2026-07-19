grant select, insert, update on public.storage_assets to authenticated;
grant select, insert, update on public.invitations to authenticated;
grant select, insert, update on public.collections to authenticated;
grant select, insert, update on public.characters to authenticated;
grant select, insert, update on public.rarities to authenticated;
grant select, insert, update on public.cards to authenticated;
grant select on public.admin_audit_logs to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'admins manage private game assets'
  ) then
    create policy "admins manage private game assets"
    on storage.objects
    for all
    to authenticated
    using (
      bucket_id in ('card-artworks', 'card-thumbnails', 'collection-covers', 'avatars')
      and public.is_admin()
    )
    with check (
      bucket_id in ('card-artworks', 'card-thumbnails', 'collection-covers', 'avatars')
      and public.is_admin()
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'players read private game assets'
  ) then
    create policy "players read private game assets"
    on storage.objects
    for select
    to authenticated
    using (
      bucket_id in ('card-artworks', 'card-thumbnails', 'collection-covers', 'avatars')
      and public.is_authorized_player()
    );
  end if;
end;
$$;
