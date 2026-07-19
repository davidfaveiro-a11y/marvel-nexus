export type UserRole = "player" | "moderator" | "admin";

export type AccountStatus = "active" | "suspended" | "banned";

export type DuplicateConversionMode = "xp" | "fragments" | "xp_and_fragments";

export type DrawMode = "random" | "prefer_missing" | "strict_weights" | "pity";

export type RarityVisualEffect = "none" | "foil" | "pulse" | "cosmic" | "exclusive";

export interface Profile {
  id: string;
  username: string;
  avatarAssetId: string | null;
  status: AccountStatus;
  level: number;
  totalXp: number;
  currentXp: number;
  nextLevelXp: number;
  fragments: number;
  lastPackOpenedAt: string | null;
  nextPackAvailableAt: string | null;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  coverAssetId: string | null;
  bannerAssetId: string | null;
  primaryColor: string;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  displayOrder: number;
  totalCards: number;
}

export interface Character {
  id: string;
  name: string;
  alias: string | null;
  description: string | null;
  affiliation: string | null;
  isActive: boolean;
}

export interface Rarity {
  id: string;
  name: string;
  rank: number;
  color: string;
  borderStyle: string;
  visualEffect: RarityVisualEffect;
  defaultXp: number;
  duplicateValue: number;
  defaultWeight: number;
  isActive: boolean;
}

export interface Card {
  id: string;
  publicNumber: number;
  characterId: string;
  collectionId: string;
  rarityId: string;
  editionName: string;
  artworkAssetId: string | null;
  thumbnailAssetId: string | null;
  description: string | null;
  xpValue: number;
  duplicateValue: number;
  drawWeight: number;
  isActive: boolean;
  releasedAt: string | null;
  endsAt: string | null;
  isEventCard: boolean;
  frameStyle: string;
  animationProfile: string;
  displayOrder: number;
}

export interface PlayerCard {
  playerId: string;
  cardId: string;
  firstObtainedAt: string;
  lastObtainedAt: string;
  copies: number;
  isFavorite: boolean;
}

export interface PackOpeningResult {
  openingId: string;
  serverTime: string;
  nextPackAvailableAt: string;
  card: Card;
  rarity: Rarity;
  isDuplicate: boolean;
  copies: number;
  xpGained: number;
  fragmentsGained: number;
  levelBefore: number;
  levelAfter: number;
}
