import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "apps", "mobile", "dist-web");
const docsDir = join(root, "docs");
const targetDir = join(docsDir, "app");

if (!existsSync(sourceDir)) {
  throw new Error(`Missing Expo web export at ${sourceDir}. Run expo export first.`);
}

rmSync(targetDir, { force: true, recursive: true });
mkdirSync(docsDir, { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true });

const textExtensions = new Set([".css", ".html", ".js", ".json", ".map"]);

function patchAssetPaths(filePath) {
  if (!textExtensions.has(extname(filePath))) return;

  const original = readFileSync(filePath, "utf8");
  const patched = original
    .replaceAll('="/_expo/', '="./_expo/')
    .replaceAll("='/_expo/", "='./_expo/")
    .replaceAll('="/assets/', '="./assets/')
    .replaceAll("='/assets/", "='./assets/")
    .replaceAll('"/_expo/', '"./_expo/')
    .replaceAll("'/_expo/", "'./_expo/")
    .replaceAll('"/assets/', '"./assets/')
    .replaceAll("'/assets/", "'./assets/")
    .replaceAll("url(/_expo/", "url(./_expo/")
    .replaceAll("url(/assets/", "url(./assets/");

  if (patched !== original) {
    writeFileSync(filePath, patched);
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      patchAssetPaths(fullPath);
    }
  }
}

walk(targetDir);

const appIndex = join(targetDir, "index.html");
copyFileSync(appIndex, join(targetDir, "404.html"));

writeFileSync(join(docsDir, ".nojekyll"), "");
writeFileSync(
  join(docsDir, "index.html"),
  `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=./app/">
    <title>Marvel Nexus</title>
    <script>location.replace("./app/" + location.search + location.hash);</script>
  </head>
  <body>
    <a href="./app/">Ouvrir Marvel Nexus</a>
  </body>
</html>
`,
);

console.log(`Prepared GitHub Pages app in ${targetDir}`);
