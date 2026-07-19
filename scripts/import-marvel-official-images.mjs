import { createHash } from "node:crypto";
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
const marvelPublicKey = env.MARVEL_PUBLIC_KEY;
const marvelPrivateKey = env.MARVEL_PRIVATE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase URL or service role key in .env");
}

if (!marvelPublicKey || !marvelPrivateKey) {
  throw new Error(
    "Missing MARVEL_PUBLIC_KEY or MARVEL_PRIVATE_KEY in .env. Create keys at developer.marvel.com, then rerun this script.",
  );
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function marvelAuthParams() {
  const ts = Date.now().toString();
  const hash = createHash("md5").update(`${ts}${marvelPrivateKey}${marvelPublicKey}`).digest("hex");
  return new URLSearchParams({ apikey: marvelPublicKey, hash, ts });
}

function characterSearchName(name) {
  return name
    .replace("Spider-Gwen", "Spider-Gwen (Gwen Stacy)")
    .replace("Spider-Man 2099", "Spider-Man 2099")
    .replace("Mister Fantastic", "Mr. Fantastic")
    .replace("Invisible Woman", "Invisible Woman")
    .replace("The Thing", "Thing")
    .replace("U.S. Agent", "US Agent")
    .replace("Valentina Allegra de Fontaine", "Valentina Allegra de Fontaine")
    .replace("The Warriors Three", "Warriors Three");
}

async function fetchMarvelCharacter(name) {
  const params = marvelAuthParams();
  params.set("name", characterSearchName(name));
  params.set("limit", "1");
  const response = await fetch(`https://gateway.marvel.com/v1/public/characters?${params}`);
  if (!response.ok) {
    throw new Error(`Marvel API ${response.status} for ${name}: ${await response.text()}`);
  }

  const body = await response.json();
  return body.data?.results?.[0] ?? null;
}

async function ensureRemoteAsset({ altText, credit, imageUrl }) {
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

const cards = await admin
  .from("cards")
  .select("id,character_id,characters(name)")
  .eq("is_active", true)
  .order("display_order", { ascending: true });
if (cards.error) throw cards.error;

const cache = new Map();
let matched = 0;
let missing = 0;

for (const card of cards.data) {
  const character = Array.isArray(card.characters) ? card.characters[0] : card.characters;
  const characterName = character?.name;
  if (!characterName) continue;

  if (!cache.has(characterName)) {
    const marvelCharacter = await fetchMarvelCharacter(characterName);
    cache.set(characterName, marvelCharacter);
  }

  const marvelCharacter = cache.get(characterName);
  const thumbnail = marvelCharacter?.thumbnail;
  if (!thumbnail?.path || thumbnail.path.includes("image_not_available")) {
    missing += 1;
    continue;
  }

  const imageUrl = `${thumbnail.path}/portrait_uncanny.${thumbnail.extension}`.replace(
    "http://",
    "https://",
  );
  const assetId = await ensureRemoteAsset({
    altText: `${characterName} official Marvel character image`,
    credit: "Data provided by Marvel. © 2026 MARVEL",
    imageUrl,
  });

  const updated = await admin
    .from("cards")
    .update({ artwork_asset_id: assetId, thumbnail_asset_id: assetId })
    .eq("id", card.id);
  if (updated.error) throw updated.error;
  matched += 1;
}

console.log(
  JSON.stringify({
    matchedCards: matched,
    missingCards: missing,
    uniqueCharactersChecked: cache.size,
  }),
);
