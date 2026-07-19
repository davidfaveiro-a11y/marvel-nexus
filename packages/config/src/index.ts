export const appName = "Marvel Nexus";

export const packCooldownHours = 3;

export const raritySeed = [
  { name: "Commune", rank: 1, color: "#D8DEE9", defaultXp: 5, defaultWeight: 55 },
  { name: "Rare", rank: 2, color: "#38BDF8", defaultXp: 15, defaultWeight: 25 },
  { name: "Epique", rank: 3, color: "#A78BFA", defaultXp: 40, defaultWeight: 12 },
  { name: "Legendaire", rank: 4, color: "#F59E0B", defaultXp: 100, defaultWeight: 6 },
  { name: "Mythique", rank: 5, color: "#EC4899", defaultXp: 250, defaultWeight: 1.8 },
  { name: "Exclusive", rank: 6, color: "#F8FAFC", defaultXp: 500, defaultWeight: 0.2 },
] as const;

export const theme = {
  colors: {
    ink: "#05070D",
    void: "#03040A",
    panel: "#10141E",
    panelRaised: "#171D2A",
    surface: "#0B0F18",
    surfaceHigh: "#1D2433",
    steel: "#293241",
    line: "#283246",
    lineStrong: "#42506A",
    text: "#F6F8FB",
    muted: "#A8B2C4",
    dim: "#647086",
    platinum: "#D9E2EF",
    electric: "#35C7F4",
    blue: "#2F80ED",
    cyan: "#00D4FF",
    red: "#F43F5E",
    crimson: "#D71920",
    yellow: "#FFE45C",
    orange: "#FF7A18",
    violet: "#8B5CF6",
    rose: "#EC4899",
    gold: "#F5B849",
    emerald: "#34D399",
    danger: "#FB7185",
    success: "#34D399",
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 22,
  },
} as const;
