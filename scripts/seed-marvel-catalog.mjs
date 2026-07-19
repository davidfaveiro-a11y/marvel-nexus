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

const collections = [
  {
    name: "Avengers",
    description: "Les grands heros reunis quand la Terre a besoin d'une equipe.",
    primary_color: "#D71920",
    display_order: 10,
    characters: [
      "Iron Man",
      "Captain America",
      "Hulk",
      "Black Widow",
      "Hawkeye",
      "Scarlet Witch",
      "Vision",
      "Captain Marvel",
      "Ant-Man",
      "Wasp",
      "War Machine",
      "Falcon",
      "She-Hulk",
      "Quicksilver",
      "Wonder Man",
      "Hercules",
      "Black Knight",
      "Monica Rambeau",
      "Tigra",
      "Sersi",
    ],
  },
  {
    name: "X-Men",
    description: "Mutants, ecole secrete, pouvoirs extremes et combats pour l'avenir.",
    primary_color: "#FFE45C",
    display_order: 20,
    characters: [
      "Cyclops",
      "Jean Grey",
      "Wolverine",
      "Storm",
      "Beast",
      "Rogue",
      "Gambit",
      "Nightcrawler",
      "Iceman",
      "Colossus",
      "Professor X",
      "Kitty Pryde",
      "Psylocke",
      "Jubilee",
      "Cable",
      "Bishop",
      "Emma Frost",
      "Magik",
      "X-23",
      "Havok",
    ],
  },
  {
    name: "S.H.I.E.L.D.",
    description: "Espionnage, operations speciales et dossiers classes niveau rouge.",
    primary_color: "#2F80ED",
    display_order: 30,
    characters: [
      "Nick Fury",
      "Maria Hill",
      "Phil Coulson",
      "Daisy Johnson",
      "Mockingbird",
      "Dum Dum Dugan",
      "Sharon Carter",
      "Peggy Carter",
      "Jimmy Woo",
      "Abigail Brand",
      "Clay Quartermain",
      "Gabe Jones",
      "Jasper Sitwell",
      "Victoria Hand",
      "Melinda May",
      "Leo Fitz",
      "Jemma Simmons",
      "Deathlok",
      "Yo-Yo Rodriguez",
      "G.W. Bridge",
    ],
  },
  {
    name: "Midnight Suns",
    description: "Magie, demons, chasseurs de nuit et pouvoirs occultes.",
    primary_color: "#8B5CF6",
    display_order: 40,
    characters: [
      "Blade",
      "Ghost Rider",
      "Doctor Strange",
      "Wong",
      "Moon Knight",
      "Werewolf by Night",
      "Elsa Bloodstone",
      "Man-Thing",
      "Nico Minoru",
      "Morbius",
      "Clea",
      "Daimon Hellstrom",
      "Satana",
      "Jennifer Kale",
      "Agatha Harkness",
      "Brother Voodoo",
      "Sleepwalker",
      "Hannibal King",
      "Kushala",
      "Topaz",
    ],
  },
  {
    name: "Villains",
    description: "Les menaces iconiques, cerveaux criminels et empereurs du chaos.",
    primary_color: "#EC4899",
    display_order: 50,
    characters: [
      "Doctor Doom",
      "Thanos",
      "Loki",
      "Green Goblin",
      "Magneto",
      "Red Skull",
      "Ultron",
      "Kingpin",
      "Venom",
      "Carnage",
      "Mysterio",
      "Doctor Octopus",
      "Bullseye",
      "Sabretooth",
      "Apocalypse",
      "Mystique",
      "Kang",
      "Baron Zemo",
      "Taskmaster",
      "Hela",
    ],
  },
  {
    name: "Guardians",
    description: "Aventures cosmiques, equipes improbables et sauvetages galactiques.",
    primary_color: "#00D4FF",
    display_order: 60,
    characters: [
      "Star-Lord",
      "Gamora",
      "Drax",
      "Rocket Raccoon",
      "Groot",
      "Mantis",
      "Nebula",
      "Adam Warlock",
      "Cosmo",
      "Yondu",
      "Nova",
      "Phyla-Vell",
      "Moondragon",
      "Quasar",
      "Major Victory",
      "Bug",
      "Jack Flag",
      "Vance Astro",
      "Martinex",
      "Charlie-27",
    ],
  },
  {
    name: "Fantastic Four",
    description: "Famille, science impossible et exploration de l'inconnu.",
    primary_color: "#35C7F4",
    display_order: 70,
    characters: [
      "Mister Fantastic",
      "Invisible Woman",
      "Human Torch",
      "The Thing",
      "Franklin Richards",
      "Valeria Richards",
      "HERBIE",
      "Alicia Masters",
      "Willie Lumpkin",
      "Wyatt Wingfoot",
      "Lyja",
      "Nathaniel Richards",
      "Bentley-23",
      "Artie Maddicks",
      "Leech",
      "Dragon Man",
      "Alex Power",
      "Julie Power",
      "Katie Power",
      "Jack Power",
    ],
  },
  {
    name: "Spider-Verse",
    description: "Toiles, responsabilite, variants arachnides et ennemis cultes.",
    primary_color: "#F43F5E",
    display_order: 80,
    characters: [
      "Spider-Man",
      "Miles Morales",
      "Spider-Gwen",
      "Spider-Woman",
      "Silk",
      "Spider-Man 2099",
      "Spider-Ham",
      "Madame Web",
      "Black Cat",
      "Mary Jane Watson",
      "Aunt May",
      "J. Jonah Jameson",
      "Spider-Man Noir",
      "Spider-Punk",
      "Peni Parker",
      "Anya Corazon",
      "Kaine Parker",
      "Ben Reilly",
      "Kraven the Hunter",
      "Vulture",
    ],
  },
  {
    name: "Wakanda",
    description: "Vibranium, royautes, guerrieres et technologie avancee.",
    primary_color: "#34D399",
    display_order: 90,
    characters: [
      "Black Panther",
      "Shuri",
      "Okoye",
      "Nakia",
      "M'Baku",
      "Ramonda",
      "Killmonger",
      "Klaw",
      "Ayo",
      "Aneka",
      "T'Chaka",
      "Bast",
      "White Wolf",
      "Manifold",
      "Gentle",
      "Midnight Angel",
      "Zawavari",
      "Queen Divine Justice",
      "W'Kabi",
      "Tosin Oduye",
    ],
  },
  {
    name: "Asgard",
    description: "Dieux, royaumes mythiques, marteaux et guerres cosmiques.",
    primary_color: "#F5B849",
    display_order: 100,
    characters: [
      "Thor",
      "Odin",
      "Frigga",
      "Sif",
      "Valkyrie",
      "Heimdall",
      "Balder",
      "Beta Ray Bill",
      "Jane Foster",
      "Angela",
      "Enchantress",
      "Skurge",
      "Surtur",
      "Malekith",
      "Karnilla",
      "Tyr",
      "Gorr",
      "Bor Burison",
      "Cul Borson",
      "Thunderstrike",
    ],
  },
  {
    name: "Street Heroes",
    description: "Quartiers sombres, justice de rue et combats au corps a corps.",
    primary_color: "#FF7A18",
    display_order: 110,
    characters: [
      "Daredevil",
      "Jessica Jones",
      "Luke Cage",
      "Iron Fist",
      "Punisher",
      "Misty Knight",
      "Colleen Wing",
      "Shang-Chi",
      "Cloak",
      "Dagger",
      "Typhoid Mary",
      "Echo",
      "White Tiger",
      "Hellcat",
      "Silver Sable",
      "Paladin",
      "Night Nurse",
      "Dakota North",
      "Blindspot",
      "Stick",
    ],
  },
  {
    name: "Thunderbolts",
    description: "Anti-heros, missions sales et redemption sous pression.",
    primary_color: "#647086",
    display_order: 120,
    characters: [
      "Winter Soldier",
      "Yelena Belova",
      "Red Guardian",
      "U.S. Agent",
      "Ghost",
      "Songbird",
      "Moonstone",
      "Atlas",
      "Fixer",
      "Mach-X",
      "Jolt",
      "Sentry",
      "Abomination",
      "Crossbones",
      "Deadpool",
      "Elektra",
      "Valentina Allegra de Fontaine",
      "Radioactive Man",
      "Blizzard",
      "Swordsman",
    ],
  },
];

const rarityCycle = [1, 1, 2, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 5, 1, 2, 3, 4, 5, 6];
const editionTitles = [
  "Premiere Apparition",
  "Portrait Heroique",
  "Variant Rouge",
  "Case d'Action",
  "Coup de Tonnerre",
  "Edition Foil",
  "Planche de Combat",
  "Moment Iconique",
  "Pouvoir Dechaine",
  "Couverture Collector",
  "Alliance Improbable",
  "Mission Secrete",
  "Retour Triomphal",
  "Edition Mythique",
  "En Pleine Lumiere",
  "Duel Decisif",
  "Costume Classique",
  "Variant Premium",
  "Legende Vivante",
  "Archive Exclusive",
];

async function ensureCollections() {
  const existing = await admin.from("collections").select("id,name,display_order");
  if (existing.error) throw existing.error;

  const byDisplayOrder = new Map(existing.data.map((item) => [item.display_order, item]));

  for (const collection of collections) {
    const current = byDisplayOrder.get(collection.display_order);
    const payload = {
      description: collection.description,
      display_order: collection.display_order,
      is_active: true,
      name: collection.name,
      primary_color: collection.primary_color,
    };

    if (current) {
      const updated = await admin.from("collections").update(payload).eq("id", current.id);
      if (updated.error) throw updated.error;
    } else {
      const inserted = await admin.from("collections").insert(payload);
      if (inserted.error) throw inserted.error;
    }
  }
}

async function ensureCharacter(name, affiliation) {
  const existing = await admin
    .from("characters")
    .select("id")
    .eq("name", name)
    .limit(1)
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data?.id) {
    const updated = await admin
      .from("characters")
      .update({
        affiliation,
        alias: name,
        description: `${name}, personnage Marvel associe a ${affiliation}.`,
        is_active: true,
      })
      .eq("id", existing.data.id);
    if (updated.error) throw updated.error;
    return existing.data.id;
  }

  const inserted = await admin
    .from("characters")
    .insert({
      affiliation,
      alias: name,
      description: `${name}, personnage Marvel associe a ${affiliation}.`,
      is_active: true,
      name,
    })
    .select("id")
    .single();
  if (inserted.error) throw inserted.error;
  return inserted.data.id;
}

await ensureCollections();

const [collectionsResult, raritiesResult] = await Promise.all([
  admin
    .from("collections")
    .select("id,name,display_order")
    .in(
      "display_order",
      collections.map((collection) => collection.display_order),
    ),
  admin.from("rarities").select("id,rank,default_xp,duplicate_value,default_weight"),
]);

if (collectionsResult.error) throw collectionsResult.error;
if (raritiesResult.error) throw raritiesResult.error;

const collectionsByOrder = new Map(
  collectionsResult.data.map((collection) => [collection.display_order, collection]),
);
const raritiesByRank = new Map(raritiesResult.data.map((rarity) => [rarity.rank, rarity]));

let changedCards = 0;
let changedCharacters = 0;

for (const collection of collections) {
  const dbCollection = collectionsByOrder.get(collection.display_order);
  if (!dbCollection) throw new Error(`Missing collection ${collection.name}`);

  const disabledOverflow = await admin
    .from("cards")
    .update({ is_active: false })
    .eq("collection_id", dbCollection.id)
    .gt("public_number", collection.characters.length);
  if (disabledOverflow.error) throw disabledOverflow.error;

  for (const [index, characterName] of collection.characters.entries()) {
    const publicNumber = index + 1;
    const characterId = await ensureCharacter(characterName, collection.name);
    changedCharacters += 1;

    const rarity = raritiesByRank.get(rarityCycle[index]);
    if (!rarity) throw new Error(`Missing rarity rank ${rarityCycle[index]}`);

    const payload = {
      animation_profile: rarity.rank >= 5 ? "marvel-burst" : "comic-snap",
      character_id: characterId,
      collection_id: dbCollection.id,
      description: `${characterName} rejoint la collection ${collection.name}. Carte ${editionTitles[index].toLowerCase()} pour l'album prive.`,
      display_order: publicNumber,
      draw_weight: rarity.default_weight,
      duplicate_value: rarity.duplicate_value,
      edition_name: `${characterName}: ${editionTitles[index]}`,
      frame_style: rarity.rank >= 4 ? "marvel-cover" : "comic-panel",
      is_active: true,
      public_number: publicNumber,
      rarity_id: rarity.id,
      xp_value: rarity.default_xp,
    };

    const existingCard = await admin
      .from("cards")
      .select("id")
      .eq("collection_id", dbCollection.id)
      .eq("public_number", publicNumber)
      .maybeSingle();
    if (existingCard.error) throw existingCard.error;

    if (existingCard.data?.id) {
      const updated = await admin.from("cards").update(payload).eq("id", existingCard.data.id);
      if (updated.error) throw updated.error;
    } else {
      const inserted = await admin.from("cards").insert(payload);
      if (inserted.error) throw inserted.error;
    }
    changedCards += 1;
  }
}

const [collectionCount, cardCount] = await Promise.all([
  admin.from("collections").select("id", { count: "exact", head: true }).eq("is_active", true),
  admin.from("cards").select("id", { count: "exact", head: true }).eq("is_active", true),
]);

if (collectionCount.error) throw collectionCount.error;
if (cardCount.error) throw cardCount.error;

console.log(
  JSON.stringify({
    activeCollections: collectionCount.count,
    activeCards: cardCount.count,
    changedCards,
    touchedCharacters: changedCharacters,
  }),
);
