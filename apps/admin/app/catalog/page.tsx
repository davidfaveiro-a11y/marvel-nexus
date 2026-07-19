"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AdminShell } from "../../components/AdminShell";
import { Field, SelectInput, SubmitButton, TextArea, TextInput } from "../../components/FormField";
import { recordAudit } from "../../lib/audit";
import { supabase } from "../../lib/supabase";

interface CollectionRow {
  id: string;
  name: string;
  description: string | null;
  cover_asset_id: string | null;
  banner_asset_id: string | null;
  primary_color: string;
  starts_at: string | null;
  ends_at: string | null;
  display_order: number;
  is_active: boolean;
}

interface CharacterRow {
  id: string;
  name: string;
  alias: string | null;
  description: string | null;
  affiliation: string | null;
  is_active: boolean;
}

interface RarityRow {
  id: string;
  name: string;
  rank: number;
  color: string;
  default_xp: number;
  duplicate_value: number;
  default_weight: number;
  is_active: boolean;
}

interface CardRow {
  id: string;
  public_number: number;
  character_id: string;
  collection_id: string;
  rarity_id: string;
  edition_name: string;
  description: string | null;
  xp_value: number;
  duplicate_value: number;
  draw_weight: number;
  artwork_asset_id: string | null;
  thumbnail_asset_id: string | null;
  released_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  is_event_card: boolean;
  frame_style: string;
  animation_profile: string;
  display_order: number;
}

interface CollectionForm {
  name: string;
  description: string;
  primary_color: string;
  starts_at: string;
  ends_at: string;
  display_order: number;
}

interface CharacterForm {
  name: string;
  alias: string;
  description: string;
  affiliation: string;
}

interface CardForm {
  public_number: number;
  character_id: string;
  collection_id: string;
  rarity_id: string;
  edition_name: string;
  description: string;
  xp_value: number;
  duplicate_value: number;
  draw_weight: number;
  released_at: string;
  ends_at: string;
  is_event_card: boolean;
  frame_style: string;
  animation_profile: string;
  display_order: number;
}

type CatalogTable = "collections" | "characters" | "cards";
type UploadTarget =
  "cover_asset_id" | "banner_asset_id" | "artwork_asset_id" | "thumbnail_asset_id";

const buttonClass = "rounded-lg border border-[#2A3142] px-3 py-2 text-sm font-black";

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  return value.slice(0, 16);
}

function toIsoOrNull(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export default function CatalogPage() {
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [characters, setCharacters] = useState<CharacterRow[]>([]);
  const [rarities, setRarities] = useState<RarityRow[]>([]);
  const [cards, setCards] = useState<CardRow[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const collectionForm = useForm<CollectionForm>({
    defaultValues: {
      name: "",
      description: "",
      primary_color: "#38BDF8",
      starts_at: "",
      ends_at: "",
      display_order: 0,
    },
  });
  const characterForm = useForm<CharacterForm>({
    defaultValues: { name: "", alias: "", description: "", affiliation: "" },
  });
  const cardForm = useForm<CardForm>({
    defaultValues: {
      public_number: 1,
      character_id: "",
      collection_id: "",
      rarity_id: "",
      edition_name: "",
      description: "",
      xp_value: 5,
      duplicate_value: 2,
      draw_weight: 1,
      released_at: "",
      ends_at: "",
      is_event_card: false,
      frame_style: "standard",
      animation_profile: "standard",
      display_order: 1,
    },
  });

  async function refreshCatalog() {
    const [collectionsResult, charactersResult, raritiesResult, cardsResult] = await Promise.all([
      supabase
        .from("collections")
        .select(
          "id,name,description,cover_asset_id,banner_asset_id,primary_color,starts_at,ends_at,display_order,is_active",
        )
        .order("display_order"),
      supabase
        .from("characters")
        .select("id,name,alias,description,affiliation,is_active")
        .order("name"),
      supabase
        .from("rarities")
        .select("id,name,rank,color,default_xp,duplicate_value,default_weight,is_active")
        .order("rank"),
      supabase
        .from("cards")
        .select(
          "id,public_number,character_id,collection_id,rarity_id,edition_name,description,xp_value,duplicate_value,draw_weight,artwork_asset_id,thumbnail_asset_id,released_at,ends_at,is_active,is_event_card,frame_style,animation_profile,display_order",
        )
        .order("display_order"),
    ]);

    if (collectionsResult.error) setMessage(collectionsResult.error.message);
    if (charactersResult.error) setMessage(charactersResult.error.message);
    if (raritiesResult.error) setMessage(raritiesResult.error.message);
    if (cardsResult.error) setMessage(cardsResult.error.message);

    setCollections(collectionsResult.data ?? []);
    setCharacters(charactersResult.data ?? []);
    setRarities(raritiesResult.data ?? []);
    setCards(cardsResult.data ?? []);
  }

  useEffect(() => {
    void refreshCatalog();
  }, []);

  async function createCollection(values: CollectionForm) {
    const { data, error } = await supabase
      .from("collections")
      .insert({
        name: values.name,
        description: values.description || null,
        primary_color: values.primary_color,
        starts_at: toIsoOrNull(values.starts_at),
        ends_at: toIsoOrNull(values.ends_at),
        display_order: Number(values.display_order),
      })
      .select("id")
      .single();

    if (error) setMessage(error.message);
    else {
      await recordAudit("collection.create", "collections", data.id, { name: values.name });
      setMessage("Collection creee.");
      collectionForm.reset();
      await refreshCatalog();
    }
  }

  async function createCharacter(values: CharacterForm) {
    const { data, error } = await supabase
      .from("characters")
      .insert({
        name: values.name,
        alias: values.alias || null,
        description: values.description || null,
        affiliation: values.affiliation || null,
      })
      .select("id")
      .single();

    if (error) setMessage(error.message);
    else {
      await recordAudit("character.create", "characters", data.id, { name: values.name });
      setMessage("Personnage cree.");
      characterForm.reset();
      await refreshCatalog();
    }
  }

  async function createCard(values: CardForm) {
    const rarity = rarities.find((item) => item.id === values.rarity_id);
    const { data, error } = await supabase
      .from("cards")
      .insert({
        public_number: Number(values.public_number),
        character_id: values.character_id,
        collection_id: values.collection_id,
        rarity_id: values.rarity_id,
        edition_name: values.edition_name,
        description: values.description || null,
        xp_value: Number((values.xp_value || rarity?.default_xp) ?? 5),
        duplicate_value: Number((values.duplicate_value || rarity?.duplicate_value) ?? 2),
        draw_weight: Number((values.draw_weight || rarity?.default_weight) ?? 1),
        released_at: toIsoOrNull(values.released_at),
        ends_at: toIsoOrNull(values.ends_at),
        is_event_card: Boolean(values.is_event_card),
        frame_style: values.frame_style || "standard",
        animation_profile: values.animation_profile || "standard",
        display_order: Number(values.display_order || values.public_number),
      })
      .select("id")
      .single();

    if (error) setMessage(error.message);
    else {
      await recordAudit("card.create", "cards", data.id, { editionName: values.edition_name });
      setMessage("Carte creee.");
      cardForm.reset();
      await refreshCatalog();
    }
  }

  function editCollection(collection: CollectionRow) {
    setEditingCollectionId(collection.id);
    collectionForm.reset({
      name: collection.name,
      description: collection.description ?? "",
      primary_color: collection.primary_color,
      starts_at: toDateTimeLocal(collection.starts_at),
      ends_at: toDateTimeLocal(collection.ends_at),
      display_order: collection.display_order,
    });
  }

  function editCharacter(character: CharacterRow) {
    setEditingCharacterId(character.id);
    characterForm.reset({
      name: character.name,
      alias: character.alias ?? "",
      description: character.description ?? "",
      affiliation: character.affiliation ?? "",
    });
  }

  function editCard(card: CardRow) {
    setEditingCardId(card.id);
    cardForm.reset({
      public_number: card.public_number,
      character_id: card.character_id,
      collection_id: card.collection_id,
      rarity_id: card.rarity_id,
      edition_name: card.edition_name,
      description: card.description ?? "",
      xp_value: card.xp_value,
      duplicate_value: card.duplicate_value,
      draw_weight: card.draw_weight,
      released_at: toDateTimeLocal(card.released_at),
      ends_at: toDateTimeLocal(card.ends_at),
      is_event_card: card.is_event_card,
      frame_style: card.frame_style,
      animation_profile: card.animation_profile,
      display_order: card.display_order,
    });
  }

  async function saveCollection(values: CollectionForm) {
    if (!editingCollectionId) return;

    const { error } = await supabase
      .from("collections")
      .update({
        name: values.name,
        description: values.description || null,
        primary_color: values.primary_color,
        starts_at: toIsoOrNull(values.starts_at),
        ends_at: toIsoOrNull(values.ends_at),
        display_order: Number(values.display_order),
      })
      .eq("id", editingCollectionId);

    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit("collection.update", "collections", editingCollectionId, {
      name: values.name,
    });
    setMessage("Collection modifiee.");
    setEditingCollectionId(null);
    collectionForm.reset();
    await refreshCatalog();
  }

  async function saveCharacter(values: CharacterForm) {
    if (!editingCharacterId) return;

    const { error } = await supabase
      .from("characters")
      .update({
        name: values.name,
        alias: values.alias || null,
        description: values.description || null,
        affiliation: values.affiliation || null,
      })
      .eq("id", editingCharacterId);

    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit("character.update", "characters", editingCharacterId, { name: values.name });
    setMessage("Personnage modifie.");
    setEditingCharacterId(null);
    characterForm.reset();
    await refreshCatalog();
  }

  async function saveCard(values: CardForm) {
    if (!editingCardId) return;

    const { error } = await supabase
      .from("cards")
      .update({
        public_number: Number(values.public_number),
        character_id: values.character_id,
        collection_id: values.collection_id,
        rarity_id: values.rarity_id,
        edition_name: values.edition_name,
        description: values.description || null,
        xp_value: Number(values.xp_value),
        duplicate_value: Number(values.duplicate_value),
        draw_weight: Number(values.draw_weight),
        released_at: toIsoOrNull(values.released_at),
        ends_at: toIsoOrNull(values.ends_at),
        is_event_card: Boolean(values.is_event_card),
        frame_style: values.frame_style || "standard",
        animation_profile: values.animation_profile || "standard",
        display_order: Number(values.display_order),
      })
      .eq("id", editingCardId);

    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit("card.update", "cards", editingCardId, { editionName: values.edition_name });
    setMessage("Carte modifiee.");
    setEditingCardId(null);
    cardForm.reset();
    await refreshCatalog();
  }

  async function toggleActive(table: CatalogTable, id: string, isActive: boolean) {
    setBusyId(id);
    const { error } = await supabase.from(table).update({ is_active: !isActive }).eq("id", id);
    setBusyId(null);

    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit(`${table}.${isActive ? "deactivate" : "reactivate"}`, table, id, {});
    setMessage(isActive ? "Element desactive." : "Element reactive.");
    await refreshCatalog();
  }

  async function duplicateCard(card: CardRow) {
    const { data, error } = await supabase
      .from("cards")
      .insert({
        public_number: card.public_number + 1000,
        character_id: card.character_id,
        collection_id: card.collection_id,
        rarity_id: card.rarity_id,
        edition_name: `${card.edition_name} copie`,
        description: card.description,
        xp_value: card.xp_value,
        duplicate_value: card.duplicate_value,
        draw_weight: card.draw_weight,
        frame_style: card.frame_style,
        animation_profile: card.animation_profile,
        display_order: card.display_order + 1000,
        is_active: false,
        is_event_card: card.is_event_card,
      })
      .select("id")
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    await recordAudit("card.duplicate", "cards", data.id, { sourceCardId: card.id });
    setMessage("Carte dupliquee en brouillon inactif.");
    await refreshCatalog();
  }

  async function uploadAsset(
    table: "collections" | "cards",
    rowId: string,
    target: UploadTarget,
    bucket: "collection-covers" | "card-artworks" | "card-thumbnails",
    file: File | null,
    altText: string,
  ) {
    if (!file) return;

    setBusyId(`${rowId}-${target}`);
    const path = `${table}/${rowId}/${target}-${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const upload = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

    if (upload.error) {
      setBusyId(null);
      setMessage(upload.error.message);
      return;
    }

    const asset = await supabase
      .from("storage_assets")
      .insert({ bucket, path, alt_text: altText })
      .select("id")
      .single();

    if (asset.error) {
      setBusyId(null);
      setMessage(asset.error.message);
      return;
    }

    let update;
    if (table === "collections" && target === "cover_asset_id") {
      update = await supabase
        .from("collections")
        .update({ cover_asset_id: asset.data.id })
        .eq("id", rowId);
    } else if (table === "collections" && target === "banner_asset_id") {
      update = await supabase
        .from("collections")
        .update({ banner_asset_id: asset.data.id })
        .eq("id", rowId);
    } else if (table === "cards" && target === "artwork_asset_id") {
      update = await supabase
        .from("cards")
        .update({ artwork_asset_id: asset.data.id })
        .eq("id", rowId);
    } else if (table === "cards" && target === "thumbnail_asset_id") {
      update = await supabase
        .from("cards")
        .update({ thumbnail_asset_id: asset.data.id })
        .eq("id", rowId);
    } else {
      setBusyId(null);
      setMessage("Cible d'upload invalide.");
      return;
    }

    setBusyId(null);

    if (update.error) {
      setMessage(update.error.message);
      return;
    }

    await recordAudit(`${table}.asset_upload`, table, rowId, { bucket, target });
    setMessage("Asset ajoute.");
    await refreshCatalog();
  }

  const selectedPreview = cards.find((card) => card.id === editingCardId) ?? cards[0];
  const previewRarity = rarities.find((rarity) => rarity.id === selectedPreview?.rarity_id);

  return (
    <AdminShell>
      <header>
        <p className="text-sm font-black uppercase tracking-wide text-[#38BDF8]">Catalogue</p>
        <h1 className="mt-3 text-4xl font-black">Collections, personnages et cartes</h1>
      </header>
      {message ? (
        <p className="rounded-lg border border-[#2A3142] bg-[#111521] p-3 text-sm">{message}</p>
      ) : null}
      <section className="grid gap-4 lg:grid-cols-3">
        <form
          className="grid gap-4 rounded-lg border border-[#2A3142] bg-[#111521] p-5"
          onSubmit={(event) => {
            void collectionForm.handleSubmit(
              editingCollectionId ? saveCollection : createCollection,
            )(event);
          }}
        >
          <h2 className="text-lg font-black">
            {editingCollectionId ? "Modifier collection" : "Nouvelle collection"}
          </h2>
          <Field label="Nom">
            <TextInput {...collectionForm.register("name", { required: true })} />
          </Field>
          <Field label="Description">
            <TextArea {...collectionForm.register("description")} />
          </Field>
          <Field label="Couleur">
            <TextInput type="color" {...collectionForm.register("primary_color")} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Debut">
              <TextInput type="datetime-local" {...collectionForm.register("starts_at")} />
            </Field>
            <Field label="Fin">
              <TextInput type="datetime-local" {...collectionForm.register("ends_at")} />
            </Field>
          </div>
          <Field label="Ordre">
            <TextInput
              type="number"
              {...collectionForm.register("display_order", { valueAsNumber: true })}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <SubmitButton>{editingCollectionId ? "Enregistrer" : "Creer"}</SubmitButton>
            {editingCollectionId ? (
              <button
                className={buttonClass}
                onClick={() => {
                  setEditingCollectionId(null);
                  collectionForm.reset();
                }}
                type="button"
              >
                Annuler
              </button>
            ) : null}
          </div>
        </form>

        <form
          className="grid gap-4 rounded-lg border border-[#2A3142] bg-[#111521] p-5"
          onSubmit={(event) => {
            void characterForm.handleSubmit(editingCharacterId ? saveCharacter : createCharacter)(
              event,
            );
          }}
        >
          <h2 className="text-lg font-black">
            {editingCharacterId ? "Modifier personnage" : "Nouveau personnage"}
          </h2>
          <Field label="Nom">
            <TextInput {...characterForm.register("name", { required: true })} />
          </Field>
          <Field label="Alias">
            <TextInput {...characterForm.register("alias")} />
          </Field>
          <Field label="Affiliation">
            <TextInput {...characterForm.register("affiliation")} />
          </Field>
          <Field label="Description">
            <TextArea {...characterForm.register("description")} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <SubmitButton>{editingCharacterId ? "Enregistrer" : "Creer"}</SubmitButton>
            {editingCharacterId ? (
              <button
                className={buttonClass}
                onClick={() => {
                  setEditingCharacterId(null);
                  characterForm.reset();
                }}
                type="button"
              >
                Annuler
              </button>
            ) : null}
          </div>
        </form>

        <form
          className="grid gap-4 rounded-lg border border-[#2A3142] bg-[#111521] p-5"
          onSubmit={(event) => {
            void cardForm.handleSubmit(editingCardId ? saveCard : createCard)(event);
          }}
        >
          <h2 className="text-lg font-black">
            {editingCardId ? "Modifier carte" : "Nouvelle carte"}
          </h2>
          <Field label="Collection">
            <SelectInput {...cardForm.register("collection_id", { required: true })}>
              <option value="">Choisir</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Personnage">
            <SelectInput {...cardForm.register("character_id", { required: true })}>
              <option value="">Choisir</option>
              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Rarete">
            <SelectInput {...cardForm.register("rarity_id", { required: true })}>
              <option value="">Choisir</option>
              {rarities.map((rarity) => (
                <option key={rarity.id} value={rarity.id}>
                  {rarity.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Numero">
              <TextInput
                type="number"
                {...cardForm.register("public_number", { valueAsNumber: true })}
              />
            </Field>
            <Field label="Ordre">
              <TextInput
                type="number"
                {...cardForm.register("display_order", { valueAsNumber: true })}
              />
            </Field>
          </div>
          <Field label="Edition">
            <TextInput {...cardForm.register("edition_name", { required: true })} />
          </Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="XP">
              <TextInput
                type="number"
                {...cardForm.register("xp_value", { valueAsNumber: true })}
              />
            </Field>
            <Field label="Doublon">
              <TextInput
                type="number"
                {...cardForm.register("duplicate_value", { valueAsNumber: true })}
              />
            </Field>
            <Field label="Poids">
              <TextInput
                step="0.1"
                type="number"
                {...cardForm.register("draw_weight", { valueAsNumber: true })}
              />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Publication">
              <TextInput type="datetime-local" {...cardForm.register("released_at")} />
            </Field>
            <Field label="Fin">
              <TextInput type="datetime-local" {...cardForm.register("ends_at")} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Cadre">
              <TextInput {...cardForm.register("frame_style")} />
            </Field>
            <Field label="Animation">
              <TextInput {...cardForm.register("animation_profile")} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold text-[#A7B0C0]">
            <input type="checkbox" {...cardForm.register("is_event_card")} />
            Carte evenementielle
          </label>
          <Field label="Description">
            <TextArea {...cardForm.register("description")} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <SubmitButton>{editingCardId ? "Enregistrer" : "Creer"}</SubmitButton>
            {editingCardId ? (
              <button
                className={buttonClass}
                onClick={() => {
                  setEditingCardId(null);
                  cardForm.reset();
                }}
                type="button"
              >
                Annuler
              </button>
            ) : null}
          </div>
        </form>
      </section>

      {selectedPreview ? (
        <section className="rounded-lg border border-[#2A3142] bg-[#111521] p-5">
          <p className="text-sm font-black uppercase tracking-wide text-[#A7B0C0]">Apercu carte</p>
          <div
            className="mt-4 max-w-xs rounded-lg border p-4"
            style={{ borderColor: previewRarity?.color ?? "#38BDF8" }}
          >
            <div
              className="aspect-[3/4] rounded-lg border border-[#2A3142] bg-[#05070D]"
              style={{ boxShadow: `0 0 30px ${previewRarity?.color ?? "#38BDF8"}33` }}
            />
            <div className="mt-4">
              <p className="text-sm font-black text-[#A7B0C0]">#{selectedPreview.public_number}</p>
              <h2 className="text-2xl font-black">{selectedPreview.edition_name}</h2>
              <p className="mt-1 text-sm text-[#A7B0C0]">
                {previewRarity?.name ?? "Rarete"} - {selectedPreview.xp_value} XP
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-3">
        <h2 className="text-xl font-black">Collections</h2>
        {collections.map((collection) => (
          <article
            className="rounded-lg border border-[#2A3142] bg-[#111521] p-5"
            key={collection.id}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="h-5 w-5 rounded"
                  style={{ backgroundColor: collection.primary_color }}
                />
                <h2 className="font-black">{collection.name}</h2>
                <span className="rounded border border-[#2A3142] px-2 py-1 text-xs text-[#A7B0C0]">
                  {collection.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={buttonClass}
                  onClick={() => editCollection(collection)}
                  type="button"
                >
                  Modifier
                </button>
                <button
                  className={buttonClass}
                  disabled={busyId === collection.id}
                  onClick={() => {
                    void toggleActive("collections", collection.id, collection.is_active);
                  }}
                  type="button"
                >
                  {collection.is_active ? "Desactiver" : "Reactiver"}
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-[#A7B0C0]">{collection.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#A7B0C0]">
              <label className="grid gap-2">
                Cover
                <input
                  accept="image/avif,image/jpeg,image/png,image/webp"
                  disabled={busyId === `${collection.id}-cover_asset_id`}
                  onChange={(event) => {
                    void uploadAsset(
                      "collections",
                      collection.id,
                      "cover_asset_id",
                      "collection-covers",
                      event.target.files?.[0] ?? null,
                      `Cover ${collection.name}`,
                    );
                    event.currentTarget.value = "";
                  }}
                  type="file"
                />
              </label>
              <label className="grid gap-2">
                Banniere
                <input
                  accept="image/avif,image/jpeg,image/png,image/webp"
                  disabled={busyId === `${collection.id}-banner_asset_id`}
                  onChange={(event) => {
                    void uploadAsset(
                      "collections",
                      collection.id,
                      "banner_asset_id",
                      "collection-covers",
                      event.target.files?.[0] ?? null,
                      `Banniere ${collection.name}`,
                    );
                    event.currentTarget.value = "";
                  }}
                  type="file"
                />
              </label>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black">Personnages</h2>
        {characters.map((character) => (
          <article
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#2A3142] bg-[#111521] p-4"
            key={character.id}
          >
            <div>
              <span className="font-black">{character.name}</span>
              <span className="ml-3 text-sm text-[#A7B0C0]">
                {character.alias ?? character.affiliation ?? "Sans alias"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className={buttonClass}
                onClick={() => editCharacter(character)}
                type="button"
              >
                Modifier
              </button>
              <button
                className={buttonClass}
                disabled={busyId === character.id}
                onClick={() => {
                  void toggleActive("characters", character.id, character.is_active);
                }}
                type="button"
              >
                {character.is_active ? "Desactiver" : "Reactiver"}
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black">Cartes</h2>
        {cards.map((card) => (
          <article className="rounded-lg border border-[#2A3142] bg-[#111521] p-4" key={card.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-black">#{card.public_number}</span> {card.edition_name}
                <span className="ml-3 text-sm text-[#A7B0C0]">{card.xp_value} XP</span>
                <span className="ml-3 text-sm text-[#A7B0C0]">
                  {card.artwork_asset_id ? "Illustration OK" : "Sans illustration"}
                </span>
                <span className="ml-3 text-sm text-[#A7B0C0]">
                  {card.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className={buttonClass} onClick={() => editCard(card)} type="button">
                  Modifier
                </button>
                <button
                  className={buttonClass}
                  onClick={() => void duplicateCard(card)}
                  type="button"
                >
                  Dupliquer
                </button>
                <button
                  className={buttonClass}
                  disabled={busyId === card.id}
                  onClick={() => {
                    void toggleActive("cards", card.id, card.is_active);
                  }}
                  type="button"
                >
                  {card.is_active ? "Desactiver" : "Reactiver"}
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#A7B0C0]">
              <label className="grid gap-2">
                Illustration
                <input
                  accept="image/avif,image/jpeg,image/png,image/webp"
                  disabled={busyId === `${card.id}-artwork_asset_id`}
                  onChange={(event) => {
                    void uploadAsset(
                      "cards",
                      card.id,
                      "artwork_asset_id",
                      "card-artworks",
                      event.target.files?.[0] ?? null,
                      `Illustration ${card.edition_name}`,
                    );
                    event.currentTarget.value = "";
                  }}
                  type="file"
                />
              </label>
              <label className="grid gap-2">
                Miniature
                <input
                  accept="image/avif,image/jpeg,image/png,image/webp"
                  disabled={busyId === `${card.id}-thumbnail_asset_id`}
                  onChange={(event) => {
                    void uploadAsset(
                      "cards",
                      card.id,
                      "thumbnail_asset_id",
                      "card-thumbnails",
                      event.target.files?.[0] ?? null,
                      `Miniature ${card.edition_name}`,
                    );
                    event.currentTarget.value = "";
                  }}
                  type="file"
                />
              </label>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
