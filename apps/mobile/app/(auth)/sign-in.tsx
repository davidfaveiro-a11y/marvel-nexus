import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Screen } from "../../components/Screen";
import { supabase } from "../../lib/supabase";
import { colors, radius } from "../../theme/tokens";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type SignInInput = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const { control, handleSubmit, formState } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInInput) {
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      Alert.alert("Connexion impossible", error.message);
      return;
    }
    router.replace("/");
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.kicker}>Jeu prive</Text>
        <Text style={styles.title}>Marvel Nexus</Text>
      </View>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            placeholder="Adresse e-mail"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextInput
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            placeholder="Mot de passe"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={styles.input}
            value={field.value}
          />
        )}
      />
      <PrimaryButton
        disabled={formState.isSubmitting}
        onPress={() => {
          void handleSubmit(onSubmit)();
        }}
      >
        Se connecter
      </PrimaryButton>
      <Link href="/sign-up" style={styles.link}>
        Creer un compte avec invitation
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 8, marginTop: 40 },
  kicker: { color: colors.electric, fontSize: 13, fontWeight: "800", textTransform: "uppercase" },
  title: { color: colors.text, fontSize: 36, fontWeight: "900" },
  input: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    minHeight: 54,
    paddingHorizontal: 16,
  },
  link: { color: colors.electric, fontWeight: "700", textAlign: "center" },
});
