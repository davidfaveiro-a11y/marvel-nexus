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

const adminEmail = env.DEV_ADMIN_EMAIL || "admin@marvel-nexus.local";
const realPlayers = [
  {
    email: "david@marvel-nexus.local",
    password: "DavidNexus2026!",
    username: "David",
    avatarHero: "Spider-Man",
    avatarImageUrl:
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg",
  },
  {
    email: "jeremy@marvel-nexus.local",
    password: "JeremyNexus2026!",
    username: "Jeremy",
    avatarHero: "Wolverine",
    avatarImageUrl:
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/717-wolverine.jpg",
  },
];

const preservedEmails = new Set([adminEmail, ...realPlayers.map((player) => player.email)]);

async function listAllUsers() {
  const users = [];
  for (let page = 1; page < 50; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  return users;
}

async function deleteRows(table, column, ids) {
  if (ids.length === 0) return;
  const { error } = await admin.from(table).delete().in(column, ids);
  if (error) throw error;
}

async function createOrUpdatePlayer(player) {
  const users = await listAllUsers();
  let user = users.find((item) => item.email?.toLowerCase() === player.email);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email: player.email,
      password: player.password,
      email_confirm: true,
      user_metadata: {
        username: player.username,
        avatar_hero: player.avatarHero,
        avatar_image_url: player.avatarImageUrl,
      },
    });
    if (error) throw error;
    user = data.user;
  } else {
    const { data, error } = await admin.auth.admin.updateUserById(user.id, {
      password: player.password,
      email_confirm: true,
      user_metadata: {
        username: player.username,
        avatar_hero: player.avatarHero,
        avatar_image_url: player.avatarImageUrl,
      },
    });
    if (error) throw error;
    user = data.user;
  }

  if (!user) throw new Error(`Could not create ${player.email}`);

  await deleteRows("player_favorites", "player_id", [user.id]);
  await deleteRows("notifications", "player_id", [user.id]);
  await deleteRows("xp_transactions", "player_id", [user.id]);
  await deleteRows("player_cards", "player_id", [user.id]);
  await deleteRows("pack_openings", "player_id", [user.id]);
  await deleteRows("user_roles", "user_id", [user.id]);
  await deleteRows("profiles", "id", [user.id]);

  const profilePayload = {
    id: user.id,
    username: player.username,
    status: "active",
    level: 1,
    total_xp: 0,
    current_xp: 0,
    next_level_xp: 100,
    fragments: 0,
    last_pack_opened_at: null,
    next_pack_available_at: null,
    hide_leaderboard_stats: false,
  };
  const profile = await admin.from("profiles").insert(profilePayload);
  if (profile.error) throw profile.error;

  const role = await admin.from("user_roles").upsert({ user_id: user.id, role: "player" });
  if (role.error) throw role.error;

  return { id: user.id, email: player.email, username: player.username };
}

const profilesResult = await admin.from("profiles").select("id,username");
if (profilesResult.error) throw profilesResult.error;
const usernameById = new Map(
  (profilesResult.data ?? []).map((profile) => [profile.id, profile.username]),
);

const adminProfile = await admin
  .from("profiles")
  .update({ hide_leaderboard_stats: true })
  .eq("username", "admin");
if (adminProfile.error) throw adminProfile.error;

const usersBefore = await listAllUsers();
const usersToDelete = usersBefore.filter((user) => {
  const email = user.email?.toLowerCase() ?? "";
  const username = String(
    usernameById.get(user.id) ?? user.user_metadata?.username ?? "",
  ).toLowerCase();
  if (preservedEmails.has(email)) return false;
  if (email.endsWith("@marvel-nexus.local")) return true;
  return (
    /test|demo|fake|guest|player|joueur/.test(email) ||
    /test|demo|fake|guest|player|joueur/.test(username)
  );
});

for (const user of usersToDelete) {
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw error;
}

const readyPlayers = [];
for (const player of realPlayers) {
  readyPlayers.push(await createOrUpdatePlayer(player));
}

const remainingUsers = await listAllUsers();
const visibleUsers = remainingUsers
  .filter((user) => preservedEmails.has(user.email?.toLowerCase() ?? ""))
  .map((user) => ({ email: user.email, id: user.id }));

console.log(
  JSON.stringify(
    {
      deletedTestUsers: usersToDelete.map((user) => user.email),
      readyPlayers,
      preservedUsers: visibleUsers,
    },
    null,
    2,
  ),
);
