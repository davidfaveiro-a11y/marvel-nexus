"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AdminShell } from "../../components/AdminShell";
import { Field, SelectInput, SubmitButton, TextInput } from "../../components/FormField";
import { recordAudit } from "../../lib/audit";
import { supabase } from "../../lib/supabase";

interface RarityRow {
  id: string;
  name: string;
  rank: number;
  color: string;
  border_style: string;
  visual_effect: string;
  reveal_animation: string;
  default_xp: number;
  duplicate_value: number;
  default_weight: number;
  is_active: boolean;
}

interface DrawConfigurationRow {
  id: string;
  name: string;
  draw_mode: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

interface RarityForm {
  name: string;
  rank: number;
  color: string;
  border_style: string;
  visual_effect: string;
  reveal_animation: string;
  default_xp: number;
  duplicate_value: number;
  default_weight: number;
}

const buttonClass = "rounded-lg border border-[#2A3142] px-3 py-2 text-sm font-black";

export default function RaritiesPage() {
  const [rarities, setRarities] = useState<RarityRow[]>([]);
  const [configs, setConfigs] = useState<DrawConfigurationRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<RarityForm>({
    defaultValues: {
      name: "",
      rank: 1,
      color: "#38BDF8",
      border_style: "solid",
      visual_effect: "none",
      reveal_animation: "standard",
      default_xp: 5,
      duplicate_value: 2,
      default_weight: 1,
    },
  });

  const totalWeight = useMemo(
    () =>
      rarities
        .filter((rarity) => rarity.is_active)
        .reduce((sum, rarity) => sum + rarity.default_weight, 0),
    [rarities],
  );

  async function refresh() {
    const [raritiesResult, configsResult] = await Promise.all([
      supabase
        .from("rarities")
        .select(
          "id,name,rank,color,border_style,visual_effect,reveal_animation,default_xp,duplicate_value,default_weight,is_active",
        )
        .order("rank"),
      supabase
        .from("draw_configurations")
        .select("id,name,draw_mode,is_published,published_at,created_at")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    if (raritiesResult.error) setMessage(raritiesResult.error.message);
    if (configsResult.error) setMessage(configsResult.error.message);
    setRarities(raritiesResult.data ?? []);
    setConfigs(configsResult.data ?? []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  function edit(rarity: RarityRow) {
    setEditingId(rarity.id);
    form.reset({
      name: rarity.name,
      rank: rarity.rank,
      color: rarity.color,
      border_style: rarity.border_style,
      visual_effect: rarity.visual_effect,
      reveal_animation: rarity.reveal_animation,
      default_xp: rarity.default_xp,
      duplicate_value: rarity.duplicate_value,
      default_weight: rarity.default_weight,
    });
  }

  async function save(values: RarityForm) {
    const payload = {
      name: values.name,
      rank: Number(values.rank),
      color: values.color,
      border_style: values.border_style || "solid",
      visual_effect: values.visual_effect || "none",
      reveal_animation: values.reveal_animation || "standard",
      default_xp: Number(values.default_xp),
      duplicate_value: Number(values.duplicate_value),
      default_weight: Number(values.default_weight),
    };

    const result = editingId
      ? await supabase.from("rarities").update(payload).eq("id", editingId).select("id").single()
      : await supabase.from("rarities").insert(payload).select("id").single();

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    await recordAudit(editingId ? "rarity.update" : "rarity.create", "rarities", result.data.id, {
      name: values.name,
    });
    setMessage(editingId ? "Rarete modifiee." : "Rarete creee.");
    setEditingId(null);
    form.reset();
    await refresh();
  }

  async function toggle(rarity: RarityRow) {
    const { error } = await supabase
      .from("rarities")
      .update({ is_active: !rarity.is_active })
      .eq("id", rarity.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit(
      rarity.is_active ? "rarity.deactivate" : "rarity.reactivate",
      "rarities",
      rarity.id,
    );
    setMessage(rarity.is_active ? "Rarete desactivee." : "Rarete reactivee.");
    await refresh();
  }

  async function publishConfiguration() {
    const active = rarities.filter((rarity) => rarity.is_active);
    if (active.length === 0) {
      setMessage("Impossible de publier sans rarete active.");
      return;
    }

    const rarityWeights = Object.fromEntries(
      active.map((rarity) => [rarity.id, rarity.default_weight]),
    );
    const disableCurrent = await supabase
      .from("draw_configurations")
      .update({ is_published: false })
      .eq("is_published", true);

    if (disableCurrent.error) {
      setMessage(disableCurrent.error.message);
      return;
    }

    const { data, error } = await supabase
      .from("draw_configurations")
      .insert({
        name: `Configuration ${new Date().toLocaleString("fr-FR")}`,
        draw_mode: "strict_weights",
        rarity_weights: rarityWeights,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit("draw_configuration.publish", "draw_configurations", data.id, {
      rarityCount: active.length,
    });
    setMessage("Configuration publiee.");
    await refresh();
  }

  return (
    <AdminShell>
      <header>
        <p className="text-sm font-black uppercase tracking-wide text-[#38BDF8]">Equilibrage</p>
        <h1 className="mt-3 text-4xl font-black">Raretes et probabilites</h1>
      </header>
      {message ? (
        <p className="rounded-lg border border-[#2A3142] bg-[#111521] p-3 text-sm">{message}</p>
      ) : null}
      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <form
          className="grid gap-4 rounded-lg border border-[#2A3142] bg-[#111521] p-5"
          onSubmit={(event) => {
            void form.handleSubmit(save)(event);
          }}
        >
          <h2 className="text-lg font-black">
            {editingId ? "Modifier rarete" : "Nouvelle rarete"}
          </h2>
          <Field label="Nom">
            <TextInput {...form.register("name", { required: true })} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Rang">
              <TextInput type="number" {...form.register("rank", { valueAsNumber: true })} />
            </Field>
            <Field label="Couleur">
              <TextInput type="color" {...form.register("color")} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="XP">
              <TextInput type="number" {...form.register("default_xp", { valueAsNumber: true })} />
            </Field>
            <Field label="Doublon">
              <TextInput
                type="number"
                {...form.register("duplicate_value", { valueAsNumber: true })}
              />
            </Field>
          </div>
          <Field label="Poids">
            <TextInput
              step="0.001"
              type="number"
              {...form.register("default_weight", { valueAsNumber: true })}
            />
          </Field>
          <Field label="Bordure">
            <TextInput {...form.register("border_style")} />
          </Field>
          <Field label="Effet visuel">
            <TextInput {...form.register("visual_effect")} />
          </Field>
          <Field label="Animation revelation">
            <SelectInput {...form.register("reveal_animation")}>
              <option value="standard">standard</option>
              <option value="shine">shine</option>
              <option value="burst">burst</option>
              <option value="mythic">mythic</option>
            </SelectInput>
          </Field>
          <div className="flex flex-wrap gap-2">
            <SubmitButton>{editingId ? "Enregistrer" : "Creer"}</SubmitButton>
            {editingId ? (
              <button
                className={buttonClass}
                onClick={() => {
                  setEditingId(null);
                  form.reset();
                }}
                type="button"
              >
                Annuler
              </button>
            ) : null}
          </div>
        </form>
        <section className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black">Poids actifs</h2>
            <button
              className="rounded-lg bg-[#38BDF8] px-4 py-3 text-sm font-black text-[#05070D]"
              onClick={() => void publishConfiguration()}
              type="button"
            >
              Publier la configuration
            </button>
          </div>
          {rarities.map((rarity) => {
            const rate =
              totalWeight > 0 && rarity.is_active ? (rarity.default_weight / totalWeight) * 100 : 0;
            return (
              <article
                className="rounded-lg border border-[#2A3142] bg-[#111521] p-4"
                key={rarity.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-5 w-5 rounded" style={{ backgroundColor: rarity.color }} />
                    <div>
                      <h3 className="font-black">{rarity.name}</h3>
                      <p className="text-sm text-[#A7B0C0]">
                        Rang {rarity.rank} - {rarity.default_xp} XP - poids {rarity.default_weight}{" "}
                        - {rate.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className={buttonClass} onClick={() => edit(rarity)} type="button">
                      Modifier
                    </button>
                    <button
                      className={buttonClass}
                      onClick={() => void toggle(rarity)}
                      type="button"
                    >
                      {rarity.is_active ? "Desactiver" : "Reactiver"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </section>
      <section className="grid gap-3">
        <h2 className="text-xl font-black">Configurations recentes</h2>
        {configs.map((config) => (
          <article className="rounded-lg border border-[#2A3142] bg-[#111521] p-4" key={config.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-black">{config.name}</h3>
                <p className="text-sm text-[#A7B0C0]">
                  {config.draw_mode} - creee {new Date(config.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
              <span className="rounded border border-[#2A3142] px-2 py-1 text-xs text-[#A7B0C0]">
                {config.is_published ? "Publiee" : "Archivee"}
              </span>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
