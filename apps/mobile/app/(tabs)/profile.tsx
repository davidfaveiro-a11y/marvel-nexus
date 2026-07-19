import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NexusPack } from "../../components/NexusPack";
import { fetchPlayerStats, fetchProfile, fetchRecentOpenings } from "../../features/player/api";
import { colors, radius, shadows } from "../../theme/tokens";

export default function ProfileScreen() {
  const profile = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const stats = useQuery({ queryKey: ["player-stats"], queryFn: fetchPlayerStats });
  const openings = useQuery({ queryKey: ["recent-openings"], queryFn: fetchRecentOpenings });
  const xpPercent = profile.data
    ? Math.min(100, Math.round((profile.data.current_xp / profile.data.next_level_xp) * 100))
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.titleBlock}>
        <Text style={styles.kicker}>QG du joueur</Text>
        <Text style={styles.title}>Profil</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroBlast} />
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.data?.username?.slice(0, 2).toUpperCase() ?? "MN"}
            </Text>
          </View>
        </View>
        <View style={styles.heroText}>
          <Text numberOfLines={1} style={styles.username}>
            {profile.data?.username ?? "Session requise"}
          </Text>
          <Text style={styles.muted}>
            Membre depuis{" "}
            {profile.data?.created_at
              ? new Date(profile.data.created_at).toLocaleDateString("fr-FR")
              : "-"}
          </Text>
        </View>
        <NexusPack compact />
      </View>

      <View style={styles.progressPanel}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.panelKicker}>Progression</Text>
            <Text style={styles.level}>Niveau {profile.data?.level ?? 1}</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeValue}>{profile.data?.total_xp ?? 0}</Text>
            <Text style={styles.xpBadgeLabel}>XP</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${xpPercent}%` }]} />
        </View>
        <Text style={styles.muted}>
          {profile.data?.current_xp ?? 0}/{profile.data?.next_level_xp ?? 100} XP
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <Metric
          label="Heros trouves"
          value={`${stats.data?.uniqueCards ?? 0}/${stats.data?.totalCards ?? 0}`}
        />
        <Metric label="Album rempli" value={`${stats.data?.completionPercent ?? 0}%`} tone="gold" />
        <Metric label="Doubles" value={`${stats.data?.totalCopies ?? 0}`} />
        <Metric label="Fragments" value={`${profile.data?.fragments ?? 0}`} tone="violet" />
        <Metric label="Top rarete" value={stats.data?.highestRarity ?? "-"} wide />
      </View>

      <View style={styles.historyPanel}>
        <Text style={styles.panelKicker}>Derniers drops</Text>
        {(openings.data ?? []).length === 0 ? (
          <Text style={styles.muted}>Aucun booster ouvert.</Text>
        ) : (
          (openings.data ?? []).map((opening) => (
            <View style={styles.historyRow} key={opening.id}>
              <Text style={styles.historyDate}>
                {new Date(opening.opened_at).toLocaleString("fr-FR")}
              </Text>
              <Text style={styles.muted}>
                +{opening.xp_gained} XP
                {opening.fragments_gained ? `  +${opening.fragments_gained} fragments` : ""}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function Metric({
  label,
  tone = "blue",
  value,
  wide = false,
}: {
  label: string;
  tone?: "blue" | "gold" | "violet";
  value: string;
  wide?: boolean;
}) {
  const accent =
    tone === "gold" ? colors.gold : tone === "violet" ? colors.violet : colors.electric;
  return (
    <View style={[styles.metricCard, wide ? styles.metricWide : null]}>
      <View style={[styles.metricLine, { backgroundColor: accent }]} />
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
  hero: {
    ...shadows.ambient,
    alignItems: "center",
    backgroundColor: colors.blue,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 2,
    flexDirection: "row",
    gap: 14,
    overflow: "hidden",
    padding: 16,
  },
  heroBlast: {
    backgroundColor: colors.yellow,
    height: 170,
    opacity: 0.9,
    position: "absolute",
    right: -54,
    top: -42,
    transform: [{ rotate: "-24deg" }],
    width: 120,
  },
  avatarRing: {
    alignItems: "center",
    backgroundColor: colors.red,
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 2,
    height: 66,
    justifyContent: "center",
    width: 66,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 2,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  avatarText: { color: colors.void, fontSize: 17, fontWeight: "900" },
  heroText: { flex: 1, gap: 5, minWidth: 0 },
  username: { color: colors.text, fontSize: 22, fontWeight: "900" },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  progressPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.red,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: 14,
    padding: 18,
  },
  progressHeader: {
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
  level: { color: colors.text, fontSize: 24, fontWeight: "900" },
  xpBadge: {
    alignItems: "center",
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.yellow,
    borderRadius: radius.md,
    borderWidth: 1,
    minWidth: 76,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  xpBadgeValue: { color: colors.yellow, fontSize: 17, fontWeight: "900" },
  xpBadgeLabel: { color: colors.muted, fontSize: 10, fontWeight: "900" },
  progressTrack: {
    backgroundColor: colors.surfaceHigh,
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  progressFill: { backgroundColor: colors.yellow, borderRadius: 999, height: 8 },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metricCard: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    borderWidth: 2,
    flexBasis: "47%",
    flexGrow: 1,
    gap: 6,
    minHeight: 94,
    padding: 14,
  },
  metricWide: { flexBasis: "100%" },
  metricLine: { borderRadius: 999, height: 3, width: 34 },
  metricValue: { color: colors.text, fontSize: 23, fontWeight: "900" },
  metricLabel: { color: colors.muted, fontSize: 12, fontWeight: "800", lineHeight: 16 },
  historyPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.lineStrong,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  historyRow: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    gap: 4,
    paddingTop: 12,
  },
  historyDate: { color: colors.text, fontSize: 14, fontWeight: "800" },
});
