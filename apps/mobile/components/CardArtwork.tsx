import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { createSignedAssetUrl } from "../features/catalog/api";
import { colors, radius } from "../theme/tokens";

export function CardArtwork({
  accentColor = colors.red,
  assetId,
  height = 58,
  width = 42,
}: {
  accentColor?: string;
  assetId: string | null;
  height?: number;
  width?: number;
}) {
  const signedUrl = useQuery({
    enabled: Boolean(assetId),
    queryKey: ["asset-url", assetId],
    queryFn: () => createSignedAssetUrl(assetId ?? ""),
    staleTime: 45 * 60 * 1000,
  });

  if (!assetId || !signedUrl.data) {
    return (
      <View style={[styles.placeholder, { height, width }]}>
        <View style={[styles.heroPanel, { backgroundColor: accentColor }]} />
        <View style={styles.sunburstOne} />
        <View style={styles.sunburstTwo} />
        <View style={styles.halftoneRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <View style={styles.mask}>
          <View style={[styles.maskEye, { backgroundColor: accentColor }]} />
          <View style={[styles.maskEye, { backgroundColor: accentColor }]} />
        </View>
        <View style={styles.titleSlug}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.titleText}>
            HERO
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Image
      accessibilityLabel="Illustration de carte"
      contentFit="cover"
      source={{ uri: signedUrl.data }}
      style={[styles.image, { height, width }]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.lineStrong,
    borderWidth: 1,
    borderRadius: radius.sm,
  },
  placeholder: {
    alignItems: "center",
    backgroundColor: colors.yellow,
    borderColor: colors.text,
    borderRadius: radius.sm,
    borderWidth: 2,
    justifyContent: "center",
    overflow: "hidden",
    padding: 6,
  },
  heroPanel: {
    height: "120%",
    left: "-10%",
    opacity: 0.94,
    position: "absolute",
    top: "-8%",
    transform: [{ rotate: "18deg" }],
    width: "48%",
  },
  sunburstOne: {
    backgroundColor: colors.blue,
    bottom: "10%",
    height: "115%",
    position: "absolute",
    right: "-42%",
    transform: [{ rotate: "-32deg" }],
    width: "54%",
  },
  sunburstTwo: {
    backgroundColor: colors.orange,
    height: "55%",
    opacity: 0.92,
    position: "absolute",
    right: "-10%",
    top: "-8%",
    transform: [{ rotate: "42deg" }],
    width: "34%",
  },
  halftoneRow: {
    flexDirection: "row",
    gap: 4,
    left: 7,
    position: "absolute",
    top: 7,
  },
  dot: {
    backgroundColor: "rgba(5, 7, 13, 0.32)",
    borderRadius: 999,
    height: 4,
    width: 4,
  },
  mask: {
    alignItems: "center",
    backgroundColor: colors.void,
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 2,
    flexDirection: "row",
    gap: 5,
    height: "35%",
    justifyContent: "center",
    width: "56%",
  },
  maskEye: {
    borderRadius: 999,
    height: "28%",
    transform: [{ rotate: "-16deg" }],
    width: "24%",
  },
  titleSlug: {
    backgroundColor: colors.void,
    borderColor: colors.text,
    borderRadius: 5,
    borderWidth: 1,
    bottom: 7,
    left: 7,
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: "absolute",
    right: 7,
  },
  titleText: {
    color: colors.yellow,
    fontSize: 9,
    fontWeight: "900",
    textAlign: "center",
  },
});
