import { spawnSync } from "node:child_process";

const result = spawnSync(
  "pnpm",
  ["--filter", "@marvel-nexus/mobile", "exec", "expo", "export", "--platform", "web", "--output-dir", "dist-web", "--clear"],
  {
    env: {
      ...process.env,
      CI: "true",
      EXPO_BASE_URL: "/marvel-nexus",
    },
    shell: process.platform === "win32",
    stdio: "inherit",
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

await import("./prepare-github-pages-build.mjs");
