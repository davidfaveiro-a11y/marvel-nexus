import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "apps", "mobile", "dist-web");
const docsDir = join(root, "docs");

if (!existsSync(sourceDir)) {
  throw new Error(`Missing Expo web export at ${sourceDir}. Run expo export first.`);
}

mkdirSync(docsDir, { recursive: true });
for (const generatedEntry of ["_expo", "assets", "app", "404.html", "index.html", "metadata.json"]) {
  rmSync(join(docsDir, generatedEntry), { force: true, recursive: true });
}
cpSync(sourceDir, docsDir, { recursive: true });

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

for (const generatedEntry of ["_expo", "assets", "index.html", "metadata.json"]) {
  const fullPath = join(docsDir, generatedEntry);
  if (existsSync(fullPath)) {
    if (statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      patchAssetPaths(fullPath);
    }
  }
}

const appIndex = join(docsDir, "index.html");
copyFileSync(appIndex, join(docsDir, "404.html"));

writeFileSync(join(docsDir, ".nojekyll"), "");

console.log(`Prepared GitHub Pages app in ${docsDir}`);
