import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./seed-marvel-catalog.mjs", import.meta.url), "utf8");
const collectionBlocks = [
  ...source.matchAll(/name: "([^"]+)",[\s\S]*?characters: \[([\s\S]*?)\n    \]/g),
];

const allCharacters = [];

for (const [, collectionName, body] of collectionBlocks) {
  const characters = [...body.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  console.log(`${collectionName}: ${characters.length}`);
  if (characters.length !== 20) {
    throw new Error(`${collectionName} must contain exactly 20 characters`);
  }

  for (const character of characters) {
    allCharacters.push({ character, collectionName });
  }
}

const byCharacter = new Map();
for (const entry of allCharacters) {
  byCharacter.set(entry.character, [
    ...(byCharacter.get(entry.character) ?? []),
    entry.collectionName,
  ]);
}

const duplicates = [...byCharacter.entries()].filter(([, collectionNames]) => {
  return collectionNames.length > 1;
});

if (collectionBlocks.length !== 12) {
  throw new Error(`Expected 12 collections, got ${collectionBlocks.length}`);
}

if (allCharacters.length !== 240) {
  throw new Error(`Expected 240 cards, got ${allCharacters.length}`);
}

if (duplicates.length > 0) {
  console.log(JSON.stringify(duplicates, null, 2));
  throw new Error(`Expected no duplicate characters, got ${duplicates.length}`);
}

console.log("Catalog OK: 12 collections, 240 unique characters.");
