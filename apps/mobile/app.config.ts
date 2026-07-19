import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { ExpoConfig } from "expo/config";

function findRootEnv(start: string) {
  let current = start;
  for (let depth = 0; depth < 6; depth += 1) {
    const candidate = resolve(current, ".env");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

const rootEnvPath = findRootEnv(process.cwd());
const baseUrl = process.env.EXPO_BASE_URL;

if (rootEnvPath) {
  const rootEnv = readFileSync(rootEnvPath, "utf8");
  for (const line of rootEnv.split(/\r?\n/)) {
    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0 || line.startsWith("#")) continue;
    const key = line.slice(0, separatorIndex);
    const value = line.slice(separatorIndex + 1);
    process.env[key] ??= value;
  }
}

const config: ExpoConfig = {
  name: "Marvel Nexus",
  slug: "marvel-nexus",
  scheme: "marvelnexus",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "dark",
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.private.marvelnexus",
  },
  android: {
    package: "com.private.marvelnexus",
    adaptiveIcon: {
      backgroundColor: "#05070D",
    },
  },
  plugins: ["expo-router", "expo-secure-store"],
  experiments: {
    typedRoutes: true,
    ...(baseUrl ? { baseUrl } : {}),
  },
};

export default config;
