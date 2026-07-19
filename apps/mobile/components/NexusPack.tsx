import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows } from "../theme/tokens";

export function NexusPack({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.frame, compact ? styles.frameCompact : null]}>
      <View style={styles.backGlow} />
      <View style={styles.backPlateRed} />
      <View style={styles.backPlateGold} />
      <View style={styles.shadowCard} />
      <View style={styles.pack}>
        <View style={styles.foilBase} />
        <View style={styles.redSlashWide} />
        <View style={styles.redSlashThin} />
        <View style={styles.goldSlash} />
        <View style={styles.bluePanel} />
        <View style={styles.whiteGlint} />
        <View style={styles.cornerCutTop} />
        <View style={styles.cornerCutBottom} />

        <View style={styles.topBand}>
          <Text style={styles.marvelTag}>PRIVATE DROP</Text>
          <View style={styles.issueBadge}>
            <Text style={styles.issueText}>#01</Text>
          </View>
        </View>

        <View style={styles.titleStack}>
          <Text style={styles.packLabel}>NEXUS</Text>
          <Text style={styles.subLabel}>HERO SERIES</Text>
        </View>

        <View style={styles.heroMedallion}>
          <View style={styles.medallionGlow} />
          <View style={styles.medallionRing} />
          <Text style={styles.medallionN}>N</Text>
          <View style={styles.lightningLeft} />
          <View style={styles.lightningRight} />
        </View>

        <View style={styles.heroDropBadge}>
          <Text style={styles.heroDrop}>HERO DROP</Text>
        </View>
        <Text style={styles.collectorText}>1 CARTE GARANTIE</Text>

        <View style={styles.bottomBlock}>
          <View style={styles.barcode}>
            {Array.from({ length: 8 }).map((_, index) => (
              <View
                key={index}
                style={[styles.barcodeLine, index % 3 === 0 ? styles.barcodeLineTall : null]}
              />
            ))}
          </View>
          <View style={styles.powerPips}>
            <View style={[styles.powerPip, { backgroundColor: colors.yellow }]} />
            <View style={[styles.powerPip, { backgroundColor: colors.red }]} />
            <View style={[styles.powerPip, { backgroundColor: colors.electric }]} />
          </View>
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
    width: 188,
  },
  frameCompact: {
    width: 136,
  },
  backGlow: {
    backgroundColor: colors.yellow,
    borderRadius: 999,
    height: "72%",
    opacity: 0.18,
    position: "absolute",
    transform: [{ scaleX: 0.86 }],
    width: "86%",
  },
  backPlateRed: {
    backgroundColor: colors.crimson,
    borderColor: colors.yellow,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: "91%",
    position: "absolute",
    transform: [{ rotate: "-8deg" }, { translateY: 8 }],
    width: "74%",
  },
  backPlateGold: {
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: "86%",
    opacity: 0.95,
    position: "absolute",
    transform: [{ rotate: "6deg" }, { translateX: 7 }],
    width: "70%",
  },
  shadowCard: {
    backgroundColor: "rgba(0, 0, 0, 0.42)",
    borderRadius: radius.lg,
    bottom: 12,
    height: "82%",
    position: "absolute",
    transform: [{ rotate: "3deg" }],
    width: "72%",
  },
  pack: {
    ...shadows.ambient,
    backgroundColor: colors.panel,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 3,
    height: "94%",
    overflow: "hidden",
    padding: 12,
    width: "80%",
  },
  foilBase: {
    backgroundColor: colors.blue,
    bottom: 0,
    left: 0,
    opacity: 0.92,
    position: "absolute",
    right: 0,
    top: 0,
  },
  redSlashWide: {
    backgroundColor: colors.crimson,
    height: "136%",
    left: -40,
    position: "absolute",
    top: -30,
    transform: [{ rotate: "19deg" }],
    width: "50%",
  },
  redSlashThin: {
    backgroundColor: colors.red,
    height: "120%",
    opacity: 0.86,
    position: "absolute",
    right: 28,
    top: -22,
    transform: [{ rotate: "19deg" }],
    width: 10,
  },
  goldSlash: {
    backgroundColor: colors.yellow,
    height: "64%",
    opacity: 0.98,
    position: "absolute",
    right: -26,
    top: -18,
    transform: [{ rotate: "-22deg" }],
    width: "48%",
  },
  bluePanel: {
    backgroundColor: "rgba(0, 212, 255, 0.18)",
    borderColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: radius.md,
    borderWidth: 1,
    bottom: 46,
    left: 12,
    position: "absolute",
    right: 12,
    top: 70,
  },
  whiteGlint: {
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    height: "76%",
    opacity: 0.85,
    position: "absolute",
    right: 28,
    top: -38,
    transform: [{ rotate: "22deg" }],
    width: 10,
  },
  cornerCutTop: {
    backgroundColor: colors.text,
    height: 42,
    left: -20,
    position: "absolute",
    top: -24,
    transform: [{ rotate: "45deg" }],
    width: 42,
  },
  cornerCutBottom: {
    backgroundColor: colors.yellow,
    bottom: -24,
    height: 44,
    position: "absolute",
    right: -22,
    transform: [{ rotate: "45deg" }],
    width: 44,
  },
  topBand: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 24,
  },
  marvelTag: {
    backgroundColor: colors.text,
    borderRadius: 4,
    color: colors.crimson,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  issueBadge: {
    alignItems: "center",
    backgroundColor: colors.void,
    borderColor: colors.yellow,
    borderRadius: 999,
    borderWidth: 1,
    height: 26,
    justifyContent: "center",
    width: 26,
  },
  issueText: {
    color: colors.yellow,
    fontSize: 9,
    fontWeight: "900",
  },
  titleStack: {
    marginTop: 13,
  },
  packLabel: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "900",
    textShadowColor: colors.void,
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 0,
  },
  subLabel: {
    color: colors.yellow,
    fontSize: 10,
    fontWeight: "900",
    marginTop: -2,
    textTransform: "uppercase",
  },
  heroMedallion: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(5, 7, 13, 0.84)",
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 3,
    height: 88,
    justifyContent: "center",
    marginTop: 16,
    width: 88,
  },
  medallionGlow: {
    ...shadows.glowBlue,
    backgroundColor: "rgba(255, 228, 92, 0.34)",
    borderRadius: 999,
    height: 66,
    position: "absolute",
    width: 66,
  },
  medallionRing: {
    borderColor: colors.yellow,
    borderRadius: 999,
    borderWidth: 2,
    height: 62,
    opacity: 0.9,
    position: "absolute",
    width: 62,
  },
  medallionN: {
    color: colors.text,
    fontSize: 38,
    fontWeight: "900",
    textShadowColor: colors.red,
    textShadowOffset: { height: 2, width: 2 },
    textShadowRadius: 0,
  },
  lightningLeft: {
    backgroundColor: colors.yellow,
    height: 28,
    left: 18,
    position: "absolute",
    top: 31,
    transform: [{ rotate: "28deg" }],
    width: 5,
  },
  lightningRight: {
    backgroundColor: colors.electric,
    height: 28,
    position: "absolute",
    right: 18,
    top: 31,
    transform: [{ rotate: "28deg" }],
    width: 5,
  },
  heroDropBadge: {
    alignSelf: "center",
    backgroundColor: colors.void,
    borderColor: colors.text,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroDrop: {
    color: colors.yellow,
    fontSize: 12,
    fontWeight: "900",
  },
  collectorText: {
    alignSelf: "center",
    color: colors.text,
    fontSize: 8,
    fontWeight: "900",
    marginTop: 6,
    opacity: 0.78,
  },
  bottomBlock: {
    alignItems: "flex-end",
    bottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 12,
    position: "absolute",
    right: 12,
  },
  barcode: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 2,
    height: 20,
  },
  barcodeLine: {
    backgroundColor: colors.text,
    height: 12,
    opacity: 0.86,
    width: 2,
  },
  barcodeLineTall: {
    height: 18,
  },
  powerPips: {
    flexDirection: "row",
    gap: 4,
  },
  powerPip: {
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 1,
    height: 9,
    width: 9,
  },
});
