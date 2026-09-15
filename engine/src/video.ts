/** Video compatibility API backed by the shared scene compiler and timeline policy. */

import type { PresetLibrary, PromptState } from './state.js';
import { createDefaultState } from './state.js';
import { stateToIR } from './compiler/adapter.js';
import { compilePrompt, type CompilationResult } from './compiler/compilers.js';
import { embeddedPresetLibrary } from './library-data.js';
import { normalizeTimeline, DEFAULT_TIMELINE_LIMITS } from './compiler/timeline.js';
import { PromptIRSchema, type PromptIR } from './compiler/ir.js';
import type { Diagnostic } from './compiler/catalog.js';
import {
  getMovementByLabel,
  MOVEMENT_COUNT,
  VIDEO_MOVEMENTS,
  type VideoMovementPromptOption,
} from '../library/video-movements.js';
import type { ReferenceLabelMode } from './references.js';

export { MOVEMENT_COUNT, VIDEO_MOVEMENTS, getMovementByLabel };
export type { VideoMovementPromptOption };

// ─── Movement insertion ("inserted at the cursor") ───────

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

// ─── Autofill ──────────────────────────────

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
export const DIRECTOR_PROMPT_MAX_CHARS = DEFAULT_TIMELINE_LIMITS.maxPromptChars;
/** Source max shots: `directorShots.slice(0, 6)` (dynamic.ts:997). */
export const DIRECTOR_MAX_SHOTS = DEFAULT_TIMELINE_LIMITS.maxShots;
/** Source duration clamp bounds (clampEvolinkKlingDuration, dynamic.ts:407-409). */
export const DIRECTOR_MIN_TOTAL_DURATION = DEFAULT_TIMELINE_LIMITS.minTotalDuration;
export const DIRECTOR_MAX_TOTAL_DURATION = DEFAULT_TIMELINE_LIMITS.maxTotalDuration;

/** Ordered shot list entry per the SPC-003 contract. */
export interface DirectorShot {
  /** Optional stable identifier (UI key) */
  shotId?: string;
  /** Shot prompt text (free text per shot) */
  note?: string;
  /** Per-shot duration hint in seconds as string (source Shot.duration); default '5' */
  durationHint?: string;
  overrides?: NonNullable<NonNullable<PromptIR['motion']>['directorShots']>[number]['overrides'];
}

export interface DirectorTimelineShot {
  /** 1-based position AFTER filtering and the 6-shot slice */
  index: number;
  shotId?: string;
  /** Trimmed text, preserved in full; budget overruns are diagnosed */
  prompt: string;
  /** String duration, default '5' (source Shot.duration) */
  duration: string;
}

export interface DirectorTimeline {
  /** Normalized shots: non-empty prompts, default durations, ≤6 entries */
  shots: DirectorTimelineShot[];
  /** 'customize' (source klingShotType default, D11) */
  shotType: string;
  /** Sum of emitted, adjusted shot durations */
  totalDuration: number;
  /** Compatibility alias for totalDuration */
  clampedDuration: number;
  /** Deterministic text rendering for the target box (engine-defined, see header) */
  timelinePrompt: string;
  referenceResolution?: CompilationResult['referenceResolution'];
  shotReferences?: CompilationResult['shotReferences'];
  requestedTotalDuration: number;
  diagnostics: Diagnostic[];
  droppedShots: Array<{ note: string; duration: number; shotId?: string }>;
}

/**
 * Ordered shots → deterministic timeline.
 * `fallbackDuration` stands in for the request-level duration
 * (`shot.duration || request.duration`, dynamic.ts:403).
 */
export function buildDirectorTimeline(
  shots: ReadonlyArray<DirectorShot>,
  fallbackDuration?: string,
  options: { scene?: Partial<PromptIR>; library?: PresetLibrary; timelineOptions?: PromptIR['timelineOptions'] } = {},
): DirectorTimeline {
  const inputs = (shots ?? []).map(shot => ({
    shotId: shot.shotId, note: shot.note || '', overrides: shot.overrides,
    duration: shot.durationHint?.trim() ? Number(shot.durationHint) : fallbackDuration?.trim() ? Number(fallbackDuration) : 5,
  }));
  const plain = normalizeTimeline(inputs, options.timelineOptions || options.scene?.timelineOptions);
  const compiled = options.scene || (shots ?? []).some(s => s.overrides) ? compilePrompt(PromptIRSchema.parse({ subject: 'a subject', noText: false, ...options.scene, target: options.scene?.target || 'generic', mode: 'video', timelineOptions: options.timelineOptions || options.scene?.timelineOptions, motion: { ...options.scene?.motion, directorShots: inputs } }), options.library || embeddedPresetLibrary) : undefined;
  const result = compiled?.timeline || plain;
  const normalized = result.shots.map(s => ({ index: s.index, shotId: s.shotId, prompt: s.prompt, duration: String(s.duration) }));
  return { shots: normalized, shotType: DIRECTOR_SHOT_TYPE, totalDuration: result.totalDuration,
    clampedDuration: result.totalDuration, requestedTotalDuration: result.requestedTotalDuration,
    timelinePrompt: normalized.map(s => `Shot ${s.index}: ${s.prompt} (${s.duration}s)`).join(' '),
    referenceResolution: compiled?.referenceResolution, shotReferences: compiled?.shotReferences,
    diagnostics: compiled?.diagnostics || result.diagnostics, droppedShots: result.droppedShots };
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
  /** Free-text video prompt for the current shot */
  videoPrompt: string;
  /** Movement catalog ID, label, alias or custom camera instruction */
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

/** Compile video state with shared catalog resolution, spatial semantics and Director inheritance. */
export function assembleVideo(
  state: VideoState,
  library: PresetLibrary,
  options: AssembleVideoOptions = {},
): string {
  const ir = stateToIR({ ...state, mode: 'video' });
  ir.referenceOptions = { ...ir.referenceOptions, ...options };
  const result = compilePrompt(ir, library);
  if (!result.valid) throw new Error(result.diagnostics.filter(d => d.severity === 'error').map(d => d.message).join(' '));
  return result.positivePrompt;
}
