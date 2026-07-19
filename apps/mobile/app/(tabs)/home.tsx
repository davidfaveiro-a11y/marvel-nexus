import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CardArtwork } from "../../components/CardArtwork";
import { NexusPack } from "../../components/NexusPack";
import { PrimaryButton } from "../../components/PrimaryButton";
import { fetchCards } from "../../features/catalog/api";
import { openFreePack } from "../../features/pack/api";
import type { PackResult } from "../../features/pack/api";
import { fetchPlayerStats, fetchProfile } from "../../features/player/api";
import { usePreferencesStore } from "../../store/preferences";
import { colors, radius, shadows } from "../../theme/tokens";

function formatCountdown(target: string | null, now: number) {
  if (!target) return "Disponible";
  const remaining = new Date(target).getTime() - now;
  if (remaining <= 0) return "Disponible";

  const totalSeconds = Math.ceil(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export default function HomeScreen() {
  const [lastResult, setLastResult] = useState<PackResult | null>(null);
  const [now, setNow] = useState(Date.now());
  const queryClient = useQueryClient();
  const preferences = usePreferencesStore();
  const revealProgress = useSharedValue(0);
  const profile = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const stats = useQuery({ queryKey: ["player-stats"], queryFn: fetchPlayerStats });
  const cards = useQuery({ queryKey: ["cards"], queryFn: fetchCards });

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    revealProgress.value = withTiming(lastResult ? 1 : 0, {
      duration: preferences.reduceMotion ? 0 : 520,
    });
  }, [lastResult, preferences.reduceMotion, revealProgress]);

  const nextPackAt =
    lastResult?.nextPackAvailableAt ?? profile.data?.next_pack_available_at ?? null;
  const countdown = formatCountdown(nextPackAt, now);
  const packAvailable = countdown === "Disponible";
  const xpPercent = profile.data
    ? Math.min(100, Math.round((profile.data.current_xp / profile.data.next_level_xp) * 100))
    : 0;
  const resultCard = useMemo(() => {
    return lastResult?.card?.id
      ? cards.data?.find((card) => card.id === lastResult.card?.id)
      : null;
  }, [cards.data, lastResult]);

  const revealStyle = useAnimatedStyle(() => ({
    opacity: revealProgress.value,
    transform: [
      { translateY: 18 - revealProgress.value * 18 },
      { scale: 0.96 + revealProgress.value * 0.04 },
    ],
  }));

  const openPack = useMutation({
    mutationFn: openFreePack,
    async onSuccess(data) {
      setLastResult(data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["owned-cards"] }),
        queryClient.invalidateQueries({ queryKey: ["player-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["recent-openings"] }),
        queryClient.invalidateQueries({ queryKey: ["cards"] }),
      ]);
      if (preferences.hapticsEnabled) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    async onError(error) {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      Alert.alert(
        "Pack indisponible",
        error.message.replace("pack_not_available:", "Disponible a "),
      );
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.heroRedSlash} />
        <View style={styles.heroYellowSlash} />
        <View style={styles.heroCopy}>
          <View style={styles.brandRow}>
            <Text style={styles.kicker}>Drop du jour</Text>
            <View style={styles.statusChip}>
              <Text style={styles.statusText}>{packAvailable ? "Pret" : "En charge"}</Text>
            </View>
          </View>
          <Text style={styles.title}>Marvel Nexus</Text>
          <View style={styles.playerLine}>
            <View style={styles.monogram}>
              <Text style={styles.monogramText}>
                {profile.data?.username?.slice(0, 2).toUpperCase() ?? "MN"}
              </Text>
            </View>
            <View style={styles.playerMeta}>
              <Text numberOfLines={1} style={styles.playerName}>
                {profile.data?.username ?? "Joueur"}
              </Text>
              <Text style={styles.playerLevel}>Niveau {profile.data?.level ?? 1}</Text>
            </View>
          </View>
          <ProgressBar value={xpPercent} />
          <Text style={styles.muted}>
            {profile.data?.current_xp ?? 0}/{profile.data?.next_level_xp ?? 100} XP
          </Text>
        </View>
        <View style={styles.packStage}>
          <NexusPack />
        </View>
      </View>

      <View style={styles.claimPanel}>
        <View style={styles.claimHeader}>
          <View>
            <Text style={styles.panelKicker}>Prochain tirage</Text>
            <Text style={styles.countdown}>{countdown}</Text>
          </View>
          <View style={styles.energyPip}>
            <Text style={styles.energyText}>N</Text>
          </View>
        </View>
        <PrimaryButton
          disabled={!packAvailable || openPack.isPending}
          onPress={() => openPack.mutate()}
        >
          {openPack.isPending
            ? "Ouverture..."
            : packAvailable
              ? "Ouvrir le booster"
              : "Booster en charge"}
        </PrimaryButton>
      </View>

      {lastResult ? (
        <Animated.View
          style={[
            styles.result,
            { borderColor: lastResult.rarity?.color ?? colors.electric },
            revealStyle,
          ]}
        >
          <View style={styles.resultHeader}>
            <Text style={styles.resultKicker}>
              {lastResult.isDuplicate ? "Doublon converti" : "Nouvelle carte"}
            </Text>
            <Text style={styles.resultRarity}>{lastResult.rarity?.name ?? "Rarete"}</Text>
          </View>
          <View style={styles.revealRow}>
            <CardArtwork
              accentColor={lastResult.rarity?.color ?? colors.red}
              assetId={resultCard?.artwork_asset_id ?? null}
              height={196}
              width={140}
            />
            <View style={styles.revealText}>
              <Text numberOfLines={3} style={styles.resultTitle}>
                {lastResult.card?.editionName ?? "Carte obtenue"}
              </Text>
              <Text style={styles.resultMeta}>x{lastResult.copies ?? 1}</Text>
              <Text style={styles.resultGain}>
                +{lastResult.xpGained ?? 0} XP
                {lastResult.fragmentsGained ? `  +${lastResult.fragmentsGained} fragments` : ""}
              </Text>
              <Text style={styles.resultMeta}>
                {new Date(lastResult.nextPackAvailableAt).toLocaleString("fr-FR")}
              </Text>
            </View>
          </View>
        </Animated.View>
      ) : null}

      <View style={styles.metricsGrid}>
        <Metric
          label="Heros trouves"
          value={`${stats.data?.uniqueCards ?? 0}/${stats.data?.totalCards ?? 0}`}
        />
        <Metric
          label="Album rempli"
          value={`${stats.data?.completionPercent ?? 0}%`}
          accent="gold"
        />
        <Metric label="Doubles" value={`${stats.data?.totalCopies ?? 0}`} />
        <Metric label="Top rarete" value={stats.data?.highestRarity ?? "-"} accent="violet" />
      </View>

    </ScrollView>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
  );
}

function Metric({
  accent = "blue",
  label,
  value,
}: {
  accent?: "blue" | "gold" | "violet";
  label: string;
  value: string;
}) {
  const accentColor =
    accent === "gold" ? colors.gold : accent === "violet" ? colors.violet : colors.electric;
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricLine, { backgroundColor: accentColor }]} />
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>
        {value}
      </Text>
      <Text numberOfLines={2} style={styles.metricLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignSelf: "center",
    backgroundColor: colors.void,
    gap: 16,
    maxWidth: 430,
    padding: 18,
    paddingBottom: 36,
    width: "100%",
  },
  hero: {
    ...shadows.ambient,
    backgroundColor: colors.blue,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: 16,
    overflow: "hidden",
    padding: 18,
  },
  heroRedSlash: {
    backgroundColor: colors.crimson,
    height: 340,
    left: -78,
    position: "absolute",
    top: -80,
    transform: [{ rotate: "22deg" }],
    width: 168,
  },
  heroYellowSlash: {
    backgroundColor: colors.yellow,
    height: 170,
    opacity: 0.96,
    position: "absolute",
    right: -60,
    top: 18,
    transform: [{ rotate: "-18deg" }],
    width: 140,
  },
  heroCopy: {
    gap: 12,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  kicker: {
    color: colors.yellow,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  statusChip: {
    backgroundColor: colors.void,
    borderColor: colors.yellow,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: colors.yellow,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "900",
    textShadowColor: colors.void,
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 0,
  },
  playerLine: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  monogram: {
    alignItems: "center",
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: 18,
    borderWidth: 2,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  monogramText: { color: colors.void, fontSize: 16, fontWeight: "900" },
  playerMeta: { flex: 1, gap: 3 },
  playerName: { color: colors.text, fontSize: 18, fontWeight: "900" },
  playerLevel: { color: colors.muted, fontSize: 13, fontWeight: "800" },
  packStage: {
    alignItems: "center",
    backgroundColor: "rgba(5, 7, 13, 0.64)",
    borderColor: colors.yellow,
    borderRadius: radius.lg,
    borderWidth: 2,
    minHeight: 276,
    justifyContent: "center",
    overflow: "hidden",
    paddingVertical: 16,
  },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  progressTrack: {
    backgroundColor: "rgba(5, 7, 13, 0.5)",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  progressFill: { backgroundColor: colors.yellow, borderRadius: 999, height: 8 },
  claimPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.red,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: 16,
    padding: 18,
  },
  claimHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  panelKicker: {
    color: colors.yellow,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  countdown: { color: colors.text, fontSize: 36, fontWeight: "900" },
  energyPip: {
    alignItems: "center",
    backgroundColor: colors.crimson,
    borderColor: colors.yellow,
    borderRadius: 999,
    borderWidth: 2,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  energyText: { color: colors.text, fontSize: 18, fontWeight: "900" },
  result: {
    ...shadows.glowBlue,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  resultHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultKicker: {
    color: colors.yellow,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  resultRarity: { color: colors.platinum, fontSize: 12, fontWeight: "900" },
  revealRow: { alignItems: "center", flexDirection: "row", gap: 16 },
  revealText: { flex: 1, gap: 8 },
  resultTitle: { color: colors.text, fontSize: 24, fontWeight: "900", lineHeight: 28 },
  resultMeta: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  resultGain: { color: colors.yellow, fontSize: 14, fontWeight: "900" },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metricCard: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    borderWidth: 1,
    flexBasis: "47%",
    flexGrow: 1,
    gap: 6,
    minHeight: 92,
    overflow: "hidden",
    padding: 14,
  },
  metricLine: {
    borderRadius: 999,
    height: 3,
    opacity: 0.9,
    width: 34,
  },
  metricValue: { color: colors.text, fontSize: 23, fontWeight: "900" },
  metricLabel: { color: colors.muted, fontSize: 12, fontWeight: "800", lineHeight: 16 },
  historyPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  openingRow: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    gap: 4,
    paddingTop: 12,
  },
  openingDate: { color: colors.text, fontSize: 14, fontWeight: "800" },
  openingGain: { color: colors.muted, fontSize: 13 },
});
