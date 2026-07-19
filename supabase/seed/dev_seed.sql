insert into public.rarities (name, rank, color, border_style, visual_effect, reveal_animation, default_xp, duplicate_value, default_weight) values
  ('Commune', 1, '#D8DEE9', 'solid', 'none', 'standard', 5, 2, 55),
  ('Rare', 2, '#38BDF8', 'glow', 'foil', 'blue-flare', 15, 6, 25),
  ('Epique', 3, '#A78BFA', 'glow', 'pulse', 'violet-flare', 40, 16, 12),
  ('Legendaire', 4, '#F59E0B', 'radiant', 'cosmic', 'gold-burst', 100, 40, 6),
  ('Mythique', 5, '#EC4899', 'radiant', 'cosmic', 'mythic-burst', 250, 100, 1.8),
  ('Exclusive', 6, '#F8FAFC', 'prismatic', 'exclusive', 'prismatic-burst', 500, 200, 0.2)
on conflict (name) do nothing;

insert into public.collections (name, description, primary_color, display_order) values
  ('Nexus Core', 'Collection neutre de developpement.', '#38BDF8', 10),
  ('Metro Legends', 'Cartes fictives pour tester les raretes.', '#8B5CF6', 20),
  ('Signal Rift', 'Collection temporaire sans assets officiels.', '#34D399', 30)
on conflict do nothing;

insert into public.characters (name, alias, description, affiliation) values
  ('Astra Vale', 'Signal', 'Heroine fictive creee pour les tests.', 'Nexus'),
  ('Noah Forge', 'Anvil', 'Inventeur fictif oriente defense.', 'Nexus'),
  ('Mira Quill', 'Arc Light', 'Exploratrice fictive du multivers.', 'Rift'),
  ('Eden Cross', 'Pulse', 'Strategiste fictive.', 'Metro'),
  ('Ilan Voss', 'Vector', 'Pilote fictif.', 'Rift'),
  ('Sora Night', 'Shade', 'Espionne fictive.', 'Metro'),
  ('Kael Orion', 'Nova Kid', 'Jeune prodige fictif.', 'Nexus'),
  ('Lena Frost', 'North', 'Protectrice fictive.', 'Metro')
on conflict do nothing;

with combos as (
  select
    row_number() over (order by ch.name, co.name) as public_number,
    ch.id as character_id,
    co.id as collection_id,
    ch.name,
    co.name as collection_name
  from public.characters ch
  cross join lateral (
    select * from public.collections order by display_order limit 3
  ) co
  limit 20
),
numbered as (
  select
    combos.public_number,
    combos.character_id,
    combos.collection_id,
    r.id as rarity_id,
    combos.name,
    combos.collection_name,
    r.default_xp,
    r.duplicate_value,
    r.default_weight
  from combos
  join public.rarities r on r.rank = ((combos.public_number - 1) % 6) + 1
)
insert into public.cards (
  public_number,
  character_id,
  collection_id,
  rarity_id,
  edition_name,
  description,
  xp_value,
  duplicate_value,
  draw_weight,
  frame_style,
  animation_profile,
  display_order
)
select
  public_number,
  character_id,
  collection_id,
  rarity_id,
  collection_name || ' Edition',
  'Carte neutre de demonstration pour ' || name || '.',
  default_xp,
  duplicate_value,
  default_weight,
  'standard',
  'standard',
  public_number
from numbered
on conflict (collection_id, public_number) do nothing;
