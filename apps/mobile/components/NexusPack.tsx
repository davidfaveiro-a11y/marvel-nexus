import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows } from "../theme/tokens";

const heroImages = [
  {
    name: "Iron Man",
    uri: "https://cdn.marvel.com/content/2x/002irm_ons_mas_mob_01_0.webp",
  },
  {
    name: "Spider-Man",
    uri: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg",
  },
  {
    name: "Wolverine",
    uri: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/717-wolverine.jpg",
  },
];

export function NexusPack({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.stage, compact ? styles.stageCompact : null]}>
      <View style={styles.shadow} />
      <View style={styles.goldBackplate} />
      <View style={styles.pack}>
        <View style={styles.topStripe}>
          <Text style={styles.marvelText}>MARVEL NEXUS</Text>
        </View>

        <View style={styles.heroStrip}>
          {heroImages.map((hero, index) => (
            <View
              key={hero.name}
              style={[
                styles.heroFrame,
                index === 1 ? styles.heroFrameCenter : null,
                index === 0 ? styles.heroFrameLeft : null,
                index === 2 ? styles.heroFrameRight : null,
              ]}
            >
              <Image
                accessibilityLabel={hero.name}
                contentFit="cover"
                contentPosition="top center"
                source={{ uri: hero.uri }}
                style={styles.heroImage}
              />
              <View style={styles.heroShade} />
            </View>
          ))}
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.packTitle}>HERO PACK</Text>
          <Text style={styles.packSubtitle}>Premium Drop</Text>
        </View>

        <View style={styles.bottomPanel}>
          <View>
            <Text style={styles.smallLabel}>1 carte garantie</Text>
            <Text style={styles.smallMuted}>Rarete aleatoire</Text>
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
    aspectRatio: 0.74,
    justifyContent: "center",
    width: 198,
  },
  stageCompact: {
    width: 142,
  },
  shadow: {
    backgroundColor: "rgba(0, 0, 0, 0.48)",
    borderRadius: 999,
    bottom: 0,
    height: 24,
    position: "absolute",
    transform: [{ scaleX: 1.12 }],
    width: "74%",
  },
  goldBackplate: {
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 2,
    height: "90%",
    position: "absolute",
    transform: [{ rotate: "4deg" }, { translateX: 6 }],
    width: "75%",
  },
  pack: {
    ...shadows.ambient,
    backgroundColor: "#080A12",
    borderColor: colors.text,
    borderRadius: radius.lg,
    borderWidth: 3,
    height: "93%",
    overflow: "hidden",
    width: "78%",
  },
  topStripe: {
    alignItems: "center",
    backgroundColor: colors.crimson,
    borderBottomColor: colors.yellow,
    borderBottomWidth: 2,
    minHeight: 36,
    justifyContent: "center",
  },
  marvelText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    textShadowColor: colors.void,
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 0,
  },
  heroStrip: {
    height: 132,
    marginHorizontal: 10,
    marginTop: 12,
    position: "relative",
  },
  heroFrame: {
    backgroundColor: colors.panel,
    borderColor: colors.yellow,
    borderRadius: radius.md,
    borderWidth: 2,
    bottom: 0,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    width: 68,
  },
  heroFrameLeft: {
    left: 0,
    transform: [{ rotate: "-7deg" }, { translateY: 10 }],
  },
  heroFrameCenter: {
    alignSelf: "center",
    left: "50%",
    marginLeft: -38,
    top: -8,
    width: 76,
    zIndex: 3,
  },
  heroFrameRight: {
    right: 0,
    transform: [{ rotate: "7deg" }, { translateY: 10 }],
  },
  heroImage: {
    height: "100%",
    width: "100%",
  },
  heroShade: {
    backgroundColor: "rgba(3, 4, 10, 0.18)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  titleBlock: {
    alignItems: "center",
    borderBottomColor: colors.lineStrong,
    borderTopColor: colors.lineStrong,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 10,
  },
  packTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    textShadowColor: colors.red,
    textShadowOffset: { height: 2, width: 2 },
    textShadowRadius: 0,
  },
  packSubtitle: {
    color: colors.yellow,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
    textTransform: "uppercase",
  },
  bottomPanel: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  smallLabel: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  smallMuted: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 3,
  },
  seal: {
    alignItems: "center",
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 2,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  sealText: {
    color: colors.void,
    fontSize: 17,
    fontWeight: "900",
  },
});
