create extension if not exists pgcrypto;

create type public.account_status as enum ('active', 'suspended', 'banned');
create type public.user_role as enum ('player', 'moderator', 'admin');
create type public.duplicate_conversion_mode as enum ('xp', 'fragments', 'xp_and_fragments');
create type public.draw_mode as enum ('random', 'prefer_missing', 'strict_weights', 'pity');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.storage_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  alt_text text not null default '',
  credit text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[A-Za-z0-9_]{3,24}$'),
  avatar_asset_id uuid references public.storage_assets(id) on delete set null,
  status public.account_status not null default 'active',
  level integer not null default 1 check (level >= 1),
  total_xp integer not null default 0 check (total_xp >= 0),
  current_xp integer not null default 0 check (current_xp >= 0),
  next_level_xp integer not null default 100 check (next_level_xp > 0),
  fragments integer not null default 0 check (fragments >= 0),
  last_pack_opened_at timestamptz,
  next_pack_available_at timestamptz,
  hide_leaderboard_stats boolean not null default false,
  reduce_motion boolean not null default false,
  sounds_enabled boolean not null default true,
  haptics_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.user_role not null default 'player',
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9-]{6,32}$'),
  email text,
  expires_at timestamptz,
  max_uses integer not null default 1 check (max_uses > 0),
  used_count integer not null default 0 check (used_count >= 0),
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (used_count <= max_uses)
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cover_asset_id uuid references public.storage_assets(id) on delete set null,
  banner_asset_id uuid references public.storage_assets(id) on delete set null,
  primary_color text not null default '#38BDF8' check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  alias text,
  description text,
  affiliation text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rarities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  rank integer not null unique check (rank > 0),
  color text not null check (color ~ '^#[0-9A-Fa-f]{6}$'),
  border_style text not null default 'solid',
  visual_effect text not null default 'none',
  reveal_animation text not null default 'standard',
  default_xp integer not null default 0 check (default_xp >= 0),
  duplicate_value integer not null default 0 check (duplicate_value >= 0),
  default_weight numeric(8,3) not null check (default_weight > 0),
  sound_asset_id uuid references public.storage_assets(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  public_number integer not null check (public_number > 0),
  character_id uuid not null references public.characters(id) on delete restrict,
  collection_id uuid not null references public.collections(id) on delete restrict,
  rarity_id uuid not null references public.rarities(id) on delete restrict,
  edition_name text not null,
  artwork_asset_id uuid references public.storage_assets(id) on delete set null,
  thumbnail_asset_id uuid references public.storage_assets(id) on delete set null,
  description text,
  xp_value integer not null check (xp_value >= 0),
  duplicate_value integer not null check (duplicate_value >= 0),
  draw_weight numeric(8,3) not null check (draw_weight > 0),
  is_active boolean not null default true,
  released_at timestamptz,
  ends_at timestamptz,
  is_event_card boolean not null default false,
  frame_style text not null default 'standard',
  animation_profile text not null default 'standard',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (collection_id, public_number)
);

create table public.player_levels (
  level integer primary key check (level > 0),
  xp_required integer not null check (xp_required >= 0),
  reward jsonb not null default '{}'::jsonb
);

create table public.game_settings (
  id boolean primary key default true,
  pack_cooldown interval not null default interval '3 hours',
  cards_per_pack integer not null default 1 check (cards_per_pack > 0),
  duplicate_conversion public.duplicate_conversion_mode not null default 'xp',
  draw_mode public.draw_mode not null default 'strict_weights',
  pity_enabled boolean not null default false,
  maintenance_enabled boolean not null default false,
  announcement text,
  minimum_app_version text,
  updated_at timestamptz not null default now(),
  check (id)
);

create table public.draw_configurations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  draw_mode public.draw_mode not null default 'strict_weights',
  rarity_weights jsonb not null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.player_cards (
  player_id uuid not null references public.profiles(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  first_obtained_at timestamptz not null default now(),
  last_obtained_at timestamptz not null default now(),
  copies integer not null default 1 check (copies > 0),
  is_favorite boolean not null default false,
  primary key (player_id, card_id)
);

create table public.pack_openings (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.profiles(id) on delete cascade,
  idempotency_key text not null,
  opened_at timestamptz not null default now(),
  next_available_at timestamptz not null,
  level_before integer not null,
  level_after integer not null,
  xp_gained integer not null default 0,
  fragments_gained integer not null default 0,
  created_at timestamptz not null default now(),
  unique (player_id, idempotency_key)
);

create table public.pack_opening_items (
  id uuid primary key default gen_random_uuid(),
  opening_id uuid not null references public.pack_openings(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete restrict,
  rarity_id uuid not null references public.rarities(id) on delete restrict,
  is_duplicate boolean not null,
  xp_gained integer not null default 0,
  fragments_gained integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.profiles(id) on delete cascade,
  source text not null,
  amount integer not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.player_favorites (
  player_id uuid not null references public.profiles(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (player_id, card_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_cards_active_draw on public.cards (is_active, rarity_id, collection_id);
create index idx_pack_openings_player_opened on public.pack_openings (player_id, opened_at desc);
create index idx_pack_items_opening on public.pack_opening_items (opening_id);
create index idx_player_cards_player on public.player_cards (player_id);
create index idx_audit_actor_created on public.admin_audit_logs (actor_id, created_at desc);

create trigger storage_assets_updated before update on public.storage_assets for each row execute function public.set_updated_at();
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger invitations_updated before update on public.invitations for each row execute function public.set_updated_at();
create trigger collections_updated before update on public.collections for each row execute function public.set_updated_at();
create trigger characters_updated before update on public.characters for each row execute function public.set_updated_at();
create trigger rarities_updated before update on public.rarities for each row execute function public.set_updated_at();
create trigger cards_updated before update on public.cards for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.is_authorized_player()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.prevent_player_profile_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_setting('app.bypass_profile_guard', true) = 'on' then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  if auth.uid() <> old.id then
    raise exception 'not_authorized';
  end if;

  if new.status <> old.status
    or new.level <> old.level
    or new.total_xp <> old.total_xp
    or new.current_xp <> old.current_xp
    or new.next_level_xp <> old.next_level_xp
    or new.fragments <> old.fragments
    or new.last_pack_opened_at is distinct from old.last_pack_opened_at
    or new.next_pack_available_at is distinct from old.next_pack_available_at
  then
    raise exception 'protected_profile_fields';
  end if;

  return new;
end;
$$;

create trigger profiles_prevent_player_escalation
before update on public.profiles
for each row execute function public.prevent_player_profile_escalation();

create or replace function public.validate_invitation(invitation_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  invitation public.invitations;
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  select * into invitation
  from public.invitations
  where code = upper(trim(invitation_code))
  for update;

  if invitation.id is null then
    return jsonb_build_object('valid', false, 'reason', 'not_found');
  end if;

  if not invitation.is_active then
    return jsonb_build_object('valid', false, 'reason', 'inactive');
  end if;

  if invitation.expires_at is not null and invitation.expires_at <= now() then
    return jsonb_build_object('valid', false, 'reason', 'expired');
  end if;

  if invitation.used_count >= invitation.max_uses then
    return jsonb_build_object('valid', false, 'reason', 'used');
  end if;

  if invitation.email is not null and lower(invitation.email) <> current_email then
    return jsonb_build_object('valid', false, 'reason', 'email_mismatch');
  end if;

  return jsonb_build_object('valid', true);
end;
$$;

create or replace function public.complete_invited_profile(invitation_code text, desired_username text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  validation jsonb;
  profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  validation := public.validate_invitation(invitation_code);
  if coalesce((validation ->> 'valid')::boolean, false) is false then
    raise exception 'invalid_invitation:%', validation ->> 'reason';
  end if;

  insert into public.profiles (id, username)
  values (auth.uid(), desired_username)
  returning * into profile;

  insert into public.user_roles (user_id, role)
  values (auth.uid(), 'player')
  on conflict do nothing;

  update public.invitations
  set used_count = used_count + 1
  where code = upper(trim(invitation_code));

  return profile;
end;
$$;

create or replace function public.calculate_level(total_xp integer)
returns table(level integer, current_xp integer, next_level_xp integer)
language sql
stable
set search_path = public
as $$
  with chosen as (
    select pl.level, pl.xp_required
    from public.player_levels pl
    where pl.xp_required <= greatest(total_xp, 0)
    order by pl.level desc
    limit 1
  ),
  next_level as (
    select pl.xp_required
    from public.player_levels pl, chosen
    where pl.level = chosen.level + 1
    limit 1
  )
  select
    coalesce((select chosen.level from chosen), 1),
    greatest(total_xp - coalesce((select chosen.xp_required from chosen), 0), 0),
    greatest(coalesce((select next_level.xp_required from next_level), total_xp + 100) - total_xp, 1);
$$;

create or replace function public.pick_weighted_card(player uuid)
returns public.cards
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_rarity uuid;
  chosen_card public.cards;
begin
  with weighted as (
    select
      r.id as rarity_id,
      sum(r.default_weight) over (order by r.rank) as running_weight,
      sum(r.default_weight) over () as total_weight
    from public.rarities r
    where r.is_active
  ),
  ticket as (
    select random() * max(total_weight) as value from weighted
  )
  select weighted.rarity_id into chosen_rarity
  from weighted, ticket
  where weighted.running_weight >= ticket.value
  order by weighted.running_weight
  limit 1;

  select c.* into chosen_card
  from public.cards c
  join public.collections col on col.id = c.collection_id
  where c.is_active
    and c.rarity_id = chosen_rarity
    and col.is_active
    and (c.released_at is null or c.released_at <= now())
    and (c.ends_at is null or c.ends_at > now())
  order by -ln(greatest(random(), 0.000000001)) / c.draw_weight asc
  limit 1;

  if chosen_card.id is null then
    select c.* into chosen_card
    from public.cards c
    join public.collections col on col.id = c.collection_id
    where c.is_active
      and col.is_active
      and (c.released_at is null or c.released_at <= now())
      and (c.ends_at is null or c.ends_at > now())
    order by -ln(greatest(random(), 0.000000001)) / c.draw_weight asc
    limit 1;
  end if;

  if chosen_card.id is null then
    raise exception 'no_active_cards';
  end if;

  return chosen_card;
end;
$$;

create or replace function public.open_free_pack(idempotency_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_player_id uuid := auth.uid();
  profile_row public.profiles;
  existing_opening public.pack_openings;
  settings public.game_settings;
  selected_card public.cards;
  selected_rarity public.rarities;
  duplicate boolean;
  xp_gain integer := 0;
  fragment_gain integer := 0;
  new_total_xp integer;
  level_state record;
  opening_id uuid;
  next_available timestamptz;
  copies_after integer;
begin
  if current_player_id is null then
    raise exception 'not_authenticated';
  end if;

  select * into existing_opening
  from public.pack_openings po
  where po.player_id = current_player_id
    and po.idempotency_key = open_free_pack.idempotency_key;

  if existing_opening.id is not null then
    return (
      select jsonb_build_object(
        'openingId', existing_opening.id,
        'serverTime', now(),
        'nextPackAvailableAt', existing_opening.next_available_at,
        'idempotent', true
      )
    );
  end if;

  select * into profile_row
  from public.profiles
  where id = current_player_id
  for update;

  if profile_row.id is null or profile_row.status <> 'active' then
    raise exception 'not_authorized';
  end if;

  select * into settings from public.game_settings where id = true;
  if settings.maintenance_enabled then
    raise exception 'maintenance';
  end if;

  if profile_row.next_pack_available_at is not null and profile_row.next_pack_available_at > now() then
    raise exception 'pack_not_available:%', profile_row.next_pack_available_at;
  end if;

  selected_card := public.pick_weighted_card(current_player_id);
  select * into selected_rarity from public.rarities where id = selected_card.rarity_id;

  duplicate := exists (
    select 1 from public.player_cards
    where player_cards.player_id = current_player_id
      and card_id = selected_card.id
  );

  if duplicate then
    case settings.duplicate_conversion
      when 'xp' then xp_gain := selected_card.duplicate_value;
      when 'fragments' then fragment_gain := selected_card.duplicate_value;
      when 'xp_and_fragments' then
        xp_gain := floor(selected_card.duplicate_value / 2);
        fragment_gain := selected_card.duplicate_value - xp_gain;
    end case;
  else
    xp_gain := selected_card.xp_value;
  end if;

  insert into public.player_cards (player_id, card_id, copies)
  values (current_player_id, selected_card.id, 1)
  on conflict (player_id, card_id) do update
  set copies = public.player_cards.copies + 1,
      last_obtained_at = now()
  returning copies into copies_after;

  new_total_xp := profile_row.total_xp + xp_gain;
  select * into level_state from public.calculate_level(new_total_xp);
  next_available := now() + settings.pack_cooldown;

  insert into public.pack_openings (
    player_id,
    idempotency_key,
    next_available_at,
    level_before,
    level_after,
    xp_gained,
    fragments_gained
  )
  values (
    current_player_id,
    open_free_pack.idempotency_key,
    next_available,
    profile_row.level,
    level_state.level,
    xp_gain,
    fragment_gain
  )
  returning id into opening_id;

  insert into public.pack_opening_items (
    opening_id,
    card_id,
    rarity_id,
    is_duplicate,
    xp_gained,
    fragments_gained
  )
  values (
    opening_id,
    selected_card.id,
    selected_card.rarity_id,
    duplicate,
    xp_gain,
    fragment_gain
  );

  insert into public.xp_transactions (player_id, source, amount, metadata)
  values (
    current_player_id,
    'pack_opening',
    xp_gain,
    jsonb_build_object('openingId', opening_id, 'cardId', selected_card.id)
  );

  perform set_config('app.bypass_profile_guard', 'on', true);

  update public.profiles
  set
    last_pack_opened_at = now(),
    next_pack_available_at = next_available,
    total_xp = new_total_xp,
    current_xp = level_state.current_xp,
    next_level_xp = level_state.next_level_xp,
    level = level_state.level,
    fragments = fragments + fragment_gain
  where id = current_player_id;

  return jsonb_build_object(
    'openingId', opening_id,
    'serverTime', now(),
    'nextPackAvailableAt', next_available,
    'card', jsonb_build_object(
      'id', selected_card.id,
      'publicNumber', selected_card.public_number,
      'editionName', selected_card.edition_name,
      'description', selected_card.description,
      'xpValue', selected_card.xp_value,
      'duplicateValue', selected_card.duplicate_value
    ),
    'rarity', jsonb_build_object(
      'id', selected_rarity.id,
      'name', selected_rarity.name,
      'rank', selected_rarity.rank,
      'color', selected_rarity.color,
      'visualEffect', selected_rarity.visual_effect
    ),
    'isDuplicate', duplicate,
    'copies', copies_after,
    'xpGained', xp_gain,
    'fragmentsGained', fragment_gain,
    'levelBefore', profile_row.level,
    'levelAfter', level_state.level
  );
end;
$$;

create view public.collection_progress as
select
  p.id as player_id,
  c.id as collection_id,
  count(cards.id)::integer as total_cards,
  count(pc.card_id)::integer as owned_cards,
  case when count(cards.id) = 0 then 0 else round((count(pc.card_id)::numeric / count(cards.id)::numeric) * 100, 2) end as progress_percent
from public.profiles p
cross join public.collections c
left join public.cards cards on cards.collection_id = c.id and cards.is_active
left join public.player_cards pc on pc.player_id = p.id and pc.card_id = cards.id
group by p.id, c.id;

alter table public.storage_assets enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.invitations enable row level security;
alter table public.collections enable row level security;
alter table public.characters enable row level security;
alter table public.rarities enable row level security;
alter table public.cards enable row level security;
alter table public.player_levels enable row level security;
alter table public.game_settings enable row level security;
alter table public.draw_configurations enable row level security;
alter table public.player_cards enable row level security;
alter table public.pack_openings enable row level security;
alter table public.pack_opening_items enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.player_favorites enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "players read active assets" on public.storage_assets for select using (is_active and public.is_authorized_player() or public.is_admin());
create policy "admins manage assets" on public.storage_assets for all using (public.is_admin()) with check (public.is_admin());

create policy "players read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "players update safe own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "users read own roles" on public.user_roles for select using (user_id = auth.uid() or public.is_admin());
create policy "admins manage roles" on public.user_roles for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage invitations" on public.invitations for all using (public.is_admin()) with check (public.is_admin());

create policy "players read active collections" on public.collections for select using ((is_active and public.is_authorized_player()) or public.is_admin());
create policy "admins manage collections" on public.collections for all using (public.is_admin()) with check (public.is_admin());

create policy "players read active characters" on public.characters for select using ((is_active and public.is_authorized_player()) or public.is_admin());
create policy "admins manage characters" on public.characters for all using (public.is_admin()) with check (public.is_admin());

create policy "players read active rarities" on public.rarities for select using ((is_active and public.is_authorized_player()) or public.is_admin());
create policy "admins manage rarities" on public.rarities for all using (public.is_admin()) with check (public.is_admin());

create policy "players read active cards" on public.cards for select using ((is_active and public.is_authorized_player()) or public.is_admin());
create policy "admins manage cards" on public.cards for all using (public.is_admin()) with check (public.is_admin());

create policy "players read levels" on public.player_levels for select using (public.is_authorized_player() or public.is_admin());
create policy "admins manage levels" on public.player_levels for all using (public.is_admin()) with check (public.is_admin());

create policy "players read settings" on public.game_settings for select using (public.is_authorized_player() or public.is_admin());
create policy "admins manage settings" on public.game_settings for all using (public.is_admin()) with check (public.is_admin());

create policy "players read published draw config" on public.draw_configurations for select using ((is_published and public.is_authorized_player()) or public.is_admin());
create policy "admins manage draw config" on public.draw_configurations for all using (public.is_admin()) with check (public.is_admin());

create policy "players read own cards" on public.player_cards for select using (player_id = auth.uid() or public.is_admin());

create policy "players read own openings" on public.pack_openings for select using (player_id = auth.uid() or public.is_admin());
create policy "players read own opening items" on public.pack_opening_items for select using (
  exists (
    select 1 from public.pack_openings po
    where po.id = opening_id
      and (po.player_id = auth.uid() or public.is_admin())
  )
);

create policy "players read own xp" on public.xp_transactions for select using (player_id = auth.uid() or public.is_admin());

create policy "players manage own favorites" on public.player_favorites for all using (player_id = auth.uid()) with check (player_id = auth.uid());

create policy "players read own notifications" on public.notifications for select using (player_id = auth.uid() or public.is_admin());
create policy "players update own notifications" on public.notifications for update using (player_id = auth.uid()) with check (player_id = auth.uid());

create policy "admins read audit logs" on public.admin_audit_logs for select using (public.is_admin());
create policy "admins insert audit logs" on public.admin_audit_logs for insert with check (public.is_admin());

insert into public.game_settings (id) values (true);

insert into public.player_levels (level, xp_required) values
  (1, 0),
  (2, 100),
  (3, 260),
  (4, 520),
  (5, 900),
  (6, 1420),
  (7, 2100),
  (8, 2960),
  (9, 4020),
  (10, 5300);
