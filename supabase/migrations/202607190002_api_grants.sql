grant usage on schema public to anon, authenticated, service_role;

grant select on public.storage_assets to authenticated, service_role;
grant select on public.collections to authenticated, service_role;
grant select on public.characters to authenticated, service_role;
grant select on public.rarities to authenticated, service_role;
grant select on public.cards to authenticated, service_role;
grant select on public.player_levels to authenticated, service_role;
grant select on public.game_settings to authenticated, service_role;
grant select on public.draw_configurations to authenticated, service_role;
grant select on public.collection_progress to authenticated, service_role;

grant select, update on public.profiles to authenticated;
grant select on public.user_roles to authenticated;
grant select on public.player_cards to authenticated;
grant select on public.pack_openings to authenticated;
grant select on public.pack_opening_items to authenticated;
grant select on public.xp_transactions to authenticated;
grant select, insert, update, delete on public.player_favorites to authenticated;
grant select, update on public.notifications to authenticated;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all routines in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;

grant execute on function public.validate_invitation(text) to authenticated;
grant execute on function public.complete_invited_profile(text, text) to authenticated;
grant execute on function public.open_free_pack(text) to authenticated;
grant execute on function public.calculate_level(integer) to authenticated, service_role;
