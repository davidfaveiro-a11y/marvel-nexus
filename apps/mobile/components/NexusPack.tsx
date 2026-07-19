import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows } from "../theme/tokens";

export function NexusPack({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.stage, compact ? styles.stageCompact : null]}>
      <View style={styles.auraOuter} />
      <View style={styles.auraInner} />
      <View style={styles.floorShadow} />

      <View style={styles.capsuleBack}>
        <View style={styles.backStripeOne} />
        <View style={styles.backStripeTwo} />
      </View>

      <View style={styles.capsule}>
        <View style={styles.sideRailLeft} />
        <View style={styles.sideRailRight} />

        <View style={styles.topClamp}>
          <View style={styles.clampBolt} />
          <Text style={styles.dropText}>DROP</Text>
          <View style={styles.clampBolt} />
        </View>

        <View style={styles.window}>
          <View style={styles.windowGlow} />
          <View style={styles.scanLineTop} />
          <View style={styles.scanLineBottom} />

          <View style={styles.sealedCard}>
            <View style={styles.cardCornerTop} />
            <View style={styles.cardCornerBottom} />
            <View style={styles.cardPanel}>
              <View style={styles.heroSignal} />
              <Text style={styles.heroN}>N</Text>
            </View>
            <View style={styles.cardNamePlate}>
              <Text style={styles.cardNameText}>HERO LOCK</Text>
            </View>
          </View>

          <View style={styles.energyArcLeft} />
          <View style={styles.energyArcRight} />
        </View>

        <View style={styles.lockRow}>
          <View style={styles.lockPlate}>
            <View style={styles.lockCore}>
              <Text style={styles.lockText}>01</Text>
            </View>
          </View>
          <View style={styles.statusPanel}>
            <Text style={styles.statusText}>NEXUS VAULT</Text>
            <View style={styles.statusBars}>
              <View style={[styles.statusBar, { backgroundColor: colors.yellow, width: "82%" }]} />
              <View style={[styles.statusBar, { backgroundColor: colors.electric, width: "58%" }]} />
              <View style={[styles.statusBar, { backgroundColor: colors.red, width: "70%" }]} />
            </View>
          </View>
        </View>

        <View style={styles.bottomClamp}>
          <View style={styles.pipGroup}>
            <View style={[styles.pip, { backgroundColor: colors.red }]} />
            <View style={[styles.pip, { backgroundColor: colors.yellow }]} />
            <View style={[styles.pip, { backgroundColor: colors.electric }]} />
          </View>
          <Text style={styles.openText}>TAP TO OPEN</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    aspectRatio: 0.78,
    justifyContent: "center",
    width: 204,
  },
  stageCompact: {
    width: 148,
  },
  auraOuter: {
    backgroundColor: colors.electric,
    borderRadius: 999,
    height: "76%",
    opacity: 0.14,
    position: "absolute",
    width: "92%",
  },
  auraInner: {
    backgroundColor: colors.yellow,
    borderRadius: 999,
    height: "48%",
    opacity: 0.18,
    position: "absolute",
    width: "58%",
  },
  floorShadow: {
    backgroundColor: "rgba(0, 0, 0, 0.48)",
    borderRadius: 999,
    bottom: 2,
    height: 22,
    position: "absolute",
    transform: [{ scaleX: 1.18 }],
    width: "72%",
  },
  capsuleBack: {
    backgroundColor: colors.crimson,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: "86%",
    overflow: "hidden",
    position: "absolute",
    transform: [{ rotate: "-4deg" }],
    width: "72%",
  },
  backStripeOne: {
    backgroundColor: colors.yellow,
    height: "140%",
    left: 18,
    opacity: 0.9,
    position: "absolute",
    top: -42,
    transform: [{ rotate: "17deg" }],
    width: 18,
  },
  backStripeTwo: {
    backgroundColor: colors.electric,
    height: "140%",
    opacity: 0.55,
    position: "absolute",
    right: 28,
    top: -42,
    transform: [{ rotate: "17deg" }],
    width: 10,
  },
  capsule: {
    ...shadows.ambient,
    backgroundColor: colors.panel,
    borderColor: colors.yellow,
    borderRadius: radius.lg,
    borderWidth: 3,
    height: "92%",
    overflow: "hidden",
    padding: 12,
    width: "78%",
  },
  sideRailLeft: {
    backgroundColor: colors.red,
    bottom: 18,
    left: 0,
    position: "absolute",
    top: 18,
    width: 6,
  },
  sideRailRight: {
    backgroundColor: colors.electric,
    bottom: 18,
    opacity: 0.75,
    position: "absolute",
    right: 0,
    top: 18,
    width: 6,
  },
  topClamp: {
    alignItems: "center",
    backgroundColor: colors.void,
    borderColor: colors.text,
    borderRadius: radius.md,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 34,
    paddingHorizontal: 10,
  },
  clampBolt: {
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 1,
    height: 10,
    width: 10,
  },
  dropText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    textShadowColor: colors.red,
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 0,
  },
  window: {
    alignItems: "center",
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    borderColor: colors.lineStrong,
    borderRadius: radius.lg,
    borderWidth: 2,
    flex: 1,
    justifyContent: "center",
    marginTop: 12,
    overflow: "hidden",
  },
  windowGlow: {
    backgroundColor: colors.electric,
    borderRadius: 999,
    height: 132,
    opacity: 0.2,
    position: "absolute",
    width: 132,
  },
  scanLineTop: {
    backgroundColor: "rgba(255, 228, 92, 0.42)",
    height: 3,
    left: 12,
    position: "absolute",
    right: 12,
    top: 20,
  },
  scanLineBottom: {
    backgroundColor: "rgba(255, 255, 255, 0.24)",
    bottom: 24,
    height: 2,
    left: 26,
    position: "absolute",
    right: 26,
  },
  sealedCard: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderColor: colors.void,
    borderRadius: radius.md,
    borderWidth: 3,
    height: 132,
    justifyContent: "center",
    overflow: "hidden",
    transform: [{ rotate: "-3deg" }],
    width: 92,
  },
  cardCornerTop: {
    backgroundColor: colors.red,
    height: 56,
    left: -20,
    position: "absolute",
    top: -28,
    transform: [{ rotate: "38deg" }],
    width: 56,
  },
  cardCornerBottom: {
    backgroundColor: colors.yellow,
    bottom: -30,
    height: 64,
    position: "absolute",
    right: -22,
    transform: [{ rotate: "38deg" }],
    width: 64,
  },
  cardPanel: {
    alignItems: "center",
    backgroundColor: colors.void,
    borderColor: colors.electric,
    borderRadius: radius.md,
    borderWidth: 2,
    height: 76,
    justifyContent: "center",
    width: 62,
  },
  heroSignal: {
    backgroundColor: colors.yellow,
    borderRadius: 999,
    height: 46,
    opacity: 0.2,
    position: "absolute",
    width: 46,
  },
  heroN: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "900",
  },
  cardNamePlate: {
    backgroundColor: colors.void,
    borderRadius: 5,
    bottom: 10,
    left: 10,
    paddingVertical: 3,
    position: "absolute",
    right: 10,
  },
  cardNameText: {
    color: colors.yellow,
    fontSize: 8,
    fontWeight: "900",
    textAlign: "center",
  },
  energyArcLeft: {
    borderColor: colors.yellow,
    borderLeftWidth: 4,
    borderRadius: 999,
    borderTopWidth: 4,
    height: 62,
    left: 12,
    position: "absolute",
    transform: [{ rotate: "-38deg" }],
    width: 62,
  },
  energyArcRight: {
    borderBottomWidth: 4,
    borderColor: colors.red,
    borderRadius: 999,
    borderRightWidth: 4,
    height: 62,
    position: "absolute",
    right: 12,
    transform: [{ rotate: "-38deg" }],
    width: 62,
  },
  lockRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  lockPlate: {
    alignItems: "center",
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: radius.md,
    borderWidth: 2,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  lockCore: {
    alignItems: "center",
    backgroundColor: colors.void,
    borderRadius: 999,
    height: 26,
    justifyContent: "center",
    width: 26,
  },
  lockText: {
    color: colors.yellow,
    fontSize: 10,
    fontWeight: "900",
  },
  statusPanel: {
    flex: 1,
    gap: 4,
  },
  statusText: {
    color: colors.text,
    fontSize: 9,
    fontWeight: "900",
  },
  statusBars: {
    gap: 3,
  },
  statusBar: {
    borderRadius: 999,
    height: 4,
  },
  bottomClamp: {
    alignItems: "center",
    backgroundColor: colors.void,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    minHeight: 30,
    paddingHorizontal: 8,
  },
  pipGroup: {
    flexDirection: "row",
    gap: 4,
  },
  pip: {
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 1,
    height: 8,
    width: 8,
  },
  openText: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: "900",
  },
});
