import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows } from "../theme/tokens";

export function NexusPack({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.stage, compact ? styles.stageCompact : null]}>
      <View style={styles.auraGold} />
      <View style={styles.auraRed} />
      <View style={styles.floorShadow} />

      <View style={styles.backCardGold} />
      <View style={styles.backCardRed} />

      <View style={styles.pack}>
        <View style={styles.topTear}>
          {Array.from({ length: 7 }).map((_, index) => (
            <View key={index} style={styles.tearTooth} />
          ))}
        </View>

        <View style={styles.redBlade} />
        <View style={styles.goldBlade} />
        <View style={styles.blueBlade} />
        <View style={styles.gloss} />

        <View style={styles.header}>
          <View style={styles.headerLine} />
          <Text style={styles.headerText}>NEXUS</Text>
          <View style={styles.headerLine} />
        </View>

        <View style={styles.coreWrap}>
          <View style={styles.coreBurstOne} />
          <View style={styles.coreBurstTwo} />
          <View style={styles.coreBurstThree} />

          <View style={styles.sealedCard}>
            <View style={styles.cardTopAccent} />
            <View style={styles.cardGlow} />
            <View style={styles.cardSymbol}>
              <Text style={styles.cardSymbolText}>?</Text>
            </View>
            <View style={styles.cardBottomAccent} />
          </View>
        </View>

        <View style={styles.titlePanel}>
          <Text style={styles.dropTitle}>HERO DROP</Text>
          <Text style={styles.dropSub}>PACK SCELLE</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.rarityPips}>
            <View style={[styles.pip, { backgroundColor: colors.yellow }]} />
            <View style={[styles.pip, { backgroundColor: colors.red }]} />
            <View style={[styles.pip, { backgroundColor: colors.electric }]} />
          </View>
          <View style={styles.seal}>
            <Text style={styles.sealText}>N</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    aspectRatio: 0.72,
    justifyContent: "center",
    width: 198,
  },
  stageCompact: {
    width: 142,
  },
  auraGold: {
    backgroundColor: colors.yellow,
    borderRadius: 999,
    height: "72%",
    opacity: 0.16,
    position: "absolute",
    width: "82%",
  },
  auraRed: {
    backgroundColor: colors.red,
    borderRadius: 999,
    height: "54%",
    opacity: 0.2,
    position: "absolute",
    width: "68%",
  },
  floorShadow: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 999,
    bottom: 0,
    height: 24,
    position: "absolute",
    transform: [{ scaleX: 1.12 }],
    width: "72%",
  },
  backCardGold: {
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: "90%",
    position: "absolute",
    transform: [{ rotate: "5deg" }, { translateX: 8 }],
    width: "75%",
  },
  backCardRed: {
    backgroundColor: colors.crimson,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: "86%",
    position: "absolute",
    transform: [{ rotate: "-6deg" }, { translateX: -6 }, { translateY: 8 }],
    width: "72%",
  },
  pack: {
    ...shadows.ambient,
    backgroundColor: "#05070D",
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 3,
    height: "92%",
    overflow: "hidden",
    padding: 12,
    width: "77%",
  },
  topTear: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 8,
    zIndex: 3,
  },
  tearTooth: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 999,
    height: 4,
    width: 8,
  },
  redBlade: {
    backgroundColor: colors.crimson,
    height: "145%",
    left: -46,
    position: "absolute",
    top: -42,
    transform: [{ rotate: "18deg" }],
    width: "48%",
  },
  goldBlade: {
    backgroundColor: colors.yellow,
    height: "95%",
    opacity: 0.92,
    position: "absolute",
    right: -26,
    top: -18,
    transform: [{ rotate: "-16deg" }],
    width: "38%",
  },
  blueBlade: {
    backgroundColor: colors.electric,
    bottom: 8,
    height: "66%",
    opacity: 0.28,
    position: "absolute",
    right: 20,
    transform: [{ rotate: "18deg" }],
    width: 12,
  },
  gloss: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    height: "88%",
    position: "absolute",
    right: 36,
    top: -34,
    transform: [{ rotate: "18deg" }],
    width: 10,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 15,
  },
  headerLine: {
    backgroundColor: colors.yellow,
    borderRadius: 999,
    flex: 1,
    height: 2,
  },
  headerText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    textShadowColor: colors.red,
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 0,
  },
  coreWrap: {
    alignItems: "center",
    height: 128,
    justifyContent: "center",
    marginTop: 16,
  },
  coreBurstOne: {
    backgroundColor: colors.yellow,
    height: 112,
    opacity: 0.28,
    position: "absolute",
    transform: [{ rotate: "45deg" }],
    width: 112,
  },
  coreBurstTwo: {
    backgroundColor: colors.red,
    height: 104,
    opacity: 0.26,
    position: "absolute",
    transform: [{ rotate: "18deg" }],
    width: 104,
  },
  coreBurstThree: {
    backgroundColor: colors.electric,
    borderRadius: 999,
    height: 100,
    opacity: 0.16,
    position: "absolute",
    width: 100,
  },
  sealedCard: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderColor: colors.void,
    borderRadius: radius.md,
    borderWidth: 3,
    height: 118,
    justifyContent: "center",
    overflow: "hidden",
    transform: [{ rotate: "-4deg" }],
    width: 82,
  },
  cardTopAccent: {
    backgroundColor: colors.red,
    height: 44,
    left: -18,
    position: "absolute",
    top: -24,
    transform: [{ rotate: "35deg" }],
    width: 54,
  },
  cardGlow: {
    backgroundColor: colors.yellow,
    borderRadius: 999,
    height: 62,
    opacity: 0.22,
    position: "absolute",
    width: 62,
  },
  cardSymbol: {
    alignItems: "center",
    backgroundColor: colors.void,
    borderColor: colors.yellow,
    borderRadius: 999,
    borderWidth: 2,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  cardSymbolText: {
    color: colors.yellow,
    fontSize: 28,
    fontWeight: "900",
  },
  cardBottomAccent: {
    backgroundColor: colors.electric,
    bottom: -22,
    height: 44,
    position: "absolute",
    right: -16,
    transform: [{ rotate: "35deg" }],
    width: 52,
  },
  titlePanel: {
    alignItems: "center",
    backgroundColor: "rgba(5, 7, 13, 0.78)",
    borderColor: colors.text,
    borderRadius: radius.md,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  dropTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
    textShadowColor: colors.red,
    textShadowOffset: { height: 2, width: 2 },
    textShadowRadius: 0,
  },
  dropSub: {
    color: colors.yellow,
    fontSize: 9,
    fontWeight: "900",
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rarityPips: {
    flexDirection: "row",
    gap: 5,
  },
  pip: {
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 1,
    height: 10,
    width: 10,
  },
  seal: {
    alignItems: "center",
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 2,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  sealText: {
    color: colors.void,
    fontSize: 16,
    fontWeight: "900",
  },
});
