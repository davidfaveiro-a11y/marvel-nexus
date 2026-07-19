"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../../components/AdminShell";
import { Field, SubmitButton, TextInput } from "../../components/FormField";
import { recordAudit } from "../../lib/audit";
import { supabase } from "../../lib/supabase";

interface InvitationRow {
  id: string;
  code: string;
  email: string | null;
  expires_at: string | null;
  max_uses: number;
  used_count: number;
  is_active: boolean;
}

export default function InvitationsPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxUses, setMaxUses] = useState(1);
  const [invitations, setInvitations] = useState<InvitationRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function refreshInvitations() {
    const { data, error } = await supabase
      .from("invitations")
      .select("id,code,email,expires_at,max_uses,used_count,is_active")
      .order("created_at", { ascending: false });

    if (error) setMessage(error.message);
    setInvitations(data ?? []);
  }

  useEffect(() => {
    void refreshInvitations();
  }, []);

  async function createInvitation() {
    const generated =
      code.trim().toUpperCase() ||
      `PRIVATE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const { data, error } = await supabase
      .from("invitations")
      .insert({
        code: generated,
        email: email.trim() || null,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        max_uses: maxUses,
      })
      .select("id")
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit("invitation.create", "invitations", data.id, {
      code: generated,
      hasEmail: Boolean(email.trim()),
    });
    setMessage(`Invitation creee: ${generated}`);
    setCode("");
    setEmail("");
    setExpiresAt("");
    setMaxUses(1);
    await refreshInvitations();
  }

  async function setInvitationActive(invitation: InvitationRow, isActive: boolean) {
    const { error } = await supabase
      .from("invitations")
      .update({ is_active: isActive })
      .eq("id", invitation.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit(
      isActive ? "invitation.reactivate" : "invitation.deactivate",
      "invitations",
      invitation.id,
      {
        code: invitation.code,
      },
    );
    setMessage(isActive ? "Invitation reactivee." : "Invitation desactivee.");
    await refreshInvitations();
  }

  async function copyCode(codeToCopy: string) {
    await navigator.clipboard.writeText(codeToCopy);
    setMessage(`Code copie: ${codeToCopy}`);
  }

  return (
    <AdminShell>
      <header>
        <p className="text-sm font-black uppercase tracking-wide text-[#38BDF8]">Acces prive</p>
        <h1 className="mt-3 text-4xl font-black">Invitations</h1>
      </header>
      <form
        className="grid gap-4 rounded-lg border border-[#2A3142] bg-[#111521] p-5 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void createInvitation();
        }}
      >
        <Field label="Code">
          <TextInput
            onChange={(event) => setCode(event.target.value)}
            placeholder="CODE-OPTIONNEL"
            value={code}
          />
        </Field>
        <Field label="Email reserve">
          <TextInput
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ami@example.com"
            type="email"
            value={email}
          />
        </Field>
        <Field label="Expiration">
          <TextInput
            onChange={(event) => setExpiresAt(event.target.value)}
            type="datetime-local"
            value={expiresAt}
          />
        </Field>
        <Field label="Utilisations max">
          <TextInput
            min={1}
            onChange={(event) => setMaxUses(Number(event.target.value))}
            type="number"
            value={maxUses}
          />
        </Field>
        <div className="md:col-span-2">
          <SubmitButton>Creer une invitation</SubmitButton>
        </div>
        {message ? <p className="text-sm text-[#A7B0C0] md:col-span-2">{message}</p> : null}
      </form>
      <section className="grid gap-3">
        {invitations.map((invitation) => (
          <article
            className="grid gap-3 rounded-lg border border-[#2A3142] bg-[#111521] p-4 md:grid-cols-[1fr_auto]"
            key={invitation.id}
          >
            <div>
              <div className="font-black">{invitation.code}</div>
              <p className="mt-1 text-sm text-[#A7B0C0]">
                {invitation.email ?? "Tous emails"} - {invitation.used_count}/{invitation.max_uses}{" "}
                utilisation(s)
                {invitation.expires_at
                  ? ` - expire ${new Date(invitation.expires_at).toLocaleString("fr-FR")}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-lg border border-[#2A3142] px-3 py-2 text-sm font-black text-[#F5F7FA]"
                onClick={() => void copyCode(invitation.code)}
                type="button"
              >
                Copier
              </button>
              <button
                className="rounded-lg border border-[#2A3142] px-3 py-2 text-sm font-black text-[#F5F7FA]"
                onClick={() => {
                  void setInvitationActive(invitation, !invitation.is_active);
                }}
                type="button"
              >
                {invitation.is_active ? "Desactiver" : "Reactiver"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
