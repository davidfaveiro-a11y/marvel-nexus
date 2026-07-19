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

const admin = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const token = randomBytes(6).toString("hex").toUpperCase();
const email = `player-${token.toLowerCase()}@marvel-nexus.local`;
const password = `${randomBytes(18).toString("base64url")}Aa1!`;
const invitationCode = `TEST-${token}`;

const invitation = await admin.from("invitations").insert({
  code: invitationCode,
  email,
  max_uses: 1,
  is_active: true,
});
if (invitation.error) throw invitation.error;

const createdUser = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});
if (createdUser.error) throw createdUser.error;

const player = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.EXPO_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const signIn = await player.auth.signInWithPassword({ email, password });
if (signIn.error) throw signIn.error;

const profile = await player.rpc("complete_invited_profile", {
  invitation_code: invitationCode,
  desired_username: `player_${token.toLowerCase()}`,
});
if (profile.error) throw profile.error;

const firstOpening = await player.rpc("open_free_pack", {
  idempotency_key: `verify-${token}-1`,
});
if (firstOpening.error) throw firstOpening.error;

const secondOpening = await player.rpc("open_free_pack", {
  idempotency_key: `verify-${token}-2`,
});

if (!secondOpening.error?.message.includes("pack_not_available")) {
  throw new Error("Second pack opening was not blocked by the server cooldown");
}

const ownedCards = await player.from("player_cards").select("card_id,copies");
if (ownedCards.error) throw ownedCards.error;

const collections = await player.from("collections").select("id,name");
if (collections.error) throw collections.error;

const cards = await player.from("cards").select("id,collection_id,artwork_asset_id");
if (cards.error) throw cards.error;

const ownedIds = new Set(ownedCards.data.map((card) => card.card_id));
const progress = collections.data.map((collection) => {
  const collectionCards = cards.data.filter((card) => card.collection_id === collection.id);
  const ownedCount = collectionCards.filter((card) => ownedIds.has(card.id)).length;
  return {
    collectionId: collection.id,
    totalCount: collectionCards.length,
    ownedCount,
  };
});

console.log(
  JSON.stringify({
    profileCreated: Boolean(profile.data?.id),
    firstOpening: Boolean(firstOpening.data?.openingId),
    cooldownBlocked: true,
    ownedCards: ownedCards.data.length,
    catalogCards: cards.data.length,
    collectionProgressRows: progress.length,
  }),
);
