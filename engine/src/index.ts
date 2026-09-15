/**
 * SPC-001: Public API for @promptcraft/engine package.
 * Pure TypeScript prompt assembly engine — zero DOM, zero Chrome APIs, deterministic.
 */

export {
  type PromptState,
  type PromptMode,
  type ReferenceSlot,
  type BasePreset,
  type AnimePreset,
  type PresetLibrary,
  createDefaultState,
  validateLibrary,
  PRESET_LIBRARY_VERSION,
  BasePresetSchema,
  AnimePresetSchema,
  PresetLibrarySchema,
} from './state.js';

export {
  buildSubjectSentence,
  buildLightingMood,
  buildCameraGear,
  buildPhotographerStyle,
  buildMovieLook,
  buildFilters,
  buildAspectRatio,
  FACE_GUARD,
  NO_TEXT_GUARD,
} from './fragments.js';

export { assemble, assemblePhoto, assembleEdit, assembleAnime } from './assemble.js';

export { sync } from './sync.js';

export {
  resolveReferences,
  CATEGORY_PRIORITY,
  type ReferenceCategory,
  type ReferenceOrder,
  type ReferenceLabelMode,
  type ReferenceSlotInput,
  type ResolvedReference,
  type ReferenceInstruction,
  type ReferenceResolution,
  type ResolveReferencesOptions,
} from './references.js';

export {
  assembleVideo,
  buildAutofillSentence,
  buildDirectorTimeline,
  createDefaultVideoState,
  defaultAspect,
  insertMovementKeyword,
  resolveVideoAspect,
  DIRECTOR_MAX_SHOTS,
  DIRECTOR_MAX_TOTAL_DURATION,
  DIRECTOR_MIN_TOTAL_DURATION,
  DIRECTOR_PROMPT_MAX_CHARS,
  DIRECTOR_SHOT_TYPE,
  PROVIDER_DEFAULT_ASPECT,
  getMovementByLabel,
  MOVEMENT_COUNT,
  VIDEO_MOVEMENTS,
  type VideoState,
  type VideoProvider,
  type DirectorShot,
  type DirectorTimeline,
  type DirectorTimelineShot,
  type AssembleVideoOptions,
  type VideoMovementPromptOption,
} from './video.js';
export {
  CINEMATIC_CAMERA_MOVEMENTS,
  CINEMATIC_MOVEMENTS_COUNT,
  getCinematicMovement,
  type CinematicMovementEntry,
} from '../library/cinematic-movements.js';


export { assembleDetailed } from './assemble.js';
export { normalizeState, stateToIR, PromptStateInputSchema } from './compiler/adapter.js';
export * from './compiler/ir.js';
export * from './compiler/compilers.js';
export { lintPromptIR } from './compiler/linter.js';
export { TARGET_CAPABILITIES } from './compiler/render.js';
export { resolvePreset } from './compiler/catalog.js';
export { normalizeTimeline, DEFAULT_TIMELINE_LIMITS } from './compiler/timeline.js';

export { SCENE_CAPABILITIES } from './compiler/capabilities.js';
