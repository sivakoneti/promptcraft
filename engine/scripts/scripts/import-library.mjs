#!/usr/bin/env node
/**
 * TCK-001: Import preset library from extraction/dump/ts_catalogs.json
 * into engine/library/*.json format with Zod validation.
 *
 * Usage: node engine/scripts/import-library.mjs
 * Output: engine/library/presets.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

// Read source catalog
const tsCatalogsPath = join(ROOT, 'extraction', 'dump', 'ts_catalogs.json');
const raw = JSON.parse(readFileSync(tsCatalogsPath, 'utf-8'));

console.log(`Source: ${tsCatalogsPath}`);
console.log(`Version: ${raw.$schema || 'unknown'}`);
console.log(`Counts:`, raw.counts);

// Transform to our library schema
// Source format: { catalogs: { shots: [{label, value, image}], ... } }
// Target format: { version, shots: [{id, label, promptValue, category}], ... }
function slugify(text, fallback) {
  if (!text) return fallback;
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || fallback;
}

// Starter-pack: the 10 curated free movie looks (docs/MONETIZATION.md §2).
const FREE_MOVIE_LOOKS = new Set([
  'Blade Runner 2049',
  'Mad Max: Fury Road',
  'La La Land',
  'Dune',
  'Amélie',
  'Joker',
  '1917',
  'Blade Runner',
  'In the Mood for Love',
  'The Grand Budapest Hotel',
]);

function transformCategory(items, category) {
  return items.map((item, index) => {
    // Some catalogs (aspectRatios, imageSizes) are plain string arrays.
    if (typeof item === 'string') item = { label: item, value: item };
    const label = item.label || item.value || '';
    return {
      id: item.id || slugify(label, `${category}-${index}`),
      label,
      promptValue: item.value || item.promptValue || item.label || '',
      category,
      ...(item.prePrompt !== undefined && { pre: item.prePrompt }),
      ...(item.postPrompt !== undefined && { post: item.postPrompt }),
    };
  });
}

// Supplementary catalogs are name -> prompt-fragment maps (EXTRACTION.md 4.10/4.11).
// They fold into the parent entries' promptValue; they are not standalone categories.
// photographers: "In the style of photographer {name}, {frag}."
// movieLooks:    "With the visual aesthetic of the movie {name} {frag}."
function withStyleMap(entries, styleMap, build) {
  return entries.map((entry) => {
    const frag = styleMap?.[entry.label];
    return { ...entry, promptValue: frag ? build(entry.label, frag) : entry.label };
  });
}

const library = {
  version: '1.0.0',
  shots: transformCategory(raw.catalogs.shots || [], 'shots'),
  directions: transformCategory(raw.catalogs.directions || [], 'directions'),
  lighting: transformCategory(raw.catalogs.lighting || [], 'lighting'),
  cameras: transformCategory(raw.catalogs.cameras || [], 'cameras'),
  focalLengths: transformCategory(raw.catalogs.focalLengths || [], 'focalLengths'),
  lenses: transformCategory(raw.catalogs.lenses || [], 'lenses'),
  filmStocks: transformCategory(raw.catalogs.filmStocks || [], 'filmStocks'),
  genres: transformCategory(raw.catalogs.genres || [], 'genres'),
  photographers: withStyleMap(
    transformCategory(raw.catalogs.photographers || [], 'photographers'),
    raw.catalogs.photographerDetails,
    (name, frag) => `In the style of photographer ${name}, ${frag}`,
  ),
  movieLooks: withStyleMap(
    transformCategory(raw.catalogs.movieLooks || [], 'movieLooks'),
    raw.catalogs.movieLookDetails,
    (name, frag) => `With the visual aesthetic of the movie ${name} ${frag}`,
  ),
  filters: transformCategory(raw.catalogs.filters || [], 'filters'),
  animeGenres: transformCategory(raw.catalogs.animeGenres || [], 'animeGenres'),
  aspectRatios: transformCategory(raw.catalogs.aspectRatios || [], 'aspectRatios'),
  animeShowStyles: transformCategory(raw.catalogs.animeShowStyles || [], 'animeShowStyles'),
  westernAnimationStyles: transformCategory(
    raw.catalogs.westernAnimationStyles || [],
    'westernAnimationStyles',
  ),
};

// Write output
const outDir = join(ROOT, 'engine', 'library');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'presets.json');
writeFileSync(outPath, JSON.stringify(library, null, 2));

console.log(`\nOutput: ${outPath}`);
console.log(`Entries:`);
for (const [key, items] of Object.entries(library)) {
  if (key === 'version') continue;
  console.log(`  ${key}: ${items.length}`);
}

// Validate counts match source
let mismatch = false;
for (const [key, expected] of Object.entries(raw.counts || {})) {
  // photographerDetails/movieLookDetails fold into parent promptValues;
  // imageSizes is runtime-only config, not preset data.
  if (['photographerDetails', 'movieLookDetails', 'imageSizes'].includes(key)) continue;
  const actual = library[key]?.length ?? 0;
  if (actual !== expected) {
    console.error(`[WARN] ${key}: expected ${expected}, got ${actual}`);
    mismatch = true;
  }
}
if (!mismatch) {
  console.log('\n✅ All category counts match source.');
} else {
  console.error('\n❌ Count mismatches detected — review transformation.');
  process.exit(1);
}

