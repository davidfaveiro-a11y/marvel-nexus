"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../../components/AdminShell";
import { recordAudit } from "../../lib/audit";
import { supabase } from "../../lib/supabase";

interface ProfileRow {
  id: string;
  username: string;
  level: number;
  total_xp: number;
  current_xp: number;
  next_level_xp: number;
  fragments: number;
  status: string;
  next_pack_available_at: string | null;
  created_at: string;
}

interface PlayerCardRow {
  player_id: string;
  card_id: string;
  copies: number;
}

interface OpeningRow {
  player_id: string;
  opened_at: string;
}

const statusLabels: Record<string, string> = {
  active: "Actif",
  suspended: "Suspendu",
  banned: "Banni",
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<ProfileRow[]>([]);
  const [playerCards, setPlayerCards] = useState<PlayerCardRow[]>([]);
  const [openings, setOpenings] = useState<OpeningRow[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const statsByPlayer = useMemo(() => {
    return new Map(
      players.map((player) => {
        const cards = playerCards.filter((card) => card.player_id === player.id);
        const copies = cards.reduce((sum, card) => sum + card.copies, 0);
        const packCount = openings.filter((opening) => opening.player_id === player.id).length;
        return [player.id, { uniqueCards: cards.length, copies, packCount }];
      }),
    );
  }, [openings, playerCards, players]);

  const filteredPlayers = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return players;
    return players.filter((player) => player.username.toLowerCase().includes(normalized));
  }, [players, search]);

  async function refresh() {
    const [profilesResult, cardsResult, openingsResult] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id,username,level,total_xp,current_xp,next_level_xp,fragments,status,next_pack_available_at,created_at",
        )
        .order("created_at", { ascending: false }),
      supabase.from("player_cards").select("player_id,card_id,copies"),
      supabase
        .from("pack_openings")
        .select("player_id,opened_at")
        .order("opened_at", { ascending: false }),
    ]);

    if (profilesResult.error) setMessage(profilesResult.error.message);
    if (cardsResult.error) setMessage(cardsResult.error.message);
    if (openingsResult.error) setMessage(openingsResult.error.message);

    setPlayers(profilesResult.data ?? []);
    setPlayerCards(cardsResult.data ?? []);
    setOpenings(openingsResult.data ?? []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function updateStatus(player: ProfileRow, status: "active" | "suspended" | "banned") {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", player.id);
    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit("player.status_update", "profiles", player.id, {
      previousStatus: player.status,
      status,
    });
    setMessage(`Statut mis a jour: ${statusLabels[status]}.`);
    await refresh();
  }

  return (
    <AdminShell>
      <header>
        <p className="text-sm font-black uppercase tracking-wide text-[#38BDF8]">
          Communaute privee
        </p>
        <h1 className="mt-3 text-4xl font-black">Joueurs</h1>
      </header>
      {message ? (
        <p className="rounded-lg border border-[#2A3142] bg-[#111521] p-3 text-sm">{message}</p>
      ) : null}
      <input
        className="min-h-11 rounded-lg border border-[#2A3142] bg-[#05070D] px-3 text-sm text-white outline-none focus:border-[#38BDF8]"
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un pseudo"
        value={search}
      />
      <section className="grid gap-3">
        {filteredPlayers.map((player) => {
          const stats = statsByPlayer.get(player.id);
          return (
            <article
              className="rounded-lg border border-[#2A3142] bg-[#111521] p-5"
              key={player.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">{player.username}</h2>
                  <p className="mt-1 text-sm text-[#A7B0C0]">
                    Niveau {player.level} - {player.total_xp} XP - {player.fragments} fragments
                  </p>
                  <p className="mt-1 text-sm text-[#A7B0C0]">
                    {stats?.uniqueCards ?? 0} cartes uniques - {stats?.copies ?? 0} copies -{" "}
                    {stats?.packCount ?? 0} packs ouverts
                  </p>
                  <p className="mt-1 text-sm text-[#A7B0C0]">
                    Prochain pack:{" "}
                    {player.next_pack_available_at
                      ? new Date(player.next_pack_available_at).toLocaleString("fr-FR")
                      : "Disponible"}
                  </p>
                </div>
                <span className="rounded border border-[#2A3142] px-2 py-1 text-xs font-black text-[#A7B0C0]">
                  {statusLabels[player.status] ?? player.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="rounded-lg border border-[#2A3142] px-3 py-2 text-sm font-black"
                  disabled={player.status === "active"}
                  onClick={() => void updateStatus(player, "active")}
                  type="button"
                >
                  Reactiver
                </button>
                <button
                  className="rounded-lg border border-[#2A3142] px-3 py-2 text-sm font-black"
                  disabled={player.status === "suspended"}
                  onClick={() => void updateStatus(player, "suspended")}
                  type="button"
                >
                  Suspendre
                </button>
                <button
                  className="rounded-lg border border-[#FB7185] px-3 py-2 text-sm font-black text-[#FB7185]"
                  disabled={player.status === "banned"}
                  onClick={() => void updateStatus(player, "banned")}
                  type="button"
                >
                  Bannir
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </AdminShell>
  );
}
