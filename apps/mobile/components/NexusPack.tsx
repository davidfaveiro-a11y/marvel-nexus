import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { colors, radius, shadows } from "../theme/tokens";

const ultimateSpiderManImage =
  "https://cdn.marvel.com/content/2x/ultimate_spider-man_3_cover_card.webp";

export function NexusPack({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.stage, compact ? styles.stageCompact : null]}>
      <View style={styles.shadow} />
      <View style={styles.goldPlate} />
      <View style={styles.redPlate} />
      <View style={styles.pack}>
        <Image
          accessibilityLabel="Ultimate Spider-Man"
          contentFit="cover"
          contentPosition={{ left: "50%", top: "0%" }}
          source={{ uri: ultimateSpiderManImage }}
          style={styles.image}
        />
        <View style={styles.glass} />
        <View style={styles.innerLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    aspectRatio: 0.72,
    justifyContent: "center",
    width: 194,
  },
  stageCompact: {
    width: 140,
  },
  shadow: {
    backgroundColor: "rgba(0, 0, 0, 0.52)",
    borderRadius: 999,
    bottom: 0,
    height: 24,
    position: "absolute",
    transform: [{ scaleX: 1.08 }],
    width: "72%",
  },
  goldPlate: {
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: "91%",
    position: "absolute",
    transform: [{ rotate: "4deg" }, { translateX: 6 }],
    width: "76%",
  },
  redPlate: {
    backgroundColor: colors.crimson,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: "88%",
    position: "absolute",
    transform: [{ rotate: "-5deg" }, { translateX: -5 }, { translateY: 7 }],
    width: "73%",
  },
  pack: {
    ...shadows.ambient,
    backgroundColor: colors.void,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 3,
    height: "92%",
    overflow: "hidden",
    width: "76%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  glass: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    height: "82%",
    position: "absolute",
    right: 28,
    top: -38,
    transform: [{ rotate: "18deg" }],
    width: 12,
  },
  innerLine: {
    borderColor: "rgba(255, 228, 92, 0.7)",
    borderRadius: radius.md,
    borderWidth: 1,
    bottom: 8,
    left: 8,
    position: "absolute",
    right: 8,
    top: 8,
  },
});
