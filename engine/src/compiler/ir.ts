import { z } from 'zod';

export const ModelTargetSchema = z.enum([
  'midjourney',
  'flux',
  'sdxl',
  'imagen-3',
  'kling',
  'veo',
  'sora',
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

export const PromptIRSchema = z.object({
  target: ModelTargetSchema.default('generic'),
  subject: z.string(),
  action: z.string().optional(),
  environment: z.string().optional(),
  optics: OpticsIRSchema.optional(),
  lighting: LightingIRSchema.optional(),
  style: StyleIRSchema.optional(),
  motion: MotionIRSchema.optional(),
  aspectRatio: AspectRatioSchema.default('16:9'),
  negativePrompt: z.string().optional(),
  seed: z.number().optional(),
  quality: z.number().min(0.25).max(2).optional(),
  rawStylize: z.boolean().default(true),
  noText: z.boolean().default(true),
});

export type PromptIR = z.infer<typeof PromptIRSchema>;
