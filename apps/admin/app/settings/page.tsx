"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AdminShell } from "../../components/AdminShell";
import { Field, SelectInput, SubmitButton, TextArea, TextInput } from "../../components/FormField";
import { recordAudit } from "../../lib/audit";
import { supabase } from "../../lib/supabase";

interface SettingsForm {
  pack_cooldown: string;
  cards_per_pack: number;
  duplicate_conversion: string;
  draw_mode: string;
  pity_enabled: boolean;
  maintenance_enabled: boolean;
  announcement: string;
  minimum_app_version: string;
}

export default function SettingsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<SettingsForm>({
    defaultValues: {
      pack_cooldown: "03:00:00",
      cards_per_pack: 1,
      duplicate_conversion: "xp",
      draw_mode: "strict_weights",
      pity_enabled: false,
      maintenance_enabled: false,
      announcement: "",
      minimum_app_version: "",
    },
  });

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("game_settings")
        .select("*")
        .eq("id", true)
        .single();
      if (error) {
        setMessage(error.message);
        return;
      }

      form.reset({
        pack_cooldown: data.pack_cooldown,
        cards_per_pack: data.cards_per_pack,
        duplicate_conversion: data.duplicate_conversion,
        draw_mode: data.draw_mode,
        pity_enabled: data.pity_enabled,
        maintenance_enabled: data.maintenance_enabled,
        announcement: data.announcement ?? "",
        minimum_app_version: data.minimum_app_version ?? "",
      });
    }

    void loadSettings();
  }, [form]);

  async function save(values: SettingsForm) {
    const { error } = await supabase
      .from("game_settings")
      .update({
        pack_cooldown: values.pack_cooldown,
        cards_per_pack: Number(values.cards_per_pack),
        duplicate_conversion: values.duplicate_conversion,
        draw_mode: values.draw_mode,
        pity_enabled: Boolean(values.pity_enabled),
        maintenance_enabled: Boolean(values.maintenance_enabled),
        announcement: values.announcement || null,
        minimum_app_version: values.minimum_app_version || null,
      })
      .eq("id", true);

    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit("game_settings.update", "game_settings", null, {
      cardsPerPack: values.cards_per_pack,
      cooldown: values.pack_cooldown,
      maintenance: values.maintenance_enabled,
    });
    setMessage("Parametres enregistres.");
  }

  return (
    <AdminShell>
      <header>
        <p className="text-sm font-black uppercase tracking-wide text-[#38BDF8]">Configuration</p>
        <h1 className="mt-3 text-4xl font-black">Parametres du jeu</h1>
      </header>
      {message ? (
        <p className="rounded-lg border border-[#2A3142] bg-[#111521] p-3 text-sm">{message}</p>
      ) : null}
      <form
        className="grid gap-5 rounded-lg border border-[#2A3142] bg-[#111521] p-5"
        onSubmit={(event) => {
          void form.handleSubmit(save)(event);
        }}
      >
        <section className="grid gap-4 md:grid-cols-2">
          <Field label="Cooldown pack">
            <TextInput placeholder="03:00:00 ou 3 hours" {...form.register("pack_cooldown")} />
          </Field>
          <Field label="Cartes par pack">
            <TextInput
              min={1}
              type="number"
              {...form.register("cards_per_pack", { valueAsNumber: true })}
            />
          </Field>
          <Field label="Conversion doublons">
            <SelectInput {...form.register("duplicate_conversion")}>
              <option value="xp">XP</option>
              <option value="fragments">Fragments</option>
              <option value="xp_and_fragments">XP et fragments</option>
            </SelectInput>
          </Field>
          <Field label="Mode de tirage">
            <SelectInput {...form.register("draw_mode")}>
              <option value="random">Aleatoire</option>
              <option value="prefer_missing">Favoriser manquantes</option>
              <option value="strict_weights">Poids stricts</option>
              <option value="pity">Protection rarete</option>
            </SelectInput>
          </Field>
          <Field label="Version minimale">
            <TextInput placeholder="1.0.0" {...form.register("minimum_app_version")} />
          </Field>
        </section>
        <section className="grid gap-3 rounded-lg border border-[#2A3142] bg-[#05070D] p-4">
          <label className="flex items-center gap-3 text-sm font-bold text-[#A7B0C0]">
            <input type="checkbox" {...form.register("pity_enabled")} />
            Activer l'architecture anti-malchance
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-[#A7B0C0]">
            <input type="checkbox" {...form.register("maintenance_enabled")} />
            Mode maintenance
          </label>
        </section>
        <Field label="Annonce">
          <TextArea {...form.register("announcement")} />
        </Field>
        <SubmitButton>Enregistrer les parametres</SubmitButton>
      </form>
    </AdminShell>
  );
}
