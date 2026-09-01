/**
 * SPC-003 FR-004, FR-005, FR-006: Video prompt composition engine.
 * Pure module — no DOM, no Chrome APIs, deterministic.
 *
 * Source of truth: extraction/EXTRACTION.md §6 as corrected by
 * extraction/TS_SOURCE_SUPPLEMENT.md (D11, V18, N12, N19) and the reference
 * apps' unminified shared-core (`services/video/adapters/dynamic.ts:392-409,
 * 995-1004`, `model-builders.ts:1114-1133`, `video/catalog/movement.ts`).
 *
 * Key source facts encoded here:
 * - Video prompting is free text per shot; movement keywords are inserted at
 *   the cursor (EXTRACTION §6) — no fixed template wraps the video prompt.
 * - Autofill = `[subjectAction, environment, mood].filter(Boolean).join(', ')`
 *   (EXTRACTION §6; renderer-side, not shared-core).
 * - Director mode: shots filtered to non-empty prompts, prompts trimmed and
 *   sliced to 512 chars (KLING_PROMPT_MAX_CHARS, N12), sliced to max 6 shots,
 *   per-shot duration defaults to 5 s, total duration clamped to 3..15 s,
 *   shot_type defaults to 'customize' (D11, dynamic.ts:995-1004).
 * - The source encodes multi-shot as a STRUCTURED array (`multi_prompt`) and
 *   clears the single prompt (`body.prompt = ''`, D11). No text connector
 *   template exists in the source, so `buildDirectorTimeline().timelinePrompt`
 *   renders the deterministic text form `Shot N: {prompt} ({duration}s)`
 *   (engine-defined; the source-identical structured shots are the contract).
 * - Aspect defaults: the source defines exactly one aspect default — the state
 *   default '16:9' (supplement V23); no video model sets `defaultAspectRatio`.
 */

import type { PresetLibrary, PromptState } from './state.js';
import { createDefaultState } from './state.js';
import {
  getMovementByLabel,
  MOVEMENT_COUNT,
  VIDEO_MOVEMENTS,
  type VideoMovementPromptOption,
} from '../library/video-movements.js';
import {
  resolveReferences,
  type ReferenceLabelMode,
  type ReferenceSlotInput,
} from './references.js';

export { MOVEMENT_COUNT, VIDEO_MOVEMENTS, getMovementByLabel };
export type { VideoMovementPromptOption };

// ─── Movement insertion (FR-004, EXTRACTION §6 "inserted at the cursor") ───────

/**
 * Insert a movement keyword at `cursor` (character offset). No cursor (or one
 * past the end) appends. Whitespace policy: single spaces around the keyword,
 * matching the engine's `sync()` normalization.
 */
export function insertMovementKeyword(prompt: string, keyword: string, cursor?: number): string {
  if (keyword.length === 0) return prompt;
  const at = cursor === undefined ? prompt.length : Math.max(0, Math.min(cursor, prompt.length));
  const before = prompt.slice(0, at);
  const after = prompt.slice(at);
  const left = before.length > 0 && !before.endsWith(' ') ? `${before} ` : before;
  const right = after.length > 0 && !after.startsWith(' ') ? ` ${after}` : after;
  return left + keyword + right;
}

// ─── Autofill (FR-004, EXTRACTION §6, byte-exact) ──────────────────────────────

/** `Autofill from image` = [subjectAction, environment, mood].filter(Boolean).join(', ') */
export function buildAutofillSentence(state: PromptState): string {
  return [state.subjectAction, state.environment, state.mood]
    .filter((field) => field.length > 0)
    .join(', ');
}

// ─── Director multi-shot (FR-005, D11/N12) ─────────────────────────────────────

/** Source default `klingShotType` (dynamic.ts:997). */
export const DIRECTOR_SHOT_TYPE = 'customize';
/** Source KLING_PROMPT_MAX_CHARS (model-builders.ts:1114, N12). */
export const DIRECTOR_PROMPT_MAX_CHARS = 512;
/** Source max shots: `directorShots.slice(0, 6)` (dynamic.ts:997). */
export const DIRECTOR_MAX_SHOTS = 6;
/** Source duration clamp bounds (clampEvolinkKlingDuration, dynamic.ts:407-409). */
export const DIRECTOR_MIN_TOTAL_DURATION = 3;
export const DIRECTOR_MAX_TOTAL_DURATION = 15;

/** Ordered shot list entry per the SPC-003 contract. */
export interface DirectorShot {
  /** Optional stable identifier (UI key) */
  shotId?: string;
  /** Shot prompt text (free text per shot per EXTRACTION §6) */
  note?: string;
  /** Per-shot duration hint in seconds as string (source Shot.duration); default '5' */
  durationHint?: string;
}

export interface DirectorTimelineShot {
  /** 1-based position AFTER filtering and the 6-shot slice */
  index: number;
  shotId?: string;
  /** Trimmed, ≤512 chars (source normalizeKlingSinglePrompt behavior) */
  prompt: string;
  /** String duration, default '5' (source Shot.duration) */
  duration: string;
}

export interface DirectorTimeline {
  /** Normalized shots: non-empty prompts, default durations, ≤6 entries */
  shots: DirectorTimelineShot[];
  /** 'customize' (source klingShotType default, D11) */
  shotType: string;
  /** Sum of shot durations before the clamp (dynamic.ts:998) */
  totalDuration: number;
  /** totalDuration clamped to 3..15 s (clampEvolinkKlingDuration) */
  clampedDuration: number;
  /** Deterministic text rendering for the target box (engine-defined, see header) */
  timelinePrompt: string;
}

/** Source `normalizeEvolinkKlingShotDuration` (dynamic.ts:392-395). */
function normalizeShotDuration(value: unknown): number {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

/** Source `clampEvolinkKlingDuration` (dynamic.ts:407-409). */
function clampDuration(seconds: number): number {
  return Math.min(Math.max(seconds, DIRECTOR_MIN_TOTAL_DURATION), DIRECTOR_MAX_TOTAL_DURATION);
}

/**
 * Ordered shots → deterministic timeline.
 * `fallbackDuration` stands in for the request-level duration
 * (`shot.duration || request.duration`, dynamic.ts:403).
 */
export function buildDirectorTimeline(
  shots: ReadonlyArray<DirectorShot>,
  fallbackDuration?: string,
): DirectorTimeline {
  const normalized = (shots ?? [])
    .filter((shot) => (shot.note ?? '').trim().length > 0)
    .slice(0, DIRECTOR_MAX_SHOTS)
    .map((shot, index) => ({
      index: index + 1,
      shotId: shot.shotId,
      prompt: (shot.note ?? '').trim().slice(0, DIRECTOR_PROMPT_MAX_CHARS),
      duration: String(normalizeShotDuration(shot.durationHint || fallbackDuration)),
    }));

  const totalDuration = normalized.reduce((sum, shot) => sum + Number(shot.duration), 0);
  const clampedDuration = clampDuration(totalDuration);
  const timelinePrompt = normalized
    .map((shot) => `Shot ${shot.index}: ${shot.prompt} (${shot.duration}s)`)
    .join(' ');

  return { shots: normalized, shotType: DIRECTOR_SHOT_TYPE, totalDuration, clampedDuration, timelinePrompt };
}

// ─── Per-provider aspect defaults (FR-006) ─────────────────────────────────────

/** Target providers of the extension's injection adapters (SPC-002 §Context). */
export type VideoProvider = 'gemini' | 'chatgpt' | 'veo' | 'other';

/**
 * Default aspect applied when `state.aspectRatio` is empty.
 * The source defines exactly one aspect default — state default '16:9'
 * (supplement V23; no video model sets `defaultAspectRatio`). 'auto' exists
 * only as a *supported* ratio for Veo first/last-frame tasks (base.ts:1278),
 * not as a default.
 */
export const PROVIDER_DEFAULT_ASPECT: Readonly<Record<VideoProvider, string>> = {
  gemini: '16:9',
  chatgpt: '16:9',
  veo: '16:9',
  other: '16:9',
};

/** Pure per-provider default lookup (FR-006). */
export function defaultAspect(provider: VideoProvider): string {
  return PROVIDER_DEFAULT_ASPECT[provider] ?? PROVIDER_DEFAULT_ASPECT.other;
}

/** Effective aspect: explicit state value wins; empty falls back to the provider default. */
export function resolveVideoAspect(state: PromptState, provider: VideoProvider): string {
  return state.aspectRatio.trim().length > 0 ? state.aspectRatio : defaultAspect(provider);
}

// ─── Video state (PromptState-compatible extension) ────────────────────────────

/**
 * SPC-001 `PromptState` plus the video-tab fields (FR-007: video composition
 * reuses PromptState + sync()). Assignable to PromptState — no existing
 * type behavior changes.
 */
export interface VideoState extends PromptState {
  /** Free-text video prompt for the current shot (EXTRACTION §6) */
  videoPrompt: string;
  /** One of the 26 VIDEO_MOVEMENTS labels; its promptKeyword is inserted */
  movementLabel: string;
  /** Character offset in videoPrompt where the keyword is inserted; undefined = append */
  movementCursor?: number;
  /** Director multi-shot mode (D11) */
  directorMode: boolean;
  /** Ordered shot list; >6 entries sliced, empty notes dropped */
  directorShots: DirectorShot[];
}

export function createDefaultVideoState(): VideoState {
  return {
    ...createDefaultState(),
    mode: 'video',
    videoPrompt: '',
    movementLabel: '',
    directorMode: false,
    directorShots: [],
  };
}

// ─── Master assembler (FR-004 + FR-007) ────────────────────────────────────────

export interface AssembleVideoOptions {
  /** Model's reference cap for the reference sentence (0/undefined = unlimited) */
  maxReferenceImages?: number;
  /** Reference display token mode; default 'image' (N3) */
  referenceLabelMode?: ReferenceLabelMode;
}

/**
 * Video prompt composition (FR-004): free-text prompt with the movement
 * keyword inserted + autofill fields + reference sentence, joined with single
 * spaces like the SPC-001 assemblers. Photo/edit/anime outputs are untouched.
 *
 * In director mode the prompt fragment is the deterministic timeline text
 * (`buildDirectorTimeline`); the autofill fields still apply.
 */
export function assembleVideo(
  state: VideoState,
  library: PresetLibrary,
  options: AssembleVideoOptions = {},
): string {
  // `library` participates in the barrel signature symmetry with the other
  // assemblers; video mode has no library-resolved catalogs today (movement
  // data is the standalone 26-entry table, EXTRACTION §4.15).

  // Source: `directorShots.length > 0` AFTER filtering empty prompts
  // (getEvolinkKlingDirectorShots) decides multi-shot vs single prompt; an
  // all-empty shot list falls back to the single prompt (body.prompt kept).
  const directorShots = state.directorShots.filter((shot) => (shot.note ?? '').trim().length > 0);
  const prompt = state.directorMode && directorShots.length > 0
    ? buildDirectorTimeline(directorShots).timelinePrompt
    : insertMovementKeyword(
        state.videoPrompt,
        getMovementByLabel(state.movementLabel)?.promptKeyword ?? '',
        state.movementCursor,
      );

  const resolution = resolveReferences(state.references as ReferenceSlotInput[], {
    order: 'generate',
    maxReferenceImages: options.maxReferenceImages,
    labelMode: options.referenceLabelMode,
  });

  const fragments = [prompt, buildAutofillSentence(state), resolution.instruction.display];
  return fragments.filter((fragment) => fragment.length > 0).join(' ');
}
