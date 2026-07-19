import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const envPath = new URL("../.env", import.meta.url);
const envRaw = await readFile(envPath, "utf8");
const env = Object.fromEntries(
  envRaw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const adminEmail = env.DEV_ADMIN_EMAIL || "admin@marvel-nexus.local";
const adminPassword = env.DEV_ADMIN_PASSWORD || `${randomBytes(24).toString("base64url")}Aa1!`;

const supabase = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const createUser = await supabase.auth.admin.createUser({
  email: adminEmail,
  password: adminPassword,
  email_confirm: true,
  user_metadata: { username: "admin" },
});

if (
  createUser.error &&
  createUser.error.code !== "email_exists" &&
  !createUser.error.message.includes("already registered")
) {
  throw createUser.error;
}

let userId = createUser.data.user?.id;
if (!userId) {
  const listUsers = await supabase.auth.admin.listUsers();
  if (listUsers.error) throw listUsers.error;
  userId = listUsers.data.users.find((user) => user.email === adminEmail)?.id;
}

if (!userId) {
  throw new Error("Could not resolve admin user id");
}

const updateUser = await supabase.auth.admin.updateUserById(userId, {
  password: adminPassword,
  email_confirm: true,
});
if (updateUser.error) throw updateUser.error;

const profile = await supabase
  .from("profiles")
  .upsert({ id: userId, username: "admin", status: "active" });
if (profile.error) throw profile.error;

const role = await supabase.from("user_roles").upsert({ user_id: userId, role: "admin" });
if (role.error) throw role.error;

const invitation = await supabase
  .from("invitations")
  .upsert(
    { code: "ADMIN-DEV", email: adminEmail, max_uses: 1, used_count: 1, is_active: false },
    { onConflict: "code" },
  );
if (invitation.error) throw invitation.error;

let updatedEnv = envRaw;
for (const [key, value] of Object.entries({
  DEV_ADMIN_EMAIL: adminEmail,
  DEV_ADMIN_PASSWORD: adminPassword,
})) {
  if (updatedEnv.includes(`${key}=`)) {
    updatedEnv = updatedEnv.replace(new RegExp(`${key}=.*`), `${key}=${value}`);
  } else {
    updatedEnv += `${key}=${value}\n`;
  }
}

await writeFile(envPath, updatedEnv, "utf8");
console.log("Development admin is ready. Credentials are stored in .env.");
