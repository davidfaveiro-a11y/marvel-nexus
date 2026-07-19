import { theme } from "@marvel-nexus/config";

export const colors = theme.colors;
export const radius = theme.radius;

export const screen = {
  padding: 20,
  gap: 16,
} as const;

export const shadows = {
  ambient: {
    elevation: 10,
    shadowColor: "#000000",
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
  },
  glowBlue: {
    elevation: 8,
    shadowColor: colors.electric,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
} as const;
