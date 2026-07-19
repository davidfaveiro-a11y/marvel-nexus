import { randomBytes } from "node:crypto";
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

const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const signIn = await client.auth.signInWithPassword({
  email: env.DEV_ADMIN_EMAIL,
  password: env.DEV_ADMIN_PASSWORD,
});
if (signIn.error) throw signIn.error;

const cardResult = await client
  .from("cards")
  .select("id,edition_name")
  .is("artwork_asset_id", null)
  .limit(1)
  .single();
if (cardResult.error) throw cardResult.error;

const fileName = `verify-${randomBytes(6).toString("hex")}.png`;
const path = `cards/${cardResult.data.id}/${fileName}`;
const pngBytes = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
    "base64",
  ),
);

const upload = await client.storage
  .from("card-artworks")
  .upload(path, new Blob([pngBytes], { type: "image/png" }), {
    contentType: "image/png",
    upsert: false,
  });
if (upload.error) throw upload.error;

const asset = await client
  .from("storage_assets")
  .insert({
    bucket: "card-artworks",
    path,
    alt_text: `Verification ${cardResult.data.edition_name}`,
  })
  .select("id")
  .single();
if (asset.error) throw asset.error;

const update = await client
  .from("cards")
  .update({ artwork_asset_id: asset.data.id })
  .eq("id", cardResult.data.id);
if (update.error) throw update.error;

console.log(JSON.stringify({ uploaded: true, cardId: cardResult.data.id, assetId: asset.data.id }));
