import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../../theme/tokens";

type TabIconName = "home" | "collections" | "leaderboard" | "profile" | "settings";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.void },
        tabBarActiveTintColor: colors.yellow,
        tabBarInactiveTintColor: colors.muted,
        tabBarItemStyle: styles.tabItem,
        tabBarLabel: ({ children, color, focused }) => (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.tabLabel, focused ? styles.tabLabelActive : null, { color }]}
          >
            {children}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: colors.panel,
          borderTopColor: colors.red,
          borderTopWidth: 2,
          minHeight: 82,
          paddingBottom: 10,
          paddingHorizontal: 8,
          paddingTop: 9,
          shadowColor: colors.red,
          shadowOffset: { height: -8, width: 0 },
          shadowOpacity: 0.22,
          shadowRadius: 18,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabMark color={color} focused={focused} name="home" />
          ),
          title: "Accueil",
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabMark color={color} focused={focused} name="collections" />
          ),
          title: "Collections",
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabMark color={color} focused={focused} name="leaderboard" />
          ),
          title: "Top",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabMark color={color} focused={focused} name="profile" />
          ),
          title: "Profil",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabMark color={color} focused={focused} name="settings" />
          ),
          title: "Options",
        }}
      />
    </Tabs>
  );
}

function TabMark({
  color,
  focused,
  name,
}: {
  color: ColorValue;
  focused: boolean;
  name: TabIconName;
}) {
  return (
    <View style={[styles.iconShell, focused ? styles.iconShellActive : null]}>
      <View style={[styles.iconSlash, focused ? styles.iconSlashActive : null]} />
      <TabGlyph color={color} focused={focused} name={name} />
    </View>
  );
}

function TabGlyph({
  color,
  focused,
  name,
}: {
  color: ColorValue;
  focused: boolean;
  name: TabIconName;
}) {
  if (name === "collections") {
    return (
      <View style={styles.gridGlyph}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.gridTile,
              {
                backgroundColor:
                  focused && index === 0
                    ? colors.red
                    : focused && index === 3
                      ? colors.yellow
                      : color,
              },
            ]}
          />
        ))}
      </View>
    );
  }

  if (name === "leaderboard") {
    return (
      <View style={styles.barsGlyph}>
        {[12, 18, 26].map((height, index) => (
          <View
            key={height}
            style={[
              styles.bar,
              {
                backgroundColor: focused && index === 2 ? colors.yellow : color,
                height,
              },
            ]}
          />
        ))}
      </View>
    );
  }

  if (name === "profile") {
    return (
      <View style={styles.profileGlyph}>
        <View style={[styles.profileHead, { backgroundColor: color }]} />
        <View style={[styles.profileBody, { borderColor: color }]} />
      </View>
    );
  }

  if (name === "settings") {
    return (
      <View style={styles.settingsGlyph}>
        <View style={[styles.knob, { borderColor: color }]} />
        <View style={[styles.sliderLine, { backgroundColor: color, top: 8 }]} />
        <View
          style={[styles.sliderLine, { backgroundColor: focused ? colors.yellow : color, top: 18 }]}
        />
      </View>
    );
  }

  return (
    <View style={styles.nexusGlyph}>
      <Text style={[styles.nexusLetter, { color }]}>N</Text>
      <View style={[styles.nexusUnderline, { backgroundColor: focused ? colors.red : color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    borderRadius: radius.md,
    paddingHorizontal: 1,
  },
  tabLabel: {
    fontSize: 8,
    fontWeight: "900",
    marginTop: 1,
    textTransform: "uppercase",
  },
  tabLabelActive: {
    textShadowColor: colors.red,
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 0,
  },
  iconShell: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: radius.md,
    height: 34,
    justifyContent: "center",
    marginTop: 1,
    overflow: "hidden",
    width: 40,
  },
  iconShellActive: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.yellow,
    borderWidth: 1,
  },
  iconSlash: {
    backgroundColor: colors.line,
    height: 54,
    opacity: 0,
    position: "absolute",
    right: 5,
    top: -10,
    transform: [{ rotate: "24deg" }],
    width: 12,
  },
  iconSlashActive: {
    backgroundColor: colors.red,
    opacity: 0.65,
  },
  nexusGlyph: {
    alignItems: "center",
    gap: 1,
  },
  nexusLetter: {
    fontSize: 18,
    fontWeight: "900",
  },
  nexusUnderline: {
    borderRadius: 999,
    height: 3,
    width: 18,
  },
  gridGlyph: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    height: 23,
    width: 23,
  },
  gridTile: {
    borderRadius: 3,
    height: 10,
    width: 10,
  },
  barsGlyph: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 4,
    height: 28,
  },
  bar: {
    borderRadius: 999,
    width: 5,
  },
  profileGlyph: {
    alignItems: "center",
    height: 27,
    justifyContent: "center",
    width: 27,
  },
  profileHead: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  profileBody: {
    borderRadius: 999,
    borderWidth: 3,
    height: 16,
    marginTop: -1,
    width: 23,
  },
  settingsGlyph: {
    height: 27,
    width: 28,
  },
  knob: {
    backgroundColor: colors.panel,
    borderRadius: 999,
    borderWidth: 3,
    height: 12,
    left: 12,
    position: "absolute",
    top: 3,
    width: 12,
    zIndex: 2,
  },
  sliderLine: {
    borderRadius: 999,
    height: 4,
    left: 2,
    position: "absolute",
    width: 24,
  },
});
