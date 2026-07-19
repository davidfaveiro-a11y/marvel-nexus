import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { StyleSheet, Text } from "react-native";
import { colors } from "../../theme/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.void },
        tabBarActiveTintColor: colors.electric,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "800" },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          minHeight: 66,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => <TabMark color={color} label="N" />,
          title: "Accueil",
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          tabBarIcon: ({ color }) => <TabMark color={color} label="C" />,
          title: "Collections",
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          tabBarIcon: ({ color }) => <TabMark color={color} label="T" />,
          title: "Top",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <TabMark color={color} label="P" />,
          title: "Profil",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => <TabMark color={color} label="R" />,
          title: "Reglages",
        }}
      />
    </Tabs>
  );
}

function TabMark({ color, label }: { color: ColorValue; label: string }) {
  return <Text style={[styles.tabMark, { color }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  tabMark: {
    fontSize: 13,
    fontWeight: "900",
  },
});
