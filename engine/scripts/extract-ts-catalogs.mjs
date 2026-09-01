#!/usr/bin/env node
/**
 * extract-ts-catalogs — CON-003 step 1 of 2.
 *
 * Reads the unminified `@sourceapp/shared-core` TypeScript (authoritative per CON-003)
 * and emits `extraction/dump/ts_catalogs.json`, which IS tracked in git so that the
 * library build reproduces from a fresh clone without the 1.06 GB vendor tree.
 *
 * Parsing strategy: locate each `const NAME ... = <literal>;`, extract the literal with
 * a balanced-bracket scanner that is string- and escape-aware, then evaluate it in a
 * frozen empty VM context. The literals are pure data, so evaluating them is how we get
 * JavaScript's own string semantics (apostrophes, escapes, unicode) instead of
 * re-implementing them badly with regex.
 *
 * Usage: node packages/engine/scripts/extract-ts-catalogs.mjs [--source <dir>]
 */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../..");

const DEFAULT_SOURCE = path.join(
  REPO,
  "extraction/studio/app-out/node_modules/@sourceapp/shared-core",
);
const OUT = path.join(REPO, "extraction/dump/ts_catalogs.json");

const argSource = process.argv.indexOf("--source");
const SOURCE = argSource !== -1 ? path.resolve(process.argv[argSource + 1]) : DEFAULT_SOURCE;

/** CON-003: counts are load-bearing. A mismatch fails the build, not a code review. */
const EXPECTED_COUNTS = {
  shots: 24,
  directions: 4,
  lighting: 29,
  cameras: 49,
  focalLengths: 9,
  lenses: 12,
  filmStocks: 30,
  genres: 53,
  photographers: 99,
  photographerDetails: 99,
  movieLooks: 110,
  movieLookDetails: 110,
  filters: 44,
  aspectRatios: 6,
  imageSizes: 3,
  animeGenres: 25,
  animeShowStyles: 26,
  // CON-003 correction to supplement D5: 46, not 45. The catalog array spans
  // westernAnimationCatalog.ts lines 12-57; D5's cited range 12-56 dropped the last entry.
  westernAnimationStyles: 46,
};

/**
 * CON-003 DEV-2. The reference app wrote these four keys through a legacy codepage, so
 * `PHOTOGRAPHER_LOOK_DETAILS[name]` misses and the style sentence is silently dropped for
 * 4 of 99 photographers. Values are uncorrupted; only keys are. We repair the keys and
 * pin each one with a golden test (CON-004).
 */
const MOJIBAKE_KEY_REPAIRS = {
  "EugÇùne Atget": "Eugène Atget",
  "LÇ­szlÇü Moholy-Nagy": "László Moholy-Nagy",
  "RÇ¸hahn": "Réhahn",
  "SebastiÇœo Salgado": "Sebastião Salgado",
};

/** Detects the UTF-8-read-as-legacy-codepage signature so a NEW corruption cannot ship silently. */
const MOJIBAKE_RE = /[ÃÇ][-˿]/;

function fail(msg) {
  console.error(`extract-ts-catalogs: ${msg}`);
  process.exit(1);
}

/**
 * Extract the source text of the literal assigned to `name`.
 * String- and escape-aware so that brackets inside string values do not confuse depth.
 */
function extractLiteral(src, name) {
  const decl = new RegExp(`(?:export\\s+)?const\\s+${name}\\b[^=]*=\\s*`);
  const m = src.match(decl);
  if (!m) return null;

  let i = m.index + m[0].length;
  const open = src[i];
  if (open !== "[" && open !== "{") {
    fail(`${name}: expected an array or object literal, found ${JSON.stringify(open)}`);
  }
  const close = open === "[" ? "]" : "}";

  let depth = 0;
  let quote = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return src.slice(m.index + m[0].length, i + 1);
    }
  }
  fail(`${name}: unterminated literal`);
}

/** Evaluate a data literal in an empty context. No globals, no require, no I/O reachable. */
function evalLiteral(text, name) {
  try {
    return vm.runInNewContext(`(${text})`, Object.create(null), { timeout: 5000 });
  } catch (err) {
    fail(`${name}: could not evaluate literal — ${err.message}`);
  }
}

function readConst(src, name, { optional = false } = {}) {
  const text = extractLiteral(src, name);
  if (text === null) {
    if (optional) return null;
    fail(`${name}: not found in source`);
  }
  return evalLiteral(text, name);
}

/**
 * Byte-faithful port of `createOptions`'s slug logic (constants.ts:13-20).
 * Reproduced rather than approximated: these slugs become asset filenames and preset ids.
 */
function slugify(item) {
  return item
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const createOptions = (items, category) =>
  items.map((item) => ({
    label: item,
    value: item,
    image: `/images/${category}/${slugify(item)}.jpg`,
  }));

const createOptionsWithValues = (items, category) =>
  items.map((item) => ({
    label: item.label,
    value: item.value,
    image: `/images/${category}/${slugify(item.label)}.jpg`,
  }));

// ---------------------------------------------------------------------------

function main() {
  if (!fs.existsSync(SOURCE)) {
    fail(
      `source not found: ${SOURCE}\n` +
        `  The @sourceapp/shared-core vendor tree is git-ignored (see CON-003).\n` +
        `  This script only needs to run when re-basing the extraction; the tracked\n` +
        `  ${path.relative(REPO, OUT)} is what the library build reads.`,
    );
  }

  const constants = fs.readFileSync(path.join(SOURCE, "constants.ts"), "utf8");
  const animeGenreSrc = fs.readFileSync(path.join(SOURCE, "animeGenreCatalog.ts"), "utf8");
  const animeShowSrc = fs.readFileSync(path.join(SOURCE, "animeShowStyleCatalog.ts"), "utf8");
  const westernSrc = fs.readFileSync(path.join(SOURCE, "westernAnimationCatalog.ts"), "utf8");

  const rawPhotographerDetails = readConst(constants, "PHOTOGRAPHER_LOOK_DETAILS");

  // --- CON-003 DEV-2: repair mojibake keys, and refuse to ship an unknown one ---
  const photographerDetails = {};
  const repairsApplied = [];
  for (const [key, value] of Object.entries(rawPhotographerDetails)) {
    if (MOJIBAKE_RE.test(value)) {
      fail(`mojibake found in a photographer VALUE, which DEV-2 does not cover: ${key}`);
    }
    if (Object.hasOwn(MOJIBAKE_KEY_REPAIRS, key)) {
      photographerDetails[MOJIBAKE_KEY_REPAIRS[key]] = value;
      repairsApplied.push(key);
    } else if (MOJIBAKE_RE.test(key)) {
      fail(
        `unlisted mojibake key: ${JSON.stringify(key)}\n` +
          `  Add it to MOJIBAKE_KEY_REPAIRS and to the CON-003 DEVIATIONS table, with human approval.`,
      );
    } else {
      photographerDetails[key] = value;
    }
  }

  const expectedRepairs = Object.keys(MOJIBAKE_KEY_REPAIRS).length;
  if (repairsApplied.length !== expectedRepairs) {
    fail(
      `expected ${expectedRepairs} mojibake key repairs, applied ${repairsApplied.length}. ` +
        `The upstream data changed; re-verify DEV-2 before continuing.`,
    );
  }

  const photographers = readConst(constants, "RAW_PHOTOGRAPHERS");
  const movieLooks = readConst(constants, "RAW_MOVIE_LOOKS");
  const movieLookDetails = readConst(constants, "MOVIE_LOOK_DETAILS");

  // Every picker name must now resolve to a fragment. This is the assertion that proves
  // DEV-2 actually fixed the defect rather than merely renaming it.
  const unresolved = photographers.filter((n) => !Object.hasOwn(photographerDetails, n));
  if (unresolved.length) {
    fail(`photographer names with no style fragment after repair: ${JSON.stringify(unresolved)}`);
  }
  const unresolvedMovies = movieLooks.filter((n) => !Object.hasOwn(movieLookDetails, n));
  if (unresolvedMovies.length) {
    fail(`movie looks with no fragment: ${JSON.stringify(unresolvedMovies)}`);
  }

  const catalogs = {
    shots: createOptionsWithValues(readConst(constants, "RAW_SHOT_TYPES"), "shots"),
    directions: createOptionsWithValues(readConst(constants, "RAW_VIEWING_DIRECTIONS"), "directions"),
    lighting: createOptionsWithValues(readConst(constants, "RAW_LIGHTING_TYPES"), "lighting"),
    cameras: createOptionsWithValues(readConst(constants, "RAW_CAMERAS"), "cameras"),
    focalLengths: createOptions(readConst(constants, "RAW_FOCAL_LENGTHS"), "focal-length"),
    lenses: createOptions(readConst(constants, "RAW_LENSES"), "lenses"),
    filmStocks: createOptions(readConst(constants, "RAW_FILM_STOCKS"), "films"),
    genres: createOptions(readConst(constants, "RAW_GENRES"), "genres"),
    photographers: createOptions(photographers, "photographers"),
    photographerDetails,
    movieLooks: createOptions(movieLooks, "movies"),
    movieLookDetails,
    filters: createOptions(readConst(constants, "RAW_FILTERS"), "filters"),
    aspectRatios: readConst(constants, "ASPECT_RATIOS"),
    imageSizes: readConst(constants, "IMAGE_SIZES"),
    animeGenres: readConst(animeGenreSrc, "ANIME_GENRE_CATALOG"),
    animeShowStyles: readConst(animeShowSrc, "ANIME_SHOW_STYLE_CATALOG"),
    westernAnimationStyles: readConst(westernSrc, "WESTERN_ANIMATION_STYLE_CATALOG"),
    characterElementDefs: readConst(constants, "CHARACTER_ELEMENT_DEFS"),
    sceneElementDef: readConst(constants, "SCENE_ELEMENT_DEF"),
  };

  // --- CON-003: assert every count ---
  const problems = [];
  for (const [key, expected] of Object.entries(EXPECTED_COUNTS)) {
    const v = catalogs[key];
    const actual = Array.isArray(v) ? v.length : Object.keys(v ?? {}).length;
    if (actual !== expected) problems.push(`  ${key}: expected ${expected}, got ${actual}`);
  }
  if (problems.length) {
    fail(`catalog count mismatch\n${problems.join("\n")}`);
  }

  const payload = {
    $schema: "ts_catalogs/v1",
    generatedBy: "packages/engine/scripts/extract-ts-catalogs.mjs",
    sourcePackage: "@sourceapp/shared-core",
    provenance: "CON-003: unminified TypeScript, authoritative over dump/*.json and EXTRACTION.md",
    deviations: [
      "DEV-1: brand word scrubbed from all strings",
      `DEV-2: ${expectedRepairs} photographer fragment keys repaired from mojibake to UTF-8`,
    ],
    counts: Object.fromEntries(
      Object.keys(EXPECTED_COUNTS).map((k) => [
        k,
        Array.isArray(catalogs[k]) ? catalogs[k].length : Object.keys(catalogs[k]).length,
      ]),
    ),
    catalogs,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`extract-ts-catalogs: wrote ${path.relative(REPO, OUT)}`);
  console.log(`  repaired ${repairsApplied.length} mojibake keys (DEV-2)`);
  for (const [k, v] of Object.entries(payload.counts)) console.log(`  ${k.padEnd(24)} ${v}`);
}

main();
