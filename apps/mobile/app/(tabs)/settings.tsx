import { router } from "expo-router";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { PrimaryButton } from "../../components/PrimaryButton";
import { supabase } from "../../lib/supabase";
import { usePreferencesStore } from "../../store/preferences";
import { colors, radius } from "../../theme/tokens";

export default function SettingsScreen() {
  const preferences = usePreferencesStore();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.titleBlock}>
        <Text style={styles.kicker}>Session</Text>
        <Text style={styles.title}>Reglages</Text>
      </View>
      <View style={styles.panel}>
        <SettingRow
          label="Sons"
          value={preferences.soundsEnabled}
          onChange={preferences.setSoundsEnabled}
        />
        <SettingRow
          label="Vibrations"
          value={preferences.hapticsEnabled}
          onChange={preferences.setHapticsEnabled}
        />
        <SettingRow
          label="Reduire les animations"
          value={preferences.reduceMotion}
          onChange={preferences.setReduceMotion}
        />
      </View>
      <PrimaryButton
        onPress={() => {
          void signOut();
        }}
      >
        Deconnexion
      </PrimaryButton>
    </ScrollView>
  );
}

function SettingRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        accessibilityLabel={label}
        onValueChange={onChange}
        thumbColor={value ? colors.text : colors.muted}
        trackColor={{ false: colors.surfaceHigh, true: colors.blue }}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignSelf: "center",
    backgroundColor: colors.void,
    gap: 16,
    maxWidth: 430,
    padding: 18,
    paddingBottom: 36,
    width: "100%",
  },
  titleBlock: { gap: 4 },
  kicker: { color: colors.gold, fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  title: { color: colors.text, fontSize: 32, fontWeight: "900" },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 64,
    paddingHorizontal: 16,
  },
  label: { color: colors.text, fontSize: 16, fontWeight: "800" },
});
