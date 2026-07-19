import { fetchCards, fetchOwnedCards } from "../catalog/api";
import { supabase } from "../../lib/supabase";

export interface ProfileSummary {
  id: string;
  username: string;
  level: number;
  total_xp: number;
  current_xp: number;
  next_level_xp: number;
  fragments: number;
  next_pack_available_at: string | null;
  created_at: string;
}

export interface PlayerStats {
  uniqueCards: number;
  totalCards: number;
  totalCopies: number;
  completionPercent: number;
  highestRarity: string | null;
}

export interface RecentOpeningSummary {
  id: string;
  opened_at: string;
  xp_gained: number;
  fragments_gained: number;
}

export interface LeaderboardPlayer {
  id: string;
  rank: number;
  username: string;
  level: number;
  totalXp: number;
  uniqueCards: number;
  totalCopies: number;
}

export async function fetchProfile(): Promise<ProfileSummary | null> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id,username,level,total_xp,current_xp,next_level_xp,fragments,next_pack_available_at,created_at",
    )
    .eq("id", user.user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchPlayerStats(): Promise<PlayerStats> {
  const [cards, ownedCards] = await Promise.all([fetchCards(), fetchOwnedCards()]);
  const ownedIds = new Set(ownedCards.map((card) => card.card_id));
  const highestOwned = cards
    .filter((card) => ownedIds.has(card.id))
    .sort((a, b) => (b.rarities?.rank ?? 0) - (a.rarities?.rank ?? 0))[0];
  const totalCopies = ownedCards.reduce((sum, card) => sum + card.copies, 0);

  return {
    uniqueCards: ownedCards.length,
    totalCards: cards.length,
    totalCopies,
    completionPercent:
      cards.length === 0 ? 0 : Math.round((ownedCards.length / cards.length) * 100),
    highestRarity: highestOwned?.rarities?.name ?? null,
  };
}

export async function fetchRecentOpenings(): Promise<RecentOpeningSummary[]> {
  const { data, error } = await supabase
    .from("pack_openings")
    .select("id,opened_at,xp_gained,fragments_gained")
    .order("opened_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data ?? [];
}

export async function fetchLeaderboard(): Promise<LeaderboardPlayer[]> {
  const [profilesResult, cardsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,username,level,total_xp,hide_leaderboard_stats")
      .eq("hide_leaderboard_stats", false),
    supabase.from("player_cards").select("player_id,card_id,copies"),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  if (cardsResult.error) throw cardsResult.error;

  const cardStats = new Map<string, { totalCopies: number; uniqueCards: Set<string> }>();
  for (const card of cardsResult.data ?? []) {
    const current = cardStats.get(card.player_id) ?? { totalCopies: 0, uniqueCards: new Set() };
    current.totalCopies += card.copies;
    current.uniqueCards.add(card.card_id);
    cardStats.set(card.player_id, current);
  }

  return (profilesResult.data ?? [])
    .map((profile) => {
      const stats = cardStats.get(profile.id);
      return {
        id: profile.id,
        level: profile.level,
        rank: 0,
        totalCopies: stats?.totalCopies ?? 0,
        totalXp: profile.total_xp,
        uniqueCards: stats?.uniqueCards.size ?? 0,
        username: profile.username,
      };
    })
    .sort((a, b) => {
      return (
        b.level - a.level ||
        b.uniqueCards - a.uniqueCards ||
        b.totalXp - a.totalXp ||
        String(a.username).localeCompare(String(b.username))
      );
    })
    .map((player, index) => ({ ...player, rank: index + 1 }));
}
