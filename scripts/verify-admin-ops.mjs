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

const settings = await client.from("game_settings").select("*").eq("id", true).single();
if (settings.error) throw settings.error;

const settingsUpdate = await client
  .from("game_settings")
  .update({
    announcement: settings.data.announcement,
    maintenance_enabled: settings.data.maintenance_enabled,
  })
  .eq("id", true);
if (settingsUpdate.error) throw settingsUpdate.error;

const rarity = await client
  .from("rarities")
  .select("id,default_weight")
  .eq("is_active", true)
  .limit(1)
  .single();
if (rarity.error) throw rarity.error;

const rarityUpdate = await client
  .from("rarities")
  .update({ default_weight: rarity.data.default_weight })
  .eq("id", rarity.data.id);
if (rarityUpdate.error) throw rarityUpdate.error;

const audit = await client.from("admin_audit_logs").insert({
  actor_id: signIn.data.user.id,
  action: "verify.admin_ops",
  entity_table: "system",
  metadata: { ok: true },
});
if (audit.error) throw audit.error;

console.log(
  JSON.stringify({
    signedIn: Boolean(signIn.data.user.id),
    settingsUpdated: true,
    rarityUpdated: true,
    auditInserted: true,
  }),
);
