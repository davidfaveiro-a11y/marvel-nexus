import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Switch, Text, TextInput } from "react-native";
import type { SignUpInput } from "@marvel-nexus/validation";
import { signUpSchema } from "@marvel-nexus/validation";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Screen } from "../../components/Screen";
import { supabase } from "../../lib/supabase";
import { colors, radius } from "../../theme/tokens";

export default function SignUpScreen() {
  const { control, handleSubmit, formState } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      invitationCode: "",
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      acceptedPrivateRules: true,
    },
  });

  async function onSubmit(values: SignUpInput) {
    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (signUpError) {
      Alert.alert("Inscription impossible", signUpError.message);
      return;
    }

    const { error: profileError } = await supabase.rpc("complete_invited_profile", {
      invitation_code: values.invitationCode,
      desired_username: values.username,
    });

    if (profileError) {
      Alert.alert("Invitation refusee", profileError.message);
      return;
    }

    router.replace("/");
  }

  return (
    <Screen>
      <Text style={styles.title}>Invitation</Text>
      {(["invitationCode", "email", "username", "password", "confirmPassword"] as const).map(
        (name) => (
          <Controller
            control={control}
            key={name}
            name={name}
            render={({ field }) => (
              <TextInput
                autoCapitalize={name === "invitationCode" ? "characters" : "none"}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                placeholder={labels[name]}
                placeholderTextColor={colors.muted}
                secureTextEntry={name.includes("password") || name.includes("Password")}
                style={styles.input}
                value={String(field.value)}
              />
            )}
          />
        ),
      )}
      <Controller
        control={control}
        name="acceptedPrivateRules"
        render={({ field }) => (
          <Switch
            accessibilityLabel="Accepter les regles privees du jeu"
            onValueChange={field.onChange}
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
        Creer le compte
      </PrimaryButton>
    </Screen>
  );
}

const labels = {
  invitationCode: "Code d'invitation",
  email: "Adresse e-mail",
  username: "Pseudonyme",
  password: "Mot de passe",
  confirmPassword: "Confirmation",
} as const;

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 32, fontWeight: "900", marginTop: 28 },
  input: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    minHeight: 54,
    paddingHorizontal: 16,
  },
});
