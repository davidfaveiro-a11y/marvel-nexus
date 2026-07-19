import { supabase } from "../../lib/supabase";

export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  primary_color: string;
  display_order: number;
}

export interface CardSummary {
  id: string;
  public_number: number;
  edition_name: string;
  description: string | null;
  xp_value: number;
  collection_id: string;
  artwork_asset_id: string | null;
  characters?: { name: string } | null;
  collections?: { display_order: number; name: string; primary_color: string } | null;
  rarities?: { name: string; color: string; rank: number } | null;
}

export interface OwnedCardSummary {
  card_id: string;
  copies: number;
  is_favorite: boolean;
  first_obtained_at: string;
  last_obtained_at: string;
}

export async function fetchCollections(): Promise<CollectionSummary[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("id,name,description,primary_color,display_order")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchCards(): Promise<CardSummary[]> {
  const { data, error } = await supabase
    .from("cards")
    .select(
      "id,public_number,edition_name,description,xp_value,collection_id,artwork_asset_id,characters(name),collections(name,primary_color,display_order),rarities(name,color,rank)",
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? [])
    .map((card) => ({
      ...card,
      characters: Array.isArray(card.characters) ? card.characters[0] : card.characters,
      collections: Array.isArray(card.collections) ? card.collections[0] : card.collections,
      rarities: Array.isArray(card.rarities) ? card.rarities[0] : card.rarities,
    }))
    .sort((a, b) => {
      const collectionOrder =
        (a.collections?.display_order ?? 0) - (b.collections?.display_order ?? 0);
      return collectionOrder || a.public_number - b.public_number;
    });
}

export async function fetchOwnedCards(): Promise<OwnedCardSummary[]> {
  const { data, error } = await supabase
    .from("player_cards")
    .select("card_id,copies,is_favorite,first_obtained_at,last_obtained_at")
    .order("last_obtained_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createSignedAssetUrl(assetId: string): Promise<string | null> {
  const { data: asset, error: assetError } = await supabase
    .from("storage_assets")
    .select("bucket,path,alt_text")
    .eq("id", assetId)
    .single();

  if (assetError) throw assetError;

  if (asset.bucket === "remote-url" || /^https?:\/\//.test(asset.path)) {
    return asset.path;
  }

  const { data, error } = await supabase.storage
    .from(asset.bucket)
    .createSignedUrl(asset.path, 60 * 60);

  if (error) throw error;
  return data.signedUrl;
}
