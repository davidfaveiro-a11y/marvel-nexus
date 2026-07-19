import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CardArtwork } from "../../components/CardArtwork";
import type { CardSummary } from "../../features/catalog/api";
import { fetchCards, fetchCollections, fetchOwnedCards } from "../../features/catalog/api";
import { colors, radius, shadows } from "../../theme/tokens";

type FilterMode = "all" | "owned" | "missing";

export default function CollectionsScreen() {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardSummary | null>(null);
  const collections = useQuery({ queryKey: ["collections"], queryFn: fetchCollections });
  const cards = useQuery({ queryKey: ["cards"], queryFn: fetchCards });
  const ownedCards = useQuery({ queryKey: ["owned-cards"], queryFn: fetchOwnedCards });

  const ownedByCardId = useMemo(() => {
    return new Map((ownedCards.data ?? []).map((card) => [card.card_id, card]));
  }, [ownedCards.data]);

  const collectionStats = useMemo(() => {
    return new Map(
      (collections.data ?? []).map((collection) => {
        const collectionCards = (cards.data ?? []).filter(
          (card) => card.collection_id === collection.id,
        );
        const ownedCount = collectionCards.filter((card) => ownedByCardId.has(card.id)).length;
        const progress =
          collectionCards.length === 0
            ? 0
            : Math.round((ownedCount / collectionCards.length) * 100);
        return [collection.id, { ownedCount, totalCount: collectionCards.length, progress }];
      }),
    );
  }, [cards.data, collections.data, ownedByCardId]);

  const filteredCards = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (cards.data ?? []).filter((card) => {
      const owned = ownedByCardId.has(card.id);
      const matchesCollection =
        selectedCollectionId === null || card.collection_id === selectedCollectionId;
      const matchesFilter =
        filterMode === "all" ||
        (filterMode === "owned" && owned) ||
        (filterMode === "missing" && !owned);
      const haystack = `${card.edition_name} ${card.characters?.name ?? ""} ${card.collections?.name ?? ""} ${
        card.rarities?.name ?? ""
      }`;
      const matchesSearch = !normalizedSearch || haystack.toLowerCase().includes(normalizedSearch);
      return matchesCollection && matchesFilter && matchesSearch;
    });
  }, [cards.data, filterMode, ownedByCardId, search, selectedCollectionId]);

  const selectedCollection = useMemo(() => {
    return (collections.data ?? []).find((collection) => collection.id === selectedCollectionId);
  }, [collections.data, selectedCollectionId]);

  return (
    <FlatList
      contentContainerStyle={styles.screen}
      data={filteredCards}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>Album heroique</Text>
            <Text style={styles.title}>Cartes</Text>
          </View>
          <TextInput
            onChangeText={setSearch}
            placeholder="Chercher un heros, une serie..."
            placeholderTextColor={colors.dim}
            style={styles.input}
            value={search}
          />
          <ScrollView
            contentContainerStyle={styles.collectionsStrip}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {(collections.data ?? []).map((collection) => {
              const stats = collectionStats.get(collection.id);
              const selected = selectedCollectionId === collection.id;
              return (
                <Pressable
                  accessibilityRole="button"
                  key={collection.id}
                  onPress={() => setSelectedCollectionId(selected ? null : collection.id)}
                  style={({ pressed }) => [
                    styles.collectionCard,
                    selected ? styles.collectionCardActive : null,
                    pressed ? styles.pressedCard : null,
                  ]}
                >
                  <View
                    style={[styles.collectionBlast, { backgroundColor: collection.primary_color }]}
                  />
                  <View style={styles.collectionHead}>
                    <View style={[styles.swatch, { backgroundColor: collection.primary_color }]} />
                    <View style={styles.cardText}>
                      <Text numberOfLines={1} style={styles.collectionName}>
                        {collection.name}
                      </Text>
                      <Text style={styles.description}>
                        {stats?.ownedCount ?? 0}/{stats?.totalCount ?? 0} cartes
                      </Text>
                    </View>
                    <Text style={styles.progressValue}>{stats?.progress ?? 0}%</Text>
                  </View>
                  <ProgressBar color={collection.primary_color} value={stats?.progress ?? 0} />
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.filterBar}>
            {(["all", "owned", "missing"] as const).map((mode) => (
              <Pressable
                accessibilityRole="button"
                key={mode}
                onPress={() => setFilterMode(mode)}
                style={[
                  styles.filterButton,
                  filterMode === mode ? styles.filterButtonActive : null,
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.filterText, filterMode === mode ? styles.filterTextActive : null]}
                >
                  {mode === "all" ? "Toutes" : mode === "owned" ? "Debloquees" : "A trouver"}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.subtitle}>
            {filteredCards.length} cartes
            {selectedCollection ? ` / ${selectedCollection.name}` : " dans l'album"}
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const owned = ownedByCardId.get(item.id);
        const rarityColor = item.rarities?.color ?? colors.lineStrong;
        return (
          <Pressable
            accessibilityRole="button"
            onPress={() => setSelectedCard(item)}
            style={({ pressed }) => [
              styles.cardRow,
              !owned ? styles.lockedCard : null,
              pressed ? styles.pressedCard : null,
            ]}
          >
            <View style={[styles.cardRarityFrame, { borderColor: rarityColor }]}>
              <CardArtwork
                accentColor={rarityColor}
                assetId={owned ? item.artwork_asset_id : null}
                height={76}
                width={54}
              />
            </View>
            <View style={styles.cardText}>
              <View style={styles.cardTopLine}>
                <Text style={styles.publicNumber}>#{item.public_number}</Text>
                <View style={[styles.rarityPill, { borderColor: rarityColor }]}>
                  <Text style={[styles.rarityText, { color: rarityColor }]}>
                    {item.rarities?.name ?? "Rarete"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.collectionPill,
                    { borderColor: item.collections?.primary_color ?? colors.lineStrong },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.collectionPillText,
                      { color: item.collections?.primary_color ?? colors.muted },
                    ]}
                  >
                    {item.collections?.name ?? "Collection"}
                  </Text>
                </View>
              </View>
              <Text numberOfLines={2} style={styles.name}>
                {item.edition_name}
              </Text>
              <Text numberOfLines={1} style={styles.description}>
                {item.characters?.name ?? "Heros"} / {item.xp_value} XP
              </Text>
            </View>
            <View style={owned ? styles.ownedBadge : styles.missingBadge}>
              <Text style={owned ? styles.ownedBadgeText : styles.missingBadgeText}>
                {owned ? `x${owned.copies}` : "--"}
              </Text>
            </View>
          </Pressable>
        );
      }}
      ListFooterComponent={
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          owned={selectedCard ? ownedByCardId.get(selectedCard.id) : undefined}
        />
      }
    />
  );
}

function ProgressBar({ color, value }: { color: string; value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { backgroundColor: color, width: `${value}%` }]} />
    </View>
  );
}

function CardDetailModal({
  card,
  onClose,
  owned,
}: {
  card: CardSummary | null;
  onClose: () => void;
  owned?: { copies: number; first_obtained_at: string; last_obtained_at: string };
}) {
  const rarityColor = card?.rarities?.color ?? colors.electric;

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={Boolean(card)}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalPanel}>
          {card ? (
            <>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleBlock}>
                  <Text style={styles.modalKicker}>
                    #{card.public_number} / {card.collections?.name ?? "Collection"}
                  </Text>
                  <Text numberOfLines={2} style={styles.modalTitle}>
                    {card.edition_name}
                  </Text>
                </View>
                <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeText}>X</Text>
                </Pressable>
              </View>
              <View style={styles.modalBody}>
                <View style={[styles.modalArtworkFrame, { borderColor: rarityColor }]}>
                  <CardArtwork
                    accentColor={rarityColor}
                    assetId={owned ? card.artwork_asset_id : null}
                    height={260}
                    width={186}
                  />
                </View>
                <View style={styles.detailGrid}>
                  <Detail label="Personnage" value={card.characters?.name ?? "Personnage"} />
                  <Detail
                    label="Rarete"
                    value={card.rarities?.name ?? "Rarete"}
                    color={rarityColor}
                  />
                  <Detail label="XP" value={`${card.xp_value}`} />
                  <Detail label="Copies" value={owned ? `${owned.copies}` : "Manquante"} />
                </View>
                <Text style={styles.modalDescription}>
                  {owned
                    ? (card.description ?? "Aucune description pour cette carte.")
                    : "Encore dans l'ombre. Garde l'emplacement, le prochain booster peut tout changer."}
                </Text>
                {owned ? (
                  <Text style={styles.modalMeta}>
                    Obtenue le {new Date(owned.first_obtained_at).toLocaleDateString("fr-FR")} /
                    derniere copie le {new Date(owned.last_obtained_at).toLocaleDateString("fr-FR")}
                  </Text>
                ) : null}
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function Detail({ color, label, value }: { color?: string; label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.detailValue, color ? { color } : null]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignSelf: "center",
    backgroundColor: colors.void,
    gap: 12,
    maxWidth: 430,
    padding: 18,
    paddingBottom: 36,
    width: "100%",
  },
  header: { gap: 14 },
  titleBlock: { gap: 4 },
  kicker: { color: colors.yellow, fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    textShadowColor: colors.red,
    textShadowOffset: { height: 2, width: 2 },
    textShadowRadius: 0,
  },
  subtitle: { color: colors.yellow, fontSize: 18, fontWeight: "900" },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    borderWidth: 2,
    color: colors.text,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  collectionsStrip: { gap: 10, paddingRight: 18 },
  collectionCard: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.text,
    borderRadius: radius.md,
    borderWidth: 2,
    gap: 12,
    overflow: "hidden",
    padding: 14,
    width: 232,
  },
  collectionCardActive: {
    borderColor: colors.yellow,
    shadowColor: colors.yellow,
    shadowOpacity: 0.32,
    shadowRadius: 10,
  },
  collectionBlast: {
    height: "160%",
    opacity: 0.34,
    position: "absolute",
    right: -42,
    top: -42,
    transform: [{ rotate: "-22deg" }],
    width: 100,
  },
  collectionHead: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  swatch: {
    borderColor: colors.text,
    borderRadius: 10,
    borderWidth: 2,
    height: 42,
    width: 14,
  },
  cardText: { flex: 1, gap: 5 },
  collectionName: { color: colors.text, fontSize: 17, fontWeight: "900" },
  description: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  progressValue: { color: colors.platinum, fontSize: 16, fontWeight: "900" },
  progressTrack: {
    backgroundColor: colors.void,
    borderRadius: 999,
    height: 7,
    overflow: "hidden",
  },
  progressFill: { borderRadius: 999, height: 7 },
  filterBar: {
    backgroundColor: colors.surface,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    padding: 4,
  },
  filterButton: {
    alignItems: "center",
    borderRadius: radius.sm,
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
  },
  filterButtonActive: {
    backgroundColor: colors.crimson,
    borderColor: colors.yellow,
    borderWidth: 1,
  },
  filterText: { color: colors.muted, fontSize: 13, fontWeight: "900" },
  filterTextActive: { color: colors.text },
  cardRow: {
    ...shadows.ambient,
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    borderWidth: 2,
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    overflow: "hidden",
    padding: 12,
  },
  pressedCard: { transform: [{ scale: 0.99 }] },
  lockedCard: { opacity: 0.66 },
  cardRarityFrame: {
    backgroundColor: colors.void,
    borderRadius: radius.sm,
    borderWidth: 1,
    padding: 4,
  },
  cardTopLine: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  publicNumber: { color: colors.yellow, fontSize: 12, fontWeight: "900" },
  rarityPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rarityText: { fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  collectionPill: {
    borderRadius: 999,
    borderWidth: 1,
    flexShrink: 1,
    maxWidth: 104,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  collectionPillText: { fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  name: { color: colors.text, fontSize: 17, fontWeight: "900", lineHeight: 21 },
  ownedBadge: {
    alignItems: "center",
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderWidth: 2,
    borderRadius: 999,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  missingBadge: {
    alignItems: "center",
    borderColor: colors.lineStrong,
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  ownedBadgeText: { color: colors.void, fontSize: 13, fontWeight: "900" },
  missingBadgeText: { color: colors.dim, fontSize: 13, fontWeight: "900" },
  modalBackdrop: {
    backgroundColor: "rgba(3, 4, 10, 0.9)",
    flex: 1,
    justifyContent: "flex-end",
  },
  modalPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.red,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 2,
    maxHeight: "92%",
    padding: 18,
  },
  modalHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  modalTitleBlock: { flex: 1, gap: 4 },
  modalKicker: {
    color: colors.yellow,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  modalTitle: { color: colors.text, fontSize: 25, fontWeight: "900", lineHeight: 30 },
  closeButton: {
    alignItems: "center",
    borderColor: colors.lineStrong,
    borderRadius: 999,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  closeText: { color: colors.text, fontSize: 13, fontWeight: "900" },
  modalBody: { alignItems: "center", gap: 16, paddingTop: 18 },
  modalArtworkFrame: {
    ...shadows.glowBlue,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 6,
  },
  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, width: "100%" },
  detailItem: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexBasis: "47%",
    flexGrow: 1,
    gap: 5,
    padding: 12,
  },
  detailLabel: { color: colors.muted, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  detailValue: { color: colors.text, fontSize: 16, fontWeight: "900" },
  modalDescription: { color: colors.text, fontSize: 15, lineHeight: 22, textAlign: "center" },
  modalMeta: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center" },
});
