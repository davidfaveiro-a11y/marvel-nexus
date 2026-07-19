import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const HERO_API_URL = "https://akabab.github.io/superhero-api/api/all.json";
const MARVEL_CHARACTER_BASE_URL = "https://www.marvel.com/characters";
const MARVEL_FANDOM_API_URL = "https://marvel.fandom.com/api.php";
const dryRun = process.env.DRY_RUN === "true";
const useManualMarvelFallback = process.env.USE_MANUAL_MARVEL_FALLBACK === "true";
const useMarvelPageFallback = process.env.USE_MARVEL_PAGE_FALLBACK !== "false";
const useFandomFallback = process.env.USE_FANDOM_FALLBACK !== "false";

const aliasByCharacter = new Map(
  Object.entries({
    "Agent 13": "Sharon Carter",
    "Ant-Man": "Ant-Man II",
    "Aunt May": "Aunt May",
    "Black Knight": "Black Knight III",
    "Black Panther": "Black Panther",
    "Black Widow": "Black Widow",
    "Captain America": "Captain America",
    "Captain Marvel": "Binary",
    "Doctor Octopus": "Doctor Octopus",
    "Doctor Strange": "Doctor Strange",
    "Green Goblin": "Green Goblin",
    "Human Torch": "Human Torch",
    "Invisible Woman": "Invisible Woman",
    "Iron Man": "Iron Man",
    "J. Jonah Jameson": "J. Jonah Jameson",
    "Jean Grey": "Jean Grey",
    "Kraven the Hunter": "Kraven II",
    "Luke Cage": "Power Man",
    "Mister Fantastic": "Mister Fantastic",
    "Moon Knight": "Moon Knight",
    "Ms. Marvel": "Ms Marvel II",
    "Professor X": "Professor X",
    "Scarlet Witch": "Scarlet Witch",
    "Spider-Gwen": "Spider-Gwen",
    "Spider-Man": "Spider-Man",
    "Spider-Man 2099": "Spider-Man 2099",
    "The Thing": "Thing",
    "U.S. Agent": "Agent Zero",
    "War Machine": "War Machine",
    Wasp: "Wasp",
    "White Tiger": "White Tiger",
    "Winter Soldier": "Winter Soldier",
    "X-23": "X-23",
  }),
);

const marvelSlugByCharacter = new Map(
  Object.entries({
    "Agent 13": "sharon-carter",
    "Aunt May": "may-parker",
    "Baron Zemo": "baron-zemo-helmut-zemo",
    "Ben Reilly": "scarlet-spider-ben-reilly",
    "Brother Voodoo": "doctor-voodoo-jericho-drumm",
    "Daisy Johnson": "quake-daisy-johnson",
    Drax: "drax",
    Echo: "echo-maya-lopez",
    HERBIE: "h-e-r-b-i-e",
    "J. Jonah Jameson": "j-jonah-jameson",
    Killmonger: "erik-killmonger",
    Magik: "magik-illyana-rasputin",
    "M'Baku": "mbaku",
    "Miles Morales": "spider-man-miles-morales",
    "Nico Minoru": "sister-grimm-nico-minoru",
    "Radioactive Man": "radioactive-man-chen-lu",
    "Red Guardian": "red-guardian-alexei-shostakov",
    "Spider-Punk": "spider-punk-hobie-brown",
    "Spider-Gwen": "ghost-spider-gwen-stacy",
    "Spider-Ham": "spider-ham-peter-porker",
    "Spider-Man 2099": "spider-man-2099-miguel-ohara",
    Swordsman: "swordsman-jacques-duquesne",
    "U.S. Agent": "u-s-agent-john-walker",
    "White Wolf": "white-wolf",
    "Yo-Yo Rodriguez": "yo-yo-rodriguez",
  }),
);

const generatedImageByCharacter = new Map(
  Object.entries({
    "Abigail Brand":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/6/90/4c003f5e5e81f/portrait_uncanny.jpg",
    "Adam Warlock":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/a/f0/5202887448860/portrait_uncanny.jpg",
    "Agatha Harkness":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/9/30/4c003a7efda23/portrait_uncanny.jpg",
    Annihilus: "https://cdn.marvel.com/u/prod/marvel/i/mg/9/90/4c002e98ee2e7/portrait_uncanny.jpg",
    Apocalypse: "https://cdn.marvel.com/u/prod/marvel/i/mg/f/e0/52695835cdd21/portrait_uncanny.jpg",
    "Baron Zemo":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/9/60/4c003a3b5f3bc/portrait_uncanny.jpg",
    "Beta Ray Bill":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/9/60/4c0035e9234fe/portrait_uncanny.jpg",
    Bishop: "https://cdn.marvel.com/u/prod/marvel/i/mg/2/70/52602f4b42d98/portrait_uncanny.jpg",
    "Black Bolt":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/5/a0/4c0035a5aeffa/portrait_uncanny.jpg",
    Blade: "https://cdn.marvel.com/u/prod/marvel/i/mg/3/40/4c0033fbbdb54/portrait_uncanny.jpg",
    Cable: "https://cdn.marvel.com/u/prod/marvel/i/mg/3/20/526167a5e0b64/portrait_uncanny.jpg",
    Carnage: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/70/526031eab35ef/portrait_uncanny.jpg",
    Clea: "https://cdn.marvel.com/u/prod/marvel/i/mg/5/e0/4c003f8884508/portrait_uncanny.jpg",
    Colossus: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/40/526958dad214d/portrait_uncanny.jpg",
    Cyclops: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/70/526547e2d90ad/portrait_uncanny.jpg",
    Daredevil: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/50/5269549f0c7b0/portrait_uncanny.jpg",
    Drax: "https://cdn.marvel.com/u/prod/marvel/i/mg/3/20/52740f7c3c9e5/portrait_uncanny.jpg",
    Electro: "https://cdn.marvel.com/u/prod/marvel/i/mg/5/60/4c003f1214bd7/portrait_uncanny.jpg",
    Elektra: "https://cdn.marvel.com/u/prod/marvel/i/mg/8/d0/51114fec4a2c8/portrait_uncanny.jpg",
    "Emma Frost":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/9/80/51151ef7cf4c8/portrait_uncanny.jpg",
    Falcon: "https://cdn.marvel.com/u/prod/marvel/i/mg/f/b0/5111505fb7009/portrait_uncanny.jpg",
    Galactus: "https://cdn.marvel.com/u/prod/marvel/i/mg/5/03/528d31df87c49/portrait_uncanny.jpg",
    Gambit: "https://cdn.marvel.com/u/prod/marvel/i/mg/9/40/4ce5a0f6061cf/portrait_uncanny.jpg",
    Gamora: "https://cdn.marvel.com/u/prod/marvel/i/mg/9/80/52740b3c0f0e4/portrait_uncanny.jpg",
    "Ghost Rider":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/9/03/526958a4521f7/portrait_uncanny.jpg",
    Groot: "https://cdn.marvel.com/u/prod/marvel/i/mg/3/10/528d337a0dbd1/portrait_uncanny.jpg",
    Hawkeye: "https://cdn.marvel.com/u/prod/marvel/i/mg/4/03/52695ff5c8e7c/portrait_uncanny.jpg",
    Hela: "https://cdn.marvel.com/u/prod/marvel/i/mg/c/80/4ce5a0c8b8e4a/portrait_uncanny.jpg",
    Hercules: "https://cdn.marvel.com/u/prod/marvel/i/mg/b/d0/52052ebddfa53/portrait_uncanny.jpg",
    Hulk: "https://cdn.marvel.com/u/prod/marvel/i/mg/5/a0/538615ca33ab0/portrait_uncanny.jpg",
    Iceman: "https://cdn.marvel.com/u/prod/marvel/i/mg/1/d0/52696c836898c/portrait_uncanny.jpg",
    "Iron Fist":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/6/60/53176ebd8dc50/portrait_uncanny.jpg",
    "Jessica Jones":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/d/00/5390e41260345/portrait_uncanny.jpg",
    Jubilee: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/c0/4e7a2148b6e59/portrait_uncanny.jpg",
    Kang: "https://cdn.marvel.com/u/prod/marvel/i/mg/4/30/4c0035a1b2f31/portrait_uncanny.jpg",
    Kingpin: "https://cdn.marvel.com/u/prod/marvel/i/mg/2/50/4c0035f8b0e74/portrait_uncanny.jpg",
    Loki: "https://cdn.marvel.com/u/prod/marvel/i/mg/d/90/526547f509313/portrait_uncanny.jpg",
    Magik: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/b0/526958bde27c1/portrait_uncanny.jpg",
    Magneto: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/60/4c003d4dbe9f9/portrait_uncanny.jpg",
    Mantis: "https://cdn.marvel.com/u/prod/marvel/i/mg/3/20/52740c7b4f7ff/portrait_uncanny.jpg",
    "Miles Morales":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/6/20/4d2f214fe14f7/portrait_uncanny.jpg",
    "Misty Knight":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/d/90/511151789a863/portrait_uncanny.jpg",
    Mockingbird:
      "https://cdn.marvel.com/u/prod/marvel/i/mg/9/b0/51e829af23af9/portrait_uncanny.jpg",
    "Moon Knight":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/3/30/52028af90e516/portrait_uncanny.jpg",
    Morbius: "https://cdn.marvel.com/u/prod/marvel/i/mg/b/c0/535fee11e0e1a/portrait_uncanny.jpg",
    Mystique: "https://cdn.marvel.com/u/prod/marvel/i/mg/5/03/4ce5a46f268ca/portrait_uncanny.jpg",
    Namor: "https://cdn.marvel.com/u/prod/marvel/i/mg/3/60/4c003d3176a50/portrait_uncanny.jpg",
    Nebula: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/40/5269583c9705a/portrait_uncanny.jpg",
    "Nick Fury":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/3/70/52695af21b4a7/portrait_uncanny.jpg",
    Nightcrawler:
      "https://cdn.marvel.com/u/prod/marvel/i/mg/1/40/52695ed19538d/portrait_uncanny.jpg",
    Nova: "https://cdn.marvel.com/u/prod/marvel/i/mg/8/80/526963dad214d/portrait_uncanny.jpg",
    Okoye: "https://cdn.marvel.com/u/prod/marvel/i/mg/8/03/5a0d8540d87e6/portrait_uncanny.jpg",
    Punisher: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/60/4ce5a978728aa/portrait_uncanny.jpg",
    Psylocke: "https://cdn.marvel.com/u/prod/marvel/i/mg/1/50/526961ce86539/portrait_uncanny.jpg",
    Quicksilver:
      "https://cdn.marvel.com/u/prod/marvel/i/mg/6/10/4c0035a7dbb42/portrait_uncanny.jpg",
    "Red Skull":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/2/03/526036550cd37/portrait_uncanny.jpg",
    "Rocket Raccoon":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/9/b0/50fec1e49298a/portrait_uncanny.jpg",
    Rogue: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/50/511151789a863/portrait_uncanny.jpg",
    Sabretooth: "https://cdn.marvel.com/u/prod/marvel/i/mg/4/30/526958a70cd51/portrait_uncanny.jpg",
    "Shang-Chi":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/3/70/52695af21b4a7/portrait_uncanny.jpg",
    Shuri: "https://cdn.marvel.com/u/prod/marvel/i/mg/1/03/5a0d8536bbf71/portrait_uncanny.jpg",
    "Silver Surfer":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/5/03/526966e1a743e/portrait_uncanny.jpg",
    "Spider-Woman":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/c/60/526957e7cb209/portrait_uncanny.jpg",
    "Star-Lord":
      "https://cdn.marvel.com/u/prod/marvel/i/mg/9/10/53861521488f6/portrait_uncanny.jpg",
    Storm: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/40/526963dad214d/portrait_uncanny.jpg",
    Taskmaster: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/c0/526957dc0c27f/portrait_uncanny.jpg",
    Thanos: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/80/526976830d3c5/portrait_uncanny.jpg",
    Thor: "https://cdn.marvel.com/u/prod/marvel/i/mg/d/d0/526965a74350d/portrait_uncanny.jpg",
    Ultron: "https://cdn.marvel.com/u/prod/marvel/i/mg/9/90/538615ca33ab0/portrait_uncanny.jpg",
    Valkyrie: "https://cdn.marvel.com/u/prod/marvel/i/mg/c/00/535fed8a3a00f/portrait_uncanny.jpg",
    Venom: "https://cdn.marvel.com/u/prod/marvel/i/mg/5/50/531773a2ac20a/portrait_uncanny.jpg",
    Vision: "https://cdn.marvel.com/u/prod/marvel/i/mg/6/03/52695c8b4f8fb/portrait_uncanny.jpg",
    Wolverine: "https://cdn.marvel.com/u/prod/marvel/i/mg/9/03/526963dad214d/portrait_uncanny.jpg",
  }),
);

const exactImageByCharacter = new Map(
  Object.entries({
    "Black Panther":
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/106-black-panther.jpg",
    "Black Widow":
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/107-black-widow.jpg",
    "Captain America":
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/149-captain-america.jpg",
    "Doctor Strange":
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/226-doctor-strange.jpg",
    Hulk: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/332-hulk.jpg",
    "Iron Man":
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/346-iron-man.jpg",
    "Spider-Man":
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg",
    Storm: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/638-storm.jpg",
    Thor: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg",
    Wolverine:
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/717-wolverine.jpg",
  }),
);

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(value) {
  return normalize(value).replace(/\s+/g, "-");
}

function candidateMarvelSlugs(characterName) {
  const manual = marvelSlugByCharacter.get(characterName);
  const basic = slugify(characterName);
  const compactInitials = basic.replace(/\b([a-z])-([a-z])\b/g, "$1$2");
  return [...new Set([manual, basic, compactInitials].filter(Boolean))];
}

async function fetchMarvelPageImage(characterName) {
  for (const slug of candidateMarvelSlugs(characterName)) {
    for (const suffix of ["", "/in-comics", "/in-comics/profile", "/in-comics/full-report"]) {
      const response = await fetch(`${MARVEL_CHARACTER_BASE_URL}/${slug}${suffix}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
        },
      });

      if (!response.ok) continue;
      const html = await response.text();
      const match = html.match(
        /<meta[^>]+property="og:image"[^>]+content="([^"]+)"|<meta[^>]+content="([^"]+)"[^>]+property="og:image"/,
      );
      const imageUrl = match?.[1] ?? match?.[2];
      if (imageUrl?.includes("cdn.marvel.com")) {
        return imageUrl.replace("http://", "https://");
      }
    }
  }

  return null;
}

async function fetchFandomImage(characterName) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: characterName,
    gsrlimit: "8",
    pithumbsize: "700",
    prop: "pageimages",
  });

  const response = await fetch(`${MARVEL_FANDOM_API_URL}?${params}`, {
    headers: { "User-Agent": "Codex Marvel Nexus image importer" },
  });

  if (!response.ok) return null;
  const body = await response.json();
  const pages = Object.values(body.query?.pages ?? {}).filter((page) => page.thumbnail?.source);
  pages.sort((a, b) => {
    const aEarth616 = a.title.includes("Earth-616") ? 0 : 1;
    const bEarth616 = b.title.includes("Earth-616") ? 0 : 1;
    const aExact =
      normalize(a.title.replace(/\s+\(.+?\)/g, "")) === normalize(characterName) ? 0 : 1;
    const bExact =
      normalize(b.title.replace(/\s+\(.+?\)/g, "")) === normalize(characterName) ? 0 : 1;
    return aEarth616 - bEarth616 || aExact - bExact || (a.index ?? 999) - (b.index ?? 999);
  });

  const source = pages[0]?.thumbnail?.source;
  return source ? source.replace("http://", "https://") : null;
}

function readEnv(raw) {
  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

async function ensureRemoteAsset(admin, { altText, credit, imageUrl }) {
  const existing = await admin
    .from("storage_assets")
    .select("id")
    .eq("bucket", "remote-url")
    .eq("path", imageUrl)
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data?.id) return existing.data.id;

  const inserted = await admin
    .from("storage_assets")
    .insert({
      alt_text: altText,
      bucket: "remote-url",
      credit,
      is_active: true,
      path: imageUrl,
    })
    .select("id")
    .single();
  if (inserted.error) throw inserted.error;
  return inserted.data.id;
}

const envRaw = await readFile(new URL("../.env", import.meta.url), "utf8");
const env = readEnv(envRaw);
const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase URL or service role key in .env");
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const response = await fetch(HERO_API_URL, {
  headers: { "User-Agent": "Codex Marvel Nexus image importer" },
});

if (!response.ok) {
  throw new Error(`Could not fetch image dataset: ${response.status}`);
}

const heroes = await response.json();
const byName = new Map();

for (const hero of heroes) {
  const keys = [hero.name, hero.biography?.fullName, ...(hero.biography?.aliases ?? [])].filter(
    Boolean,
  );

  for (const key of keys) {
    byName.set(normalize(key), hero);
  }
}

const cards = await admin
  .from("cards")
  .select("id,characters(name)")
  .eq("is_active", true)
  .order("display_order", { ascending: true });
if (cards.error) throw cards.error;

let matched = 0;
let fallback = 0;
let marvelPageMatched = 0;
let fandomMatched = 0;
const missing = [];

for (const card of cards.data ?? []) {
  const character = Array.isArray(card.characters) ? card.characters[0] : card.characters;
  const characterName = character?.name;
  if (!characterName) continue;

  const alias = aliasByCharacter.get(characterName);
  const hero = byName.get(normalize(alias ?? characterName));
  let imageUrl = exactImageByCharacter.get(characterName) ?? hero?.images?.lg ?? null;

  if (!imageUrl && useMarvelPageFallback) {
    imageUrl = await fetchMarvelPageImage(characterName);
    if (imageUrl) {
      marvelPageMatched += 1;
    }
  }

  if (!imageUrl && useManualMarvelFallback) {
    imageUrl = generatedImageByCharacter.get(characterName) ?? null;
  }

  if (!imageUrl && useFandomFallback) {
    imageUrl = await fetchFandomImage(characterName);
    if (imageUrl) {
      fandomMatched += 1;
    }
  }

  if (!imageUrl) {
    missing.push(characterName);
    continue;
  }

  if (!dryRun) {
    const assetId = await ensureRemoteAsset(admin, {
      altText: `${characterName} character image`,
      credit: hero
        ? "Image dataset: akabab/superhero-api"
        : "Image source: Marvel CDN / Marvel.com",
      imageUrl,
    });

    const updated = await admin
      .from("cards")
      .update({ artwork_asset_id: assetId, thumbnail_asset_id: assetId })
      .eq("id", card.id);
    if (updated.error) throw updated.error;
  }

  if (hero) {
    matched += 1;
  } else {
    fallback += 1;
  }
}

console.log(
  JSON.stringify(
    {
      fallbackCards: fallback,
      matchedCards: matched,
      fandomMatchedCards: fandomMatched,
      marvelPageMatchedCards: marvelPageMatched,
      missingCards: missing.length,
      missing,
      dryRun,
      useMarvelPageFallback,
      useFandomFallback,
      useManualMarvelFallback,
    },
    null,
    2,
  ),
);
