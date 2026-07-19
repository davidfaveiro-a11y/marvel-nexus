import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchLeaderboard } from "../../features/player/api";
import { colors, radius, shadows } from "../../theme/tokens";

export default function LeaderboardScreen() {
  const leaderboard = useQuery({ queryKey: ["leaderboard"], queryFn: fetchLeaderboard });
  const players = leaderboard.data ?? [];

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.titleBlock}>
        <Text style={styles.kicker}>Classement</Text>
        <Text style={styles.title}>Top joueurs</Text>
      </View>

      <View style={styles.podium}>
        <View style={styles.podiumBlast} />
        {players.slice(0, 3).map((player) => (
          <View style={styles.podiumRow} key={player.id}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>#{player.rank}</Text>
            </View>
            <View style={styles.playerText}>
              <Text numberOfLines={1} style={styles.playerName}>
                {player.username}
              </Text>
              <Text style={styles.playerMeta}>
                Niveau {player.level} / {player.uniqueCards} cartes
              </Text>
            </View>
            <Text style={styles.xpText}>{player.totalXp} XP</Text>
          </View>
        ))}
        {players.length === 0 ? <Text style={styles.muted}>Aucun joueur classe.</Text> : null}
      </View>

      <View style={styles.list}>
        {players.slice(3).map((player) => (
          <View style={styles.playerRow} key={player.id}>
            <Text style={styles.rankText}>#{player.rank}</Text>
            <View style={styles.playerText}>
              <Text numberOfLines={1} style={styles.playerName}>
                {player.username}
              </Text>
              <Text style={styles.playerMeta}>
                Niveau {player.level} / {player.uniqueCards} cartes debloquees /{" "}
                {player.totalCopies} copies
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
  podium: {
    ...shadows.ambient,
    backgroundColor: colors.blue,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: 12,
    overflow: "hidden",
    padding: 16,
  },
  podiumBlast: {
    backgroundColor: colors.yellow,
    height: 190,
    opacity: 0.92,
    position: "absolute",
    right: -72,
    top: -52,
    transform: [{ rotate: "-22deg" }],
    width: 150,
  },
  podiumRow: {
    alignItems: "center",
    backgroundColor: "rgba(5, 7, 13, 0.42)",
    borderColor: "rgba(246, 248, 251, 0.42)",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 68,
    padding: 12,
  },
  rankBadge: {
    alignItems: "center",
    backgroundColor: colors.crimson,
    borderColor: colors.yellow,
    borderRadius: 999,
    borderWidth: 2,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  rankBadgeText: { color: colors.text, fontSize: 14, fontWeight: "900" },
  playerText: { flex: 1, gap: 4, minWidth: 0 },
  playerName: { color: colors.text, fontSize: 18, fontWeight: "900" },
  playerMeta: { color: colors.muted, fontSize: 12, fontWeight: "800", lineHeight: 16 },
  xpText: { color: colors.yellow, fontSize: 13, fontWeight: "900" },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  list: { gap: 10 },
  playerRow: {
    alignItems: "center",
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    borderWidth: 2,
    flexDirection: "row",
    gap: 12,
    minHeight: 72,
    padding: 14,
  },
  rankText: { color: colors.yellow, fontSize: 16, fontWeight: "900", width: 42 },
});
