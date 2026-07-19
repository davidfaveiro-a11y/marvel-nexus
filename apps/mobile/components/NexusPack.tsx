import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows } from "../theme/tokens";

export function NexusPack({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.frame, compact ? styles.frameCompact : null]}>
      <View style={styles.backPlate} />
      <View style={styles.pack}>
        <View style={styles.redSlash} />
        <View style={styles.yellowSlash} />
        <View style={styles.topRail} />
        <Text style={styles.packLabel}>NEXUS</Text>
        <View style={styles.accentLeft} />
        <View style={styles.accentRight} />
        <View style={styles.core}>
          <View style={styles.coreGlow} />
          <View style={styles.coreMark} />
        </View>
        <Text style={styles.heroDrop}>HERO DROP</Text>
        <View style={styles.nexusLine} />
        <View style={styles.bottomBlock}>
          <View style={styles.tinyBar} />
          <View style={[styles.tinyBar, styles.tinyBarShort]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: "center",
    aspectRatio: 0.72,
    justifyContent: "center",
    width: 170,
  },
  frameCompact: {
    width: 126,
  },
  backPlate: {
    backgroundColor: colors.red,
    borderColor: colors.yellow,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: "88%",
    position: "absolute",
    transform: [{ rotate: "-7deg" }],
    width: "72%",
  },
  pack: {
    ...shadows.ambient,
    backgroundColor: colors.blue,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: "92%",
    overflow: "hidden",
    padding: 14,
    width: "78%",
  },
  redSlash: {
    backgroundColor: colors.crimson,
    height: "130%",
    left: -28,
    position: "absolute",
    top: -22,
    transform: [{ rotate: "18deg" }],
    width: "46%",
  },
  yellowSlash: {
    backgroundColor: colors.yellow,
    height: "58%",
    opacity: 0.98,
    position: "absolute",
    right: -20,
    top: -12,
    transform: [{ rotate: "-24deg" }],
    width: "42%",
  },
  topRail: {
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 4,
    opacity: 0.55,
    width: "58%",
  },
  packLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10,
    textShadowColor: colors.void,
    textShadowOffset: { height: 2, width: 2 },
    textShadowRadius: 0,
  },
  accentLeft: {
    backgroundColor: colors.cyan,
    height: "72%",
    left: -16,
    opacity: 0.45,
    position: "absolute",
    top: 26,
    transform: [{ rotate: "23deg" }],
    width: 18,
  },
  accentRight: {
    backgroundColor: colors.rose,
    height: "58%",
    opacity: 0.5,
    position: "absolute",
    right: -12,
    top: 48,
    transform: [{ rotate: "23deg" }],
    width: 16,
  },
  core: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(5, 7, 13, 0.76)",
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 1,
    height: 74,
    justifyContent: "center",
    marginTop: 18,
    width: 74,
  },
  coreGlow: {
    ...shadows.glowBlue,
    backgroundColor: "rgba(255, 228, 92, 0.28)",
    borderRadius: 999,
    height: 52,
    position: "absolute",
    width: 52,
  },
  coreMark: {
    borderBottomColor: colors.yellow,
    borderBottomWidth: 3,
    borderLeftColor: colors.yellow,
    borderLeftWidth: 3,
    height: 28,
    transform: [{ rotate: "45deg" }],
    width: 28,
  },
  heroDrop: {
    alignSelf: "center",
    backgroundColor: colors.void,
    borderColor: colors.text,
    borderRadius: 6,
    borderWidth: 1,
    color: colors.yellow,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 16,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  nexusLine: {
    alignSelf: "center",
    backgroundColor: colors.red,
    borderRadius: 999,
    height: 3,
    marginTop: 28,
    opacity: 0.9,
    width: "68%",
  },
  bottomBlock: {
    bottom: 18,
    gap: 8,
    left: 16,
    position: "absolute",
    right: 16,
  },
  tinyBar: {
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 5,
    width: "80%",
  },
  tinyBarShort: {
    opacity: 0.8,
    width: "52%",
  },
});
