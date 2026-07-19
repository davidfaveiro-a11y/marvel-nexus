import * as Crypto from "expo-crypto";
import { supabase } from "../../lib/supabase";

export interface PackResult {
  openingId: string;
  serverTime: string;
  nextPackAvailableAt: string;
  card?: {
    id: string;
    publicNumber: number;
    editionName: string;
    description: string | null;
    xpValue: number;
    duplicateValue: number;
  };
  rarity?: {
    id: string;
    name: string;
    rank: number;
    color: string;
    visualEffect: string;
  };
  isDuplicate?: boolean;
  copies?: number;
  xpGained?: number;
  fragmentsGained?: number;
  levelBefore?: number;
  levelAfter?: number;
  idempotent?: boolean;
}

export async function openFreePack(): Promise<PackResult> {
  const { data, error } = await supabase.rpc("open_free_pack", {
    idempotency_key: Crypto.randomUUID(),
  });

  if (error) throw error;
  return (data ?? {}) as PackResult;
}
