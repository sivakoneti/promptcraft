/**
 * SPC-001 FR-002, FR-004, FR-006, FR-010: Per-fragment pure functions.
 * Each function takes only the fields it needs from PromptState + library lookups.
 * Templates are byte-identical to extraction/EXTRACTION.md §3.
 */

import type { PromptState, PresetLibrary } from './state.js';

// ─── Lookup helpers (inline per ts-no-tiny-functions rule) ─────────────────────

function lookupPromptValue(
  library: PresetLibrary,
  category: keyof Omit<PresetLibrary, 'version'>,
  id: string,
): string | null {
  if (!id) return null;
  const entry = (library[category] as Array<{ id: string; promptValue: string }>).find(
    (e) => e.id === id,
  );
  return entry?.promptValue ?? null;
}

// ─── G2: Subject sentence (FR-002 piece #1) ────────────────────────────────────

export function buildSubjectSentence(state: PromptState, library: PresetLibrary): string {
  const genre = lookupPromptValue(library, 'genres', state.mode === 'photo' ? '' : '');
  // Genre is only used in photo mode when explicitly set; for now we omit per source default
  const shotValue = lookupPromptValue(library, 'shots', state.shotId);
  const subject = state.subjectAction || 'a subject';
  const envSuffix = state.environment ? `, set in ${state.environment}` : '';

  if (state.showNewAnglePrompt && shotValue) {
    // Narrative-angle variant (EXTRACTION.md §3 piece 1b)
    const candidClause = state.candidShot
      ? ', where the subject is unaware they are on camera'
      : '';
    return `A photographic image of a ${shotValue}${candidClause}, in this new angle what would the viewer see? Show us: ${subject}${envSuffix}.`;
  }

  // Standard photo mode
  let shotClause = '';
  if (shotValue) {
    if (state.candidShot) {
      shotClause = `a ${shotValue}, where the subject is unaware they are on camera, of `;
    } else {
      // Direction handling: directions map label -> prompt fragment
      // For simplicity, direction is embedded in shot value or handled separately
      shotClause = `a ${shotValue} of `;
    }
  }

  const prefix = genre
    ? `A photographic image in the style of ${genre} of`
    : 'A photographic image of';

  return `${prefix} ${shotClause}${subject}${envSuffix}.`;
}

// ─── fs: Lighting/Mood (FR-002 piece #2) ────────────────────────────────────────

export function buildLightingMood(state: PromptState, library: PresetLibrary): string {
  const lighting = lookupPromptValue(library, 'lighting', state.lightingId);
  const mood = state.mood || null;

  if (lighting && mood) {
    return `The scene is illuminated by ${lighting}, creating a ${mood} atmosphere.`;
  }
  if (lighting) {
    return `The scene is illuminated by ${lighting}.`;
  }
  if (mood) {
    return `A ${mood} atmosphere.`;
  }
  return '';
}

// ─── Dx: Camera gear (FR-004) ───────────────────────────────────────────────────

export function buildCameraGear(state: PromptState, library: PresetLibrary): string {
  const camera = lookupPromptValue(library, 'cameras', state.cameraId);
  if (!camera) return '';

  const focal = lookupPromptValue(library, 'focalLengths', '');
  const lensRaw = lookupPromptValue(library, 'lenses', state.lensId);
  const film = lookupPromptValue(library, 'filmStocks', state.filmId);

  // Strip trailing ' lens' from lens name before fStop suffix per FR-004
  let lensPart = '';
  if (lensRaw) {
    const stripped = lensRaw.replace(/\s+lens$/i, '');
    lensPart = state.fStop ? `${stripped} f/${state.fStop} lens` : stripped;
  }

  const parts: string[] = [`Captured with the look of a ${camera}`];
  if (focal || lensPart) {
    const gearDetail = [focal, lensPart].filter(Boolean).join(' ');
    parts.push(gearDetail);
  }
  if (film) {
    parts.push(`${film} film`);
  }

  return parts.join(', ') + '.';
}

// ─── Ox: Photographer style (FR-010) ────────────────────────────────────────────

export function buildPhotographerStyle(state: PromptState, library: PresetLibrary): string {
  const pv = lookupPromptValue(library, 'photographers', state.photographerId);
  if (!pv) return '';
  // promptValue already contains "In the style of photographer {name}, {style}."
  return pv;
}

// ─── Lx: Movie look (FR-010) ────────────────────────────────────────────────────

export function buildMovieLook(state: PromptState, library: PresetLibrary): string {
  const pv = lookupPromptValue(library, 'movieLooks', state.movieLookId);
  if (!pv) return '';
  // promptValue already contains "With the visual aesthetic of the movie {name} ..."
  return pv;
}

// ─── Kx: Filters (FR-002 piece #6) ──────────────────────────────────────────────

export function buildFilters(state: PromptState, library: PresetLibrary): string {
  if (state.filters.length === 0) return '';
  const names = state.filters
    .map((fid) => lookupPromptValue(library, 'filters', fid))
    .filter(Boolean);
  if (names.length === 0) return '';
  return `Applied effect(s): ${names.join(', ')}.`;
}

// ─── Face guard (FR-002 piece #7, fixed) ────────────────────────────────────────

export const FACE_GUARD = "Don't blur faces randomly.";

// ─── zr: Aspect ratio (FR-002 piece #8) ─────────────────────────────────────────

export function buildAspectRatio(state: PromptState): string {
  if (!state.aspectRatio) return '';
  return `The image should be in a ${state.aspectRatio} format.`;
}

// ─── noText guard (FR-006) ──────────────────────────────────────────────────────

export const NO_TEXT_GUARD =
  'Generate the image with no subtitles, captions, or text overlays.';

