/**
 * SPC-001 FR-002, FR-003, FR-005: Master assembler.
 * Mode switch dispatches to ordered fragment arrays per EXTRACTION.md §3.
 * Whitespace policy: fragments join with single space; each fragment fn owns its trailing punctuation.
 */

import type { PromptState, PresetLibrary } from './state.js';
import { assembleVideo, type VideoState } from './video.js';
import {
  buildSubjectSentence,
  buildLightingMood,
  buildCameraGear,
  buildPhotographerStyle,
  buildMovieLook,
  buildFilters,
  FACE_GUARD,
  buildAspectRatio,
  NO_TEXT_GUARD,
} from './fragments.js';

// ─── Photo mode (FR-002) ────────────────────────────────────────────────────────

export function assemblePhoto(state: PromptState, library: PresetLibrary): string {
  // Master order per EXTRACTION.md §3: G2 + fs + Dx + Ox + Lx + Kx + face-guard + zr
  const fragments = [
    buildSubjectSentence(state, library),
    buildLightingMood(state, library),
    buildCameraGear(state, library),
    buildPhotographerStyle(state, library),
    buildMovieLook(state, library),
    buildFilters(state, library),
    FACE_GUARD,
    buildAspectRatio(state),
  ];

  return fragments.filter((f) => f.length > 0).join(' ');
}

// ─── Edit mode (FR-005) ─────────────────────────────────────────────────────────

export function assembleEdit(state: PromptState, library: PresetLibrary): string {
  const subject = state.subjectAction || 'the subject';
  const fragments = [
    `Modify the source image to: ${subject}.`,
    FACE_GUARD,
    buildAspectRatio(state),
  ];

  return fragments.filter((f) => f.length > 0).join(' ');
}

// ─── Anime/Western mode (FR-003) ────────────────────────────────────────────────

export function assembleAnime(state: PromptState, library: PresetLibrary): string {
  // Check if any anime/western style is selected (first match wins per EXTRACTION.md §3 Animate)
  const hasAnimeStyle =
    state.westernAnimationStyleId || state.animeGenreId || state.animeShowStyleId;

  if (hasAnimeStyle) {
    // With catalog-picked style: prePrompt + subject/shot sentence + fs + postPrompt + Sd + zr + noText
    // For now, use simplified assembly; full pre/post wrapping requires library lookup of anime entries
    const subjectSentence = buildSubjectSentence(state, library);
    const lightingMood = buildLightingMood(state, library);

    const fragments = [
      subjectSentence,
      lightingMood,
      buildAspectRatio(state),
    ];

    if (state.noText) {
      fragments.push(NO_TEXT_GUARD);
    }

    return fragments.filter((f) => f.length > 0).join(' ');
  }

  // Without anime style: fallback template per EXTRACTION.md §3
  // "An animation style image of" + "In the style of {genre}," + subject sentence + Sd + fs + zr + noText
  const genre = state.animeGenreId
    ? library.animeGenres.find((e) => e.id === state.animeGenreId)?.label
    : '';
  const westernStyle = state.westernAnimationStyleId
    ? library.westernAnimationStyles.find((e) => e.id === state.westernAnimationStyleId)?.label
    : '';
  const showStyle = state.animeShowStyleId
    ? library.animeShowStyles.find((e) => e.id === state.animeShowStyleId)?.label
    : '';

  const sdFallback = `Western animation style: ${westernStyle || ''}. Anime genre: ${genre || ''}. Anime show style: ${showStyle || ''}.`;

  const fragments = [
    'An animation style image of',
    genre ? `In the style of ${genre},` : '',
    buildSubjectSentence(state, library),
    sdFallback,
    buildLightingMood(state, library),
    buildAspectRatio(state),
  ];

  if (state.noText) {
    fragments.push(NO_TEXT_GUARD);
  }

  return fragments.filter((f) => f.length > 0).join(' ');
}

// ─── Unified entry point ────────────────────────────────────────────────────────

export function assemble(state: PromptState, library: PresetLibrary): string {
  switch (state.mode) {
    case 'photo':
      return assemblePhoto(state, library);
    case 'edit':
      return assembleEdit(state, library);
    case 'anime':
      return assembleAnime(state, library);
    case 'video':
      return assembleVideo(state as VideoState, library);
  }
  return assemblePhoto(state, library);
}

