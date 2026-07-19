import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { colors } from "../theme/tokens";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;

    document.documentElement.style.backgroundColor = colors.void;
    document.body.style.backgroundColor = colors.void;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.appShell}>
        <StatusBar style="light" />
        <Stack screenOptions={{ contentStyle: styles.appShell, headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  appShell: {
    backgroundColor: colors.void,
    flex: 1,
  },
});
