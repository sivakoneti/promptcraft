import { z } from 'zod';

export const ModelTargetSchema = z.enum([
  'midjourney',
  'flux',
  'sdxl',
  'imagen-3',
  'kling',
  'veo',
  'sora',
  'runway',
  'wan',
  'generic',
]);

export type ModelTarget = z.infer<typeof ModelTargetSchema>;

export const AspectRatioSchema = z.enum(['16:9', '9:16', '1:1', '4:3', '3:4', '21:9', '3:2']);
export type AspectRatio = z.infer<typeof AspectRatioSchema>;

export const OpticsIRSchema = z.object({
  camera: z.string().optional(),
  lens: z.string().optional(),
  focalLength: z.string().optional(),
  fStop: z.string().optional(),
  filmStock: z.string().optional(),
  shotType: z.string().optional(),
  viewAngle: z.string().optional(),
});
export type OpticsIR = z.infer<typeof OpticsIRSchema>;

export const LightingIRSchema = z.object({
  setup: z.string().optional(),
  mood: z.string().optional(),
  timeOfDay: z.string().optional(),
  colorTemperature: z.string().optional(),
});
export type LightingIR = z.infer<typeof LightingIRSchema>;

export const StyleIRSchema = z.object({
  mode: z.enum(['photo', 'anime', 'western-animation', 'illustration', 'cinematic']).default('photo'),
  movieLook: z.string().optional(),
  photographer: z.string().optional(),
  animeShow: z.string().optional(),
  animeGenre: z.string().optional(),
  westernStyle: z.string().optional(),
  artStyle: z.string().optional(),
});
export type StyleIR = z.infer<typeof StyleIRSchema>;

export const MotionIRSchema = z.object({
  movement: z.string().optional(),
  speed: z.enum(['slow', 'normal', 'fast', 'freeze']).optional(),
  pacing: z.string().optional(),
  timelineBeats: z.array(z.string()).optional(),
  directorShots: z.array(z.object({
    note: z.string(),
    duration: z.number().min(1).max(15).default(5),
  })).optional(),
});
export type MotionIR = z.infer<typeof MotionIRSchema>;
export const VideoPhysicsIRSchema = z.object({
  forces: z.array(z.string()).optional(),
  massAndInertia: z.string().optional(),
  causalChain: z.string().optional(),
  materialProperties: z.string().optional(),
  invariance: z.array(z.string()).optional(),
});
export type VideoPhysicsIR = z.infer<typeof VideoPhysicsIRSchema>;

export const SpatialBlockingIRSchema = z.object({
  foreground: z.string().optional(),
  midground: z.string().optional(),
  background: z.string().optional(),
  rackFocus: z.string().optional(),
  trajectory: z.string().optional(),
});
export type SpatialBlockingIR = z.infer<typeof SpatialBlockingIRSchema>;

export const CameraKinematicsIRSchema = z.object({
  rig: z.enum(['steadicam', 'tripod', 'technocrane', 'handheld', 'fpv-drone', 'dolly-track']).optional(),
  primaryVector: z.string().optional(),
  secondaryDrift: z.string().optional(),
  shutterAngle: z.enum(['180-degree', '90-degree', '360-degree']).optional(),
  speedRamp: z.string().optional(),
});
export type CameraKinematicsIR = z.infer<typeof CameraKinematicsIRSchema>;

export const AnchorFramesIRSchema = z.object({
  frame0State: z.string().optional(),
  transitionVector: z.string().optional(),
  continuityLock: z.boolean().optional(),
});
export type AnchorFramesIR = z.infer<typeof AnchorFramesIRSchema>;

export const ActionChoreographyIRSchema = z.object({
  anticipation: z.string().optional(),
  execution: z.string().optional(),
  settle: z.string().optional(),
  audioFoley: z.string().optional(),
});
export type ActionChoreographyIR = z.infer<typeof ActionChoreographyIRSchema>;

export const PromptIRSchema = z.object({
  target: ModelTargetSchema.default('generic'),
  subject: z.string(),
  action: z.string().optional(),
  environment: z.string().optional(),
  optics: OpticsIRSchema.optional(),
  lighting: LightingIRSchema.optional(),
  style: StyleIRSchema.optional(),
  motion: MotionIRSchema.optional(),
  physics: VideoPhysicsIRSchema.optional(),
  spatial: SpatialBlockingIRSchema.optional(),
  kinematics: CameraKinematicsIRSchema.optional(),
  anchoring: AnchorFramesIRSchema.optional(),
  actionChoreography: ActionChoreographyIRSchema.optional(),
  aspectRatio: AspectRatioSchema.default('16:9'),
  negativePrompt: z.string().optional(),
  seed: z.number().optional(),
  quality: z.number().min(0.25).max(2).optional(),
  rawStylize: z.boolean().default(true),
  noText: z.boolean().default(true),
});

export type PromptIR = z.infer<typeof PromptIRSchema>;
