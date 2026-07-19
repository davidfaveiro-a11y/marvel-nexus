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

const collectionByOrder = new Map([
  [
    10,
    {
      name: "Brigade Rouge",
      description: "Les cartes de depart: capes, coups d'eclat et premieres victoires.",
      primary_color: "#D71920",
    },
  ],
  [
    20,
    {
      name: "Quartier Neon",
      description: "Ruelles electriques, justiciers de nuit et poursuites sur les toits.",
      primary_color: "#EC4899",
    },
  ],
  [
    30,
    {
      name: "Portail Cosmique",
      description: "Failles spatiales, rayons stellaires et menaces venues d'ailleurs.",
      primary_color: "#00D4FF",
    },
  ],
  [
    40,
    {
      name: "Armures Titan",
      description: "Exosquelettes, boucliers lourds et machines de combat.",
      primary_color: "#2F80ED",
    },
  ],
  [
    50,
    {
      name: "Forge Stellaire",
      description: "Gadgets impossibles, reliques brillantes et ateliers secrets.",
      primary_color: "#F5B849",
    },
  ],
  [
    60,
    {
      name: "Masques de Minuit",
      description: "Espions, illusions, silhouettes et missions sans lumiere.",
      primary_color: "#8B5CF6",
    },
  ],
  [
    70,
    {
      name: "Horizon Gamma",
      description: "Pouvoirs instables, energie verte et transformations spectaculaires.",
      primary_color: "#34D399",
    },
  ],
  [
    80,
    {
      name: "Relais Orbital",
      description: "Pilotes, stations geantes et sauvetages au bord du vide.",
      primary_color: "#FF7A18",
    },
  ],
  [
    90,
    {
      name: "Cour Eclipse",
      description: "Rivaux nobles, pactes dangereux et cartes de prestige.",
      primary_color: "#A78BFA",
    },
  ],
  [
    100,
    {
      name: "Archives Prisme",
      description: "Variantes collector, dossiers secrets et editions tres rares.",
      primary_color: "#F8FAFC",
    },
  ],
]);

const characterUpdates = [
  [
    "Astra Vale",
    "Nina Volt",
    "Volt Rouge",
    "Sprinteuse electrique, premiere a foncer quand la ville tremble.",
    "Brigade Rouge",
  ],
  [
    "Noah Forge",
    "Leo Forge",
    "Marteau",
    "Ingenieur de terrain, il transforme la ferraille en miracle.",
    "Forge Stellaire",
  ],
  [
    "Mira Quill",
    "Maya Comete",
    "Comete",
    "Exploratrice cosmique, toujours une etoile d'avance.",
    "Portail Cosmique",
  ],
  [
    "Eden Cross",
    "Eden Flash",
    "Flashpoint",
    "Tacticienne rapide, reine du plan improvise.",
    "Quartier Neon",
  ],
  [
    "Ilan Voss",
    "Ilan Vector",
    "Vector",
    "Pilote casse-cou, specialiste des trajectoires impossibles.",
    "Relais Orbital",
  ],
  [
    "Sora Night",
    "Sora Shade",
    "Nocturne",
    "Infiltratrice de minuit, elle frappe avant le projecteur.",
    "Masques de Minuit",
  ],
  [
    "Kael Orion",
    "Kael Nova",
    "Nova Kid",
    "Jeune prodige, coeur lumineux et reflexes de champion.",
    "Brigade Rouge",
  ],
  [
    "Lena Frost",
    "Lena Nord",
    "Nord",
    "Protectrice calme, bouclier leve quand tout s'effondre.",
    "Armures Titan",
  ],
  [
    "Vera Sol",
    "Vera Helix",
    "Helix",
    "Scientifique solaire, brillante jusque dans le chaos.",
    "Forge Stellaire",
  ],
  [
    "Dax Riven",
    "Dax Relay",
    "Relais",
    "Messager orbital, livre l'espoir a pleine vitesse.",
    "Relais Orbital",
  ],
  [
    "Nyx Arden",
    "Nyx Eclipse",
    "Eclipse",
    "Dueliste elegante, moitie lumiere, moitie menace.",
    "Cour Eclipse",
  ],
  [
    "Oren Vale",
    "Oren Titan",
    "Titan Bleu",
    "Pilier blinde de l'equipe, impossible a faire reculer.",
    "Armures Titan",
  ],
  [
    "Talia Voss",
    "Talia Mirage",
    "Mirage",
    "Illusionniste precise, elle gagne avant qu'on la voie.",
    "Masques de Minuit",
  ],
  [
    "Rune Calder",
    "Rune Prism",
    "Prisme",
    "Archiviste des variantes, gardien des editions impossibles.",
    "Archives Prisme",
  ],
  [
    "Mae Ion",
    "Mae Spark",
    "Etincelle",
    "Bricoleuse d'energie, sourire vif et mains dangereuses.",
    "Quartier Neon",
  ],
  [
    "Cass Nova",
    "Cass Drift",
    "Derive",
    "Navigateur de faille, il trouve des routes dans le vide.",
    "Portail Cosmique",
  ],
  [
    "Juno Wraith",
    "Juno Echo",
    "Echo",
    "Radio-oracle, capte les appels que personne n'entend.",
    "Horizon Gamma",
  ],
  [
    "Rhett Cain",
    "Rhett Rempart",
    "Rempart",
    "Defenseur massif, dernier mur avant la catastrophe.",
    "Horizon Gamma",
  ],
];

const cardTitles = [
  "Premiere Couverture",
  "Entree Fracassante",
  "La Pose Heroique",
  "Alerte en Ville",
  "Coup de Theatre",
  "Face au Danger",
  "Planche Double",
  "Sauvetage Minute",
  "Rayon Pleine Puissance",
  "Duel sur les Toits",
  "Replique Culte",
  "Le Grand Saut",
  "Masque Arrache",
  "Course au Portail",
  "Impact Rouge",
  "Edition Foil",
  "Nuit de Patrouille",
  "Appel du QG",
  "Rage Gamma",
  "Derniere Case",
  "Variant Neon",
  "Choc Cosmique",
  "Cliffhanger",
  "Couverture Collector",
];

for (const [oldName, name, alias, description, affiliation] of characterUpdates) {
  const { error } = await admin
    .from("characters")
    .update({ affiliation, alias, description, name })
    .eq("name", oldName);
  if (error) throw error;
}

const collections = await admin
  .from("collections")
  .select("id,name,display_order")
  .in("display_order", [...collectionByOrder.keys()]);
if (collections.error) throw collections.error;

for (const collection of collections.data) {
  const next = collectionByOrder.get(collection.display_order);
  if (!next) continue;
  const { error } = await admin.from("collections").update(next).eq("id", collection.id);
  if (error) throw error;
}

const [freshCollections, cardsResult, charactersResult] = await Promise.all([
  admin
    .from("collections")
    .select("id,name,display_order")
    .in("display_order", [...collectionByOrder.keys()]),
  admin.from("cards").select("id,public_number,collection_id,character_id,rarities(name,rank)"),
  admin.from("characters").select("id,name,alias"),
]);

if (freshCollections.error) throw freshCollections.error;
if (cardsResult.error) throw cardsResult.error;
if (charactersResult.error) throw charactersResult.error;

const collectionById = new Map(
  freshCollections.data.map((collection) => [collection.id, collection]),
);
const characterById = new Map(charactersResult.data.map((character) => [character.id, character]));

const cardUpdates = cardsResult.data.map((card) => {
  const collection = collectionById.get(card.collection_id);
  const character = characterById.get(card.character_id);
  const title = cardTitles[(card.public_number - 1) % cardTitles.length];
  const rarity = Array.isArray(card.rarities) ? card.rarities[0] : card.rarities;
  const heroName = character?.alias ?? character?.name ?? "Heros";
  const collectionName = collection?.name ?? "Serie";
  const rareLine =
    (rarity?.rank ?? 1) >= 5
      ? "Une carte qui doit briller au milieu de l'album."
      : (rarity?.rank ?? 1) >= 3
        ? "Un moment fort, taille pour les grandes pages."
        : "Une carte vive, simple et efficace.";

  return {
    id: card.id,
    animation_profile: (rarity?.rank ?? 1) >= 5 ? "comic-burst" : "panel-pop",
    description: `${collectionName}. ${heroName} entre en scene: ${title.toLowerCase()}. ${rareLine}`,
    edition_name: `${heroName}: ${title}`,
    frame_style: (rarity?.rank ?? 1) >= 4 ? "cover-premium" : "comic-panel",
  };
});

for (const card of cardUpdates) {
  const { id, ...payload } = card;
  const { error } = await admin.from("cards").update(payload).eq("id", id);
  if (error) throw error;
}

console.log(
  JSON.stringify({
    polishedCollections: freshCollections.data.length,
    polishedCards: cardUpdates.length,
  }),
);
