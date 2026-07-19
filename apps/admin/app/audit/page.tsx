"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../../components/AdminShell";
import type { Json } from "../../lib/database.types";
import { supabase } from "../../lib/supabase";

interface AuditRow {
  id: string;
  action: string;
  entity_table: string;
  entity_id: string | null;
  metadata: Json;
  created_at: string;
}

function metadataPreview(metadata: Json) {
  if (metadata == null) return "{}";
  return JSON.stringify(metadata);
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogs() {
      const { data, error } = await supabase
        .from("admin_audit_logs")
        .select("id,action,entity_table,entity_id,metadata,created_at")
        .order("created_at", { ascending: false })
        .limit(80);

      if (error) {
        setMessage(error.message);
        return;
      }

      setLogs(data ?? []);
    }

    void loadLogs();
  }, []);

  return (
    <AdminShell>
      <header>
        <p className="text-sm font-black uppercase tracking-wide text-[#38BDF8]">Journal</p>
        <h1 className="mt-3 text-4xl font-black">Audit admin</h1>
      </header>
      {message ? (
        <p className="rounded-lg border border-[#2A3142] bg-[#111521] p-3 text-sm">{message}</p>
      ) : null}
      <section className="overflow-hidden rounded-lg border border-[#2A3142]">
        {logs.map((log) => (
          <article className="grid gap-2 border-b border-[#2A3142] bg-[#111521] p-4" key={log.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-black">{log.action}</h2>
                <p className="text-sm text-[#A7B0C0]">
                  {log.entity_table}
                  {log.entity_id ? ` / ${log.entity_id}` : ""} -{" "}
                  {new Date(log.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
            <pre className="overflow-auto rounded bg-[#05070D] p-3 text-xs text-[#A7B0C0]">
              {metadataPreview(log.metadata)}
            </pre>
          </article>
        ))}
        {logs.length === 0 ? (
          <p className="bg-[#111521] p-4 text-sm text-[#A7B0C0]">Aucune ligne d'audit.</p>
        ) : null}
      </section>
    </AdminShell>
  );
}
