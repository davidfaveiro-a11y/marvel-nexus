import type { PropsWithChildren } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { colors, screen } from "../theme/tokens";

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  content: {
    flex: 1,
    gap: screen.gap,
    padding: screen.padding,
  },
});
