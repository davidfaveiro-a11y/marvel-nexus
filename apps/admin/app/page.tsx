"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../components/AdminShell";
import { supabase } from "../lib/supabase";

interface DashboardStats {
  players: number;
  activePlayers: number;
  collections: number;
  activeCollections: number;
  cards: number;
  activeCards: number;
  packs: number;
  auditLogs: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    players: 0,
    activePlayers: 0,
    collections: 0,
    activeCollections: 0,
    cards: 0,
    activeCards: 0,
    packs: 0,
    auditLogs: 0,
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      const [
        players,
        activePlayers,
        collections,
        activeCollections,
        cards,
        activeCards,
        packs,
        auditLogs,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase.from("collections").select("id", { count: "exact", head: true }),
        supabase
          .from("collections")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase.from("cards").select("id", { count: "exact", head: true }),
        supabase.from("cards").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("pack_openings").select("id", { count: "exact", head: true }),
        supabase.from("admin_audit_logs").select("id", { count: "exact", head: true }),
      ]);

      const error = [
        players.error,
        activePlayers.error,
        collections.error,
        activeCollections.error,
        cards.error,
        activeCards.error,
        packs.error,
        auditLogs.error,
      ].find(Boolean);

      if (error) {
        setMessage(error.message);
      }

      setStats({
        players: players.count ?? 0,
        activePlayers: activePlayers.count ?? 0,
        collections: collections.count ?? 0,
        activeCollections: activeCollections.count ?? 0,
        cards: cards.count ?? 0,
        activeCards: activeCards.count ?? 0,
        packs: packs.count ?? 0,
        auditLogs: auditLogs.count ?? 0,
      });
    }

    void loadStats();
  }, []);

  const cards = [
    ["Joueurs", `${stats.activePlayers}/${stats.players} actifs`],
    ["Collections", `${stats.activeCollections}/${stats.collections} actives`],
    ["Cartes", `${stats.activeCards}/${stats.cards} actives`],
    ["Packs ouverts", `${stats.packs}`],
    ["Audit", `${stats.auditLogs} actions journalisees`],
  ];

  return (
    <AdminShell>
      <header>
        <p className="text-sm font-black uppercase tracking-wide text-[#38BDF8]">Administration</p>
        <h1 className="mt-3 text-4xl font-black">Tableau de bord</h1>
      </header>
      {message ? (
        <p className="rounded-lg border border-[#2A3142] bg-[#111521] p-3 text-sm">{message}</p>
      ) : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, copy]) => (
          <article className="rounded-lg border border-[#2A3142] bg-[#111521] p-5" key={title}>
            <h2 className="text-lg font-black">{title}</h2>
            <p className="mt-2 text-2xl font-black text-[#38BDF8]">{copy}</p>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
