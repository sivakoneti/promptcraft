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
  const findStyle = (id: string, list: Array<{ id: string; label: string; pre: string; post: string }>) => {
    if (!id) return undefined;
    const norm = id.trim().toLowerCase();
    const slug = norm.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return list.find((e) => e.id.toLowerCase() === norm || e.id.toLowerCase() === slug || e.label.toLowerCase() === norm);
  };

  const westernStylePreset = findStyle(state.westernAnimationStyleId, library.westernAnimationStyles);
  const animeGenrePreset = findStyle(state.animeGenreId, library.animeGenres);
  const animeShowPreset = findStyle(state.animeShowStyleId, library.animeShowStyles);

  const matchedStyle = westernStylePreset || animeGenrePreset || animeShowPreset;

  if (matchedStyle) {
    // With catalog-picked style: prePrompt + subject/shot sentence + fs + postPrompt + Sd + zr + noText
    const shotValue = state.shotId ? (library.shots.find((s) => s.id === state.shotId)?.promptValue ?? null) : null;
    const subject = state.subjectAction || 'a subject';
    const envSuffix = state.environment ? `, set in ${state.environment}` : '';
    let shotClause = '';
    if (shotValue) {
      shotClause = state.candidShot
        ? `a ${shotValue}, where the subject is unaware they are on camera, of `
        : `a ${shotValue} of `;
    }
    const subjectSentence = `An animation style image of ${shotClause}${subject}${envSuffix}.`;
    const lightingMood = buildLightingMood(state, library);

    const fragments = [
      matchedStyle.pre,
      subjectSentence,
      lightingMood,
      matchedStyle.post,
      buildAspectRatio(state),
    ];

    if (state.noText) {
      fragments.push(NO_TEXT_GUARD);
    }

    return fragments.filter((f) => f && f.length > 0).join(' ');
  }

  // Without catalog-picked anime style: fallback template per EXTRACTION.md §3
  // "An animation style image of" + "In the style of {genre}," + subject sentence + Sd + fs + zr + noText
  const genre = state.animeGenreId || '';
  const westernStyle = state.westernAnimationStyleId || '';
  const showStyle = state.animeShowStyleId || '';

  const sdFallback = `Western animation style: ${westernStyle}. Anime genre: ${genre}. Anime show style: ${showStyle}.`;

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

  return fragments.filter((f) => f && f.length > 0).join(' ');
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

