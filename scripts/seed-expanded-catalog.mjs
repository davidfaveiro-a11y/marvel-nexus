import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const envRaw = await readFile(new URL("../.env", import.meta.url), "utf8");
const env = Object.fromEntries(
  envRaw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase URL or service role key in .env");
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const collectionSeed = [
  {
    name: "Nexus Core",
    description: "Archives centrales du Nexus.",
    primary_color: "#35C7F4",
    display_order: 10,
  },
  {
    name: "Metro Legends",
    description: "Figures urbaines fictives, nocturnes et stylisees.",
    primary_color: "#8B5CF6",
    display_order: 20,
  },
  {
    name: "Signal Rift",
    description: "Cartes issues de failles de transmission fictives.",
    primary_color: "#34D399",
    display_order: 30,
  },
  {
    name: "Obsidian Protocol",
    description: "Escouades tactiques et armures experimentales.",
    primary_color: "#D9E2EF",
    display_order: 40,
  },
  {
    name: "Astral Foundry",
    description: "Inventeurs stellaires, reliques et machines rares.",
    primary_color: "#F5B849",
    display_order: 50,
  },
  {
    name: "Neon District",
    description: "Duelistes, messagers et silhouettes de ville haute.",
    primary_color: "#EC4899",
    display_order: 60,
  },
  {
    name: "Void Horizon",
    description: "Explorateurs du vide et signaux perdus.",
    primary_color: "#647086",
    display_order: 70,
  },
  {
    name: "Titan Relay",
    description: "Defenseurs lourds et pilotes de relais orbital.",
    primary_color: "#2F80ED",
    display_order: 80,
  },
  {
    name: "Eclipse Court",
    description: "Strateges, emissaires et cartes de prestige.",
    primary_color: "#A78BFA",
    display_order: 90,
  },
  {
    name: "Prism Archive",
    description: "Variantes rares et dossiers de collection.",
    primary_color: "#F8FAFC",
    display_order: 100,
  },
];

const characterSeed = [
  ["Astra Vale", "Signal", "Heroine fictive creee pour les tests.", "Nexus"],
  ["Noah Forge", "Anvil", "Inventeur fictif oriente defense.", "Nexus"],
  ["Mira Quill", "Arc Light", "Exploratrice fictive du multivers.", "Rift"],
  ["Eden Cross", "Pulse", "Strategiste fictive.", "Metro"],
  ["Ilan Voss", "Vector", "Pilote fictif.", "Rift"],
  ["Sora Night", "Shade", "Espionne fictive.", "Metro"],
  ["Kael Orion", "Nova Kid", "Jeune prodige fictif.", "Nexus"],
  ["Lena Frost", "North", "Protectrice fictive.", "Metro"],
  ["Vera Sol", "Helix", "Analyste tactique fictive.", "Foundry"],
  ["Dax Riven", "Relay", "Coursier orbital fictif.", "Titan"],
  ["Nyx Arden", "Blackout", "Dueliste nocturne fictive.", "Neon"],
  ["Oren Vale", "Keystone", "Gardien de protocole fictif.", "Obsidian"],
  ["Talia Voss", "Mirage", "Infiltratrice fictive.", "Eclipse"],
  ["Rune Calder", "Prism", "Archiviste fictif.", "Archive"],
  ["Mae Ion", "Spark", "Ingenieure de signaux fictive.", "Nexus"],
  ["Cass Nova", "Drift", "Navigatrice de faille fictive.", "Void"],
  ["Juno Wraith", "Echo", "Oracle radio fictive.", "Rift"],
  ["Rhett Cain", "Bulwark", "Defenseur lourd fictif.", "Titan"],
];

const editionPrefixes = [
  "Prime",
  "Nocturne",
  "Holo",
  "Vault",
  "Pulse",
  "Aegis",
  "Cipher",
  "Radiant",
  "Shadow",
  "Zenith",
  "Vector",
  "Signal",
  "Chrome",
  "Flux",
  "Apex",
  "Echo",
  "Cobalt",
  "Ion",
  "Nova",
  "Crown",
  "Phantom",
  "Orbit",
  "Vanguard",
  "Relic",
];

function rarityRankForCard(index) {
  const cycle = [1, 1, 1, 2, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 1, 5, 2, 3, 4, 1, 2, 3, 4, 6];
  return cycle[index % cycle.length];
}

async function ensureCollections() {
  const existing = await admin.from("collections").select("id,name");
  if (existing.error) throw existing.error;
  const existingNames = new Set(existing.data.map((item) => item.name));
  const missing = collectionSeed.filter((item) => !existingNames.has(item.name));
  if (missing.length > 0) {
    const inserted = await admin.from("collections").insert(missing);
    if (inserted.error) throw inserted.error;
  }
}

async function ensureCharacters() {
  const existing = await admin.from("characters").select("id,name");
  if (existing.error) throw existing.error;
  const existingNames = new Set(existing.data.map((item) => item.name));
  const missing = characterSeed
    .filter(([name]) => !existingNames.has(name))
    .map(([name, alias, description, affiliation]) => ({ name, alias, description, affiliation }));
  if (missing.length > 0) {
    const inserted = await admin.from("characters").insert(missing);
    if (inserted.error) throw inserted.error;
  }
}

await ensureCollections();
await ensureCharacters();

const [collectionsResult, charactersResult, raritiesResult] = await Promise.all([
  admin
    .from("collections")
    .select("id,name,display_order")
    .in(
      "name",
      collectionSeed.map((collection) => collection.name),
    )
    .order("display_order", { ascending: true }),
  admin
    .from("characters")
    .select("id,name")
    .in(
      "name",
      characterSeed.map(([name]) => name),
    )
    .order("name", { ascending: true }),
  admin.from("rarities").select("id,rank,name,default_xp,duplicate_value,default_weight"),
]);

if (collectionsResult.error) throw collectionsResult.error;
if (charactersResult.error) throw charactersResult.error;
if (raritiesResult.error) throw raritiesResult.error;

const raritiesByRank = new Map(raritiesResult.data.map((rarity) => [rarity.rank, rarity]));
const characters = charactersResult.data;
const cards = [];

for (const [collectionIndex, collection] of collectionsResult.data.entries()) {
  for (let index = 0; index < 24; index += 1) {
    const character = characters[(collectionIndex * 5 + index) % characters.length];
    const rarity = raritiesByRank.get(rarityRankForCard(index));
    if (!rarity) throw new Error(`Missing rarity for generated card ${index + 1}`);

    cards.push({
      public_number: index + 1,
      character_id: character.id,
      collection_id: collection.id,
      rarity_id: rarity.id,
      edition_name: `${editionPrefixes[index]} ${character.name}`,
      description: `${collection.name}: dossier fictif ${editionPrefixes[index].toLowerCase()} pour ${character.name}.`,
      xp_value: rarity.default_xp,
      duplicate_value: rarity.duplicate_value,
      draw_weight: rarity.default_weight,
      frame_style: rarity.rank >= 4 ? "premium" : rarity.rank >= 3 ? "foil" : "standard",
      animation_profile: rarity.rank >= 5 ? "mythic" : rarity.rank >= 3 ? "flare" : "standard",
      display_order: index + 1,
      is_active: true,
    });
  }
}

const result = await admin.from("cards").upsert(cards, {
  ignoreDuplicates: true,
  onConflict: "collection_id,public_number",
});
if (result.error) throw result.error;

const [cardCount, collectionCount, characterCount] = await Promise.all([
  admin.from("cards").select("id", { count: "exact", head: true }),
  admin.from("collections").select("id", { count: "exact", head: true }).eq("is_active", true),
  admin.from("characters").select("id", { count: "exact", head: true }).eq("is_active", true),
]);

if (cardCount.error) throw cardCount.error;
if (collectionCount.error) throw collectionCount.error;
if (characterCount.error) throw characterCount.error;

console.log(
  JSON.stringify({
    activeCollections: collectionCount.count,
    activeCharacters: characterCount.count,
    totalCards: cardCount.count,
    generatedCardCandidates: cards.length,
  }),
);
