grant select on public.profiles to authenticated;
grant select on public.player_cards to authenticated;

drop policy if exists "players read leaderboard profiles" on public.profiles;
create policy "players read leaderboard profiles"
on public.profiles
for select
using (
  id = auth.uid()
  or public.is_admin()
  or (
    public.is_authorized_player()
    and not hide_leaderboard_stats
  )
);

drop policy if exists "players read leaderboard card stats" on public.player_cards;
create policy "players read leaderboard card stats"
on public.player_cards
for select
using (
  player_id = auth.uid()
  or public.is_admin()
  or public.is_authorized_player()
);
