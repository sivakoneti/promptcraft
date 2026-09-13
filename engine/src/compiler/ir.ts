import { z } from 'zod/v4';

export const ModelTargetSchema = z.enum(['midjourney', 'flux', 'sdxl', 'imagen-3', 'kling', 'veo', 'sora', 'runway', 'wan', 'generic']);
export type ModelTarget = z.infer<typeof ModelTargetSchema>;
export const PromptModeSchema = z.enum(['photo', 'anime', 'edit', 'video']);
export const AspectRatioSchema = z.enum(['16:9', '9:16', '1:1', '4:3', '3:4', '21:9', '3:2']);
export type AspectRatio = z.infer<typeof AspectRatioSchema>;
const text = z.string().trim().min(1);
const optionalText = text.optional();
export const OpticsIRSchema = z.object({
  camera: optionalText, lens: optionalText, focalLength: optionalText,
  fStop: text.transform(v => v.replace(/^f\s*\/?\s*/i, '')).refine(v => Number.isFinite(Number(v)) && Number(v) > 0, 'Aperture must be positive').optional(),
  filmStock: optionalText, shotType: optionalText, viewAngle: optionalText,
}).strict();
export type OpticsIR = z.infer<typeof OpticsIRSchema>;
export const LightingIRSchema = z.object({ setup: optionalText, mood: optionalText, timeOfDay: optionalText, colorTemperature: optionalText }).strict();
export type LightingIR = z.infer<typeof LightingIRSchema>;
export const StyleIRSchema = z.object({
  mode: z.enum(['photo', 'anime', 'western-animation', 'illustration', 'cinematic']).optional(),
  movieLook: optionalText, photographer: optionalText, animeShow: optionalText,
  animeGenre: optionalText, westernStyle: optionalText, artStyle: optionalText, genre: optionalText,
}).strict();
export type StyleIR = z.infer<typeof StyleIRSchema>;
export const VideoPhysicsIRSchema = z.object({ forces: z.array(text).optional(), massAndInertia: optionalText, causalChain: optionalText, materialProperties: optionalText, invariance: z.array(text).optional() }).strict();
export type VideoPhysicsIR = z.infer<typeof VideoPhysicsIRSchema>;
export const SpatialBlockingIRSchema = z.object({ foreground: optionalText, midground: optionalText, background: optionalText, rackFocus: optionalText, trajectory: optionalText }).strict();
export type SpatialBlockingIR = z.infer<typeof SpatialBlockingIRSchema>;
export const CameraKinematicsIRSchema = z.object({
  rig: z.enum(['steadicam', 'tripod', 'technocrane', 'handheld', 'fpv-drone', 'dolly-track']).optional(),
  primaryVector: optionalText, secondaryDrift: optionalText,
  shutterAngle: z.enum(['180-degree', '90-degree', '360-degree']).optional(), speedRamp: optionalText,
}).strict();
export type CameraKinematicsIR = z.infer<typeof CameraKinematicsIRSchema>;
export const AnchorFramesIRSchema = z.object({ frame0State: optionalText, transitionVector: optionalText, continuityLock: z.boolean().optional() }).strict();
export type AnchorFramesIR = z.infer<typeof AnchorFramesIRSchema>;
export const ActionChoreographyIRSchema = z.object({ anticipation: optionalText, execution: optionalText, settle: optionalText, audioFoley: optionalText }).strict();
export type ActionChoreographyIR = z.infer<typeof ActionChoreographyIRSchema>;
export const ReferenceSlotSchema = z.object({
  type: z.enum(['global', 'face', 'scene', 'outfit', 'object', 'anonymous']),
  characterIndex: z.number().int().nonnegative().nullable(), image: z.string(), sourcePrompt: z.string().optional(),
}).strict().superRefine((v, ctx) => {
  if (['face', 'outfit', 'object'].includes(v.type) && v.characterIndex === null) ctx.addIssue({ code: 'custom', message: 'Character references require characterIndex', path: ['characterIndex'] });
});
export const ReferenceOptionsSchema = z.object({ maxReferenceImages: z.number().int().nonnegative().optional(), referenceLabelMode: z.enum(['image', 'file']).optional() }).strict();
const motionFields = { movement: optionalText, speed: z.enum(['slow', 'normal', 'fast', 'freeze']).optional(), pacing: optionalText, timelineBeats: z.array(text).optional() };
export const SceneFieldsSchema = z.object({
  subject: optionalText, action: optionalText, environment: optionalText,
  optics: OpticsIRSchema.optional(), lighting: LightingIRSchema.optional(), style: StyleIRSchema.optional(),
  physics: VideoPhysicsIRSchema.optional(), spatial: SpatialBlockingIRSchema.optional(), kinematics: CameraKinematicsIRSchema.optional(),
  anchoring: AnchorFramesIRSchema.optional(), actionChoreography: ActionChoreographyIRSchema.optional(),
  filters: z.array(text).optional(), references: z.array(ReferenceSlotSchema).optional(),
  noText: z.boolean().optional(), candidShot: z.boolean().optional(), showNewAnglePrompt: z.boolean().optional(),
  negativePrompt: optionalText,
}).strict();
export const ShotOverridesSchema = SceneFieldsSchema.extend({ motion: z.object(motionFields).strict().optional() }).strict();
export const DirectorShotIRSchema = z.object({
  shotId: optionalText, note: z.string().trim(), duration: z.number().finite().positive().default(5),
  overrides: ShotOverridesSchema.optional(),
}).strict();
export const MotionIRSchema = z.object({ ...motionFields, directorShots: z.array(DirectorShotIRSchema).optional() }).strict();
export type MotionIR = z.infer<typeof MotionIRSchema>;
export const TimelineOptionsSchema = z.object({
  maxShots: z.number().int().positive().optional(), minTotalDuration: z.number().nonnegative().optional(),
  maxTotalDuration: z.number().positive().optional(), maxPromptChars: z.number().int().positive().optional(),
}).strict().refine(v => v.minTotalDuration === undefined || v.maxTotalDuration === undefined || v.minTotalDuration <= v.maxTotalDuration, 'Minimum duration exceeds maximum');
export const PromptIRSchema = SceneFieldsSchema.extend({
  target: ModelTargetSchema.default('generic'), mode: PromptModeSchema.optional(), subject: text,
  motion: MotionIRSchema.optional(), aspectRatio: text.default('16:9'),
  seed: z.number().int().nonnegative().optional(), quality: z.number().min(0.25).max(2).optional(),
  rawStylize: z.boolean().optional(), noText: z.boolean().default(true),
  referenceOptions: ReferenceOptionsSchema.optional(), timelineOptions: TimelineOptionsSchema.optional(),
  tokenBudget: z.number().int().positive().optional(),
}).strict();
export type PromptIR = z.infer<typeof PromptIRSchema>;
