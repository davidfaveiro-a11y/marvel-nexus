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

const { data, error } = await admin
  .from("cards")
  .select("id,is_active,artwork_asset_id,characters(name),collections(name)")
  .eq("is_active", true);

if (error) throw error;

const byCollection = new Map();
const byCharacter = new Map();

for (const card of data ?? []) {
  const collectionName = Array.isArray(card.collections)
    ? card.collections[0]?.name
    : card.collections?.name;
  const characterName = Array.isArray(card.characters)
    ? card.characters[0]?.name
    : card.characters?.name;

  byCollection.set(collectionName, (byCollection.get(collectionName) ?? 0) + 1);
  byCharacter.set(characterName, [
    ...(byCharacter.get(characterName) ?? []),
    collectionName,
  ]);
}

const duplicates = [...byCharacter.entries()].filter(([, collections]) => collections.length > 1);
const missingArtwork = (data ?? []).filter((card) => !card.artwork_asset_id);

console.log(JSON.stringify(Object.fromEntries([...byCollection.entries()].sort()), null, 2));
console.log(`activeCards=${data?.length ?? 0}`);
console.log(`duplicateCharacters=${duplicates.length}`);
console.log(`missingArtwork=${missingArtwork.length}`);

if ((data?.length ?? 0) !== 240) {
  throw new Error(`Expected 240 active cards, got ${data?.length ?? 0}`);
}

for (const [collectionName, count] of byCollection) {
  if (count !== 20) {
    throw new Error(`${collectionName} has ${count} active cards instead of 20`);
  }
}

if (duplicates.length > 0) {
  console.log(JSON.stringify(duplicates, null, 2));
  throw new Error("Live catalog has duplicate characters");
}

if (missingArtwork.length > 0) {
  throw new Error(`Expected every active card to have artwork, got ${missingArtwork.length} missing`);
}
