import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, shadows } from "../theme/tokens";

interface PrimaryButtonProps extends PropsWithChildren {
  disabled?: boolean;
  onPress: () => void;
}

export function PrimaryButton({ children, disabled = false, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    ...shadows.glowBlue,
    alignItems: "center",
    backgroundColor: colors.crimson,
    borderColor: colors.yellow,
    borderWidth: 2,
    borderRadius: radius.md,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 18,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
