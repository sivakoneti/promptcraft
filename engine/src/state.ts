/**
 * SPC-001 FR-001, FR-007: PromptState type + Zod validation for preset library entries.
 * Pure module — no DOM, no Chrome APIs, no network.
 */

import { z } from 'zod';

// ─── PromptState (FR-001) ──────────────────────────────────────────────────────

export type PromptMode = 'photo' | 'anime' | 'edit' | 'video';

export interface ReferenceSlot {
  /** Slot category per extraction §5 priority engine */
  type: 'global' | 'face' | 'scene' | 'outfit' | 'object' | 'anonymous';
  /** Character index (0-based); null for global/anonymous buckets */
  characterIndex: number | null;
  /** Base64 data URL or blob reference; empty string = slot reserved but unfilled */
  image: string;
}

export interface PromptState {
  // Free-text fields
  subject: string;
  subjectAction: string;
  environment: string;
  mood: string;

  // Catalog references (IDs resolved against library at assembly time)
  lightingId: string;
  shotId: string;
  cameraId: string;
  lensId: string;
  fStop: string | null;
  filmId: string;
  filters: string[];
  movieLookId: string;
  photographerId: string;

  // Animate-mode catalogs
  animeGenreId: string;
  animeShowStyleId: string;
  westernAnimationStyleId: string;

  // Flags
  noText: boolean;
  showNewAnglePrompt: boolean;
  candidShot: boolean;

  // Output
  aspectRatio: string;
  mode: PromptMode;

  // References (ordered slot list per extraction §5)
  references: ReferenceSlot[];
}

/** Default factory matching source app qh() defaults per EXTRACTION.md §2 */
export function createDefaultState(): PromptState {
  return {
    subject: '',
    subjectAction: '',
    environment: '',
    mood: '',
    lightingId: '',
    shotId: '',
    cameraId: '',
    lensId: '',
    fStop: null,
    filmId: '',
    filters: [],
    movieLookId: '',
    photographerId: '',
    animeGenreId: '',
    animeShowStyleId: '',
    westernAnimationStyleId: '',
    noText: false,
    showNewAnglePrompt: false,
    candidShot: false,
    aspectRatio: '16:9',
    mode: 'photo',
    references: [],
  };
}

// ─── Preset Library Schemas (FR-007) ───────────────────────────────────────────

export const PRESET_LIBRARY_VERSION = '1.0.0';

/** Base schema for all catalog entries */
export const BasePresetSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  promptValue: z.string(),
  category: z.string().min(1),
}).strict();
/** Anime/Western entries carry pre/post prompt wrapping fragments (EXTRACTION.md §4.12-4.14) */
export const AnimePresetSchema = BasePresetSchema.extend({
  pre: z.string(),
  post: z.string(),
}).strict();

export type BasePreset = z.infer<typeof BasePresetSchema>;
export type AnimePreset = z.infer<typeof AnimePresetSchema>;

/** Top-level library container with version field */
export const PresetLibrarySchema = z.object({
  version: z.string(),
  shots: z.array(BasePresetSchema),
  directions: z.array(BasePresetSchema),
  lighting: z.array(BasePresetSchema),
  cameras: z.array(BasePresetSchema),
  focalLengths: z.array(BasePresetSchema),
  lenses: z.array(BasePresetSchema),
  filmStocks: z.array(BasePresetSchema),
  genres: z.array(BasePresetSchema),
  photographers: z.array(BasePresetSchema),
  movieLooks: z.array(BasePresetSchema),
  filters: z.array(BasePresetSchema),
  aspectRatios: z.array(BasePresetSchema),
  animeGenres: z.array(AnimePresetSchema),
  animeShowStyles: z.array(AnimePresetSchema),
  westernAnimationStyles: z.array(AnimePresetSchema),
}).strict();

export type PresetLibrary = z.infer<typeof PresetLibrarySchema>;

/**
 * Validate a loaded library object. Throws ZodError on failure (SC-004).
 * Rejects unknown fields via strict parsing.
 */
export function validateLibrary(data: unknown): PresetLibrary {
  return PresetLibrarySchema.parse(data);
}

