import { getCinematicMovement } from '../../library/cinematic-movements.js';
import { getMovementByLabel } from '../../library/video-movements.js';
import { z } from 'zod/v4';
import { createDefaultState, type PromptState } from '../state.js';
import type { VideoState } from '../video.js';
import { PromptIRSchema, ReferenceOptionsSchema, PromptModeSchema, ModelTargetSchema, SpatialBlockingIRSchema, VideoPhysicsIRSchema, CameraKinematicsIRSchema, AnchorFramesIRSchema, ActionChoreographyIRSchema, MotionIRSchema, ReferenceSlotSchema, TimelineOptionsSchema, ShotOverridesSchema, type PromptIR } from './ir.js';
const legacyText = z.string();
export const PromptStateInputSchema = z.object({
  subject: legacyText.optional(), subjectAction: legacyText.optional(), environment: legacyText.optional(), mood: legacyText.optional(),
  lightingId: legacyText.optional(), shotId: legacyText.optional(), cameraId: legacyText.optional(), lensId: legacyText.optional(),
  fStop: legacyText.nullable().optional(), filmId: legacyText.optional(), filters: z.array(legacyText).optional(),
  movieLookId: legacyText.optional(), photographerId: legacyText.optional(), animeGenreId: legacyText.optional(),
  animeShowStyleId: legacyText.optional(), westernAnimationStyleId: legacyText.optional(),
  noText: z.boolean().optional(), showNewAnglePrompt: z.boolean().optional(), candidShot: z.boolean().optional(),
  aspectRatio: legacyText.optional(), mode: PromptModeSchema.optional(), references: z.array(ReferenceSlotSchema).optional(),
  focalLengthId: legacyText.optional(), directionId: legacyText.optional(), genreId: legacyText.optional(),
  styleMode: z.enum(['photo', 'anime', 'western-animation', 'illustration', 'cinematic']).optional(), artStyle: legacyText.optional(),
  target: ModelTargetSchema.optional(), spatial: SpatialBlockingIRSchema.optional(), physics: VideoPhysicsIRSchema.optional(),
  kinematics: CameraKinematicsIRSchema.optional(), anchoring: AnchorFramesIRSchema.optional(), actionChoreography: ActionChoreographyIRSchema.optional(),
  motion: MotionIRSchema.optional(), negativePrompt: legacyText.optional(), seed: z.number().int().nonnegative().optional(), quality: z.number().min(0.25).max(2).optional(),
  rawStylize: z.boolean().optional(), referenceOptions: ReferenceOptionsSchema.optional(),
  tokenBudget: z.number().int().positive().optional(), timelineOptions: TimelineOptionsSchema.optional(), timeOfDay: legacyText.optional(), colorTemperature: legacyText.optional(),
  videoPrompt: legacyText.optional(), movementLabel: legacyText.optional(), movementCursor: z.number().int().nonnegative().optional(),
  directorMode: z.boolean().optional(), directorShots: z.array(z.object({ shotId: legacyText.optional(), note: legacyText.optional(), durationHint: legacyText.optional(), overrides: ShotOverridesSchema.optional() }).strict()).optional(),
}).strict();
export function normalizeState(input: unknown): VideoState {
  return { ...createDefaultState(), videoPrompt: '', movementLabel: '', directorMode: false, directorShots: [], ...PromptStateInputSchema.parse(input) };
}
const nonempty = (s?: string | null) => s?.trim() || undefined;
export function stateToIR(input: PromptState): PromptIR {
  const s = normalizeState(input);
  const subject = nonempty(s.subjectAction) || nonempty(s.subject);
  let videoPrompt = s.mode === 'video' ? nonempty(s.videoPrompt) : undefined;
  if (s.mode === 'video' && s.movementCursor !== undefined && s.movementLabel) {
    const keyword = getMovementByLabel(s.movementLabel)?.promptKeyword || getCinematicMovement(s.movementLabel)?.promptKeyword || s.movementLabel;
    const prompt = videoPrompt || '';
    const at = Math.min(s.movementCursor, prompt.length);
    videoPrompt = [prompt.slice(0, at).trimEnd(), keyword, prompt.slice(at).trimStart()].filter(Boolean).join(' ');
  }
  const motion = { ...s.motion, movement: nonempty(s.movementLabel) || s.motion?.movement };
  if (s.directorMode && s.directorShots.length) motion.directorShots = s.directorShots.map(shot => {
    const duration = shot.durationHint?.trim() ? Number(shot.durationHint) : 5;
    if (!Number.isFinite(duration) || duration <= 0) throw new Error('Director durationHint must be a positive number');
    return { shotId: nonempty(shot.shotId), note: shot.note || '', duration, overrides: shot.overrides };
  });
  return PromptIRSchema.parse({
    target: s.target || 'generic', mode: s.mode, subject: subject || videoPrompt || 'a subject',
    action: subject && videoPrompt && subject !== videoPrompt ? videoPrompt : undefined,
    environment: nonempty(s.environment),
    optics: { camera: nonempty(s.cameraId), lens: nonempty(s.lensId), focalLength: nonempty(s.focalLengthId), fStop: nonempty(s.fStop), filmStock: nonempty(s.filmId), shotType: nonempty(s.shotId), viewAngle: nonempty(s.directionId) },
    lighting: { setup: nonempty(s.lightingId), mood: nonempty(s.mood), timeOfDay: nonempty(s.timeOfDay), colorTemperature: nonempty(s.colorTemperature) },
    style: { mode: s.styleMode, genre: nonempty(s.genreId), photographer: nonempty(s.photographerId), movieLook: nonempty(s.movieLookId), animeGenre: nonempty(s.animeGenreId), animeShow: nonempty(s.animeShowStyleId), westernStyle: nonempty(s.westernAnimationStyleId), artStyle: nonempty(s.artStyle) },
    motion: Object.values(motion).some(v => v !== undefined) ? motion : undefined,
    spatial: s.spatial, physics: s.physics, kinematics: s.kinematics, anchoring: s.anchoring, actionChoreography: s.actionChoreography,
    filters: s.filters.filter(v => v.trim()), references: s.references, aspectRatio: nonempty(s.aspectRatio) || '16:9',
    noText: s.noText, candidShot: s.candidShot, showNewAnglePrompt: s.showNewAnglePrompt,
    negativePrompt: nonempty(s.negativePrompt), rawStylize: s.rawStylize, referenceOptions: s.referenceOptions, seed: s.seed, quality: s.quality, tokenBudget: s.tokenBudget, timelineOptions: s.timelineOptions,
  });
}
