import type { PresetLibrary } from '../state.js';
import type { PromptIR, ModelTarget } from './ir.js';
import { resolveScene, sentence, type ResolvedScene } from './scene.js';
import { normalizeTimeline, type NormalizedTimeline } from './timeline.js';
import type { Diagnostic } from './catalog.js';

export const TARGET_CAPABILITIES: Record<ModelTarget, { medium: 'image' | 'video' | 'any'; format: string; negativeChannel: boolean }> = {
  midjourney: { medium: 'image', format: 'prose with Midjourney flags', negativeChannel: true },
  flux: { medium: 'image', format: 'natural scene prose', negativeChannel: false },
  sdxl: { medium: 'image', format: 'positive and negative scene descriptions', negativeChannel: true },
  'imagen-3': { medium: 'image', format: 'natural scene prose', negativeChannel: false },
  generic: { medium: 'any', format: 'portable scene prose', negativeChannel: false },
  kling: { medium: 'video', format: 'scene prose or explicit shot timeline', negativeChannel: false },
  runway: { medium: 'video', format: 'camera, subject, scene, physics channels', negativeChannel: false },
  wan: { medium: 'video', format: 'causal scene prose with negative channel', negativeChannel: true },
  sora: { medium: 'video', format: 'causal scene prose', negativeChannel: false },
  veo: { medium: 'video', format: 'optical and environmental blocks', negativeChannel: false },
  'minimax-h3': { medium: 'video', format: 'integrated multimodal description with soundscape and score', negativeChannel: false },
};
export interface CompilationDraft {
  target: ModelTarget; positivePrompt: string; negativePrompt?: string;
  parameters: Record<string, string | number | boolean>;
  diagnostics: Diagnostic[]; warnings: string[]; timeline?: NormalizedTimeline;
  referenceResolution: ResolvedScene['referenceResolution'];
  shotReferences?: Array<{ index: number; resolution: ResolvedScene['referenceResolution'] }>;
}
function renderShotVisual(scene: ResolvedScene): string {
  const { sections: s } = scene;
  return [...s.subject, ...s.lighting, ...s.optics, ...s.style, ...s.spatial, ...s.anchoring, ...s.motion, ...s.choreography, ...s.physics, ...s.constraints, ...s.references].join(' ');
}
function renderScene(scene: ResolvedScene): string {
  const { sections: s, ir } = scene;
  if (ir.target === 'runway') {
    return [
      ['CAMERA', [...s.optics, ...s.motion]], ['SUBJECT', [...s.subject, ...s.choreography]],
      ['SCENE', [...s.lighting, ...s.style, ...s.spatial]], ['PHYSICS', s.physics],
      ['CONTINUITY', s.anchoring], ['CONSTRAINTS', s.constraints], ['REFERENCES', s.references],
    ].filter(([, values]) => (values as string[]).length).map(([label, values]) => `${label}: ${(values as string[]).join(' ')}`).concat(s.audio).join('\n');
  }
  if (ir.target === 'minimax-h3') {
    const visual = renderShotVisual(scene);
    const soundscape = s.audio.map(a => a.replace(/^AUDIO:\s*/i, '')).filter(Boolean).join(' ') || undefined;
    const music = 'N/A';
    const desc = `[Shot 1] ${visual}`;
    return [
      `integrated_multimodal_description: ${desc}`,
      `overall_soundscape: ${soundscape || 'N/A'}`,
      `non_diegetic_music: ${music}`,
    ].join('\n\n');
  }
  const chunks = [...s.subject, ...s.lighting, ...s.optics, ...s.style, ...s.spatial, ...s.anchoring, ...s.motion, ...s.choreography, ...s.physics, ...s.constraints, ...s.references, ...s.audio];
  return chunks.join(ir.target === 'veo' ? '\n' : ' ');
}
/** Nested scene groups merge by field; arrays replace. No defaults are applied to overrides. */
export function inheritShot(ir: PromptIR, overrides: NonNullable<NonNullable<PromptIR['motion']>['directorShots']>[number]['overrides']): PromptIR {
  const { directorShots: _, ...baseMotion } = ir.motion || {};
  const base = { ...ir, motion: baseMotion };
  if (!overrides) return base;
  const merged = { ...base, ...overrides };
  for (const key of ['optics', 'lighting', 'style', 'physics', 'spatial', 'kinematics', 'anchoring', 'actionChoreography', 'motion'] as const) {
    if (base[key] || overrides[key]) Object.assign(merged, { [key]: { ...base[key], ...overrides[key] } });
  }
  return merged;
}
export function renderCompilation(input: PromptIR, library: PresetLibrary): CompilationDraft {
  const scene = resolveScene(input, library);
  const { ir } = scene;
  const diagnostics = [...scene.diagnostics];
  const capability = TARGET_CAPABILITIES[ir.target];
  if (capability.medium !== 'any' && (ir.mode === 'video') !== (capability.medium === 'video')) diagnostics.push({ severity: 'error', code: 'TARGET_MISMATCH', field: 'mode', message: `${ir.target} uses the ${capability.medium} dialect but mode is ${ir.mode}. Choose a compatible target or generic.` });
  const parameters: CompilationDraft['parameters'] = { aspectRatio: ir.aspectRatio };
  if (ir.seed !== undefined) parameters.seed = ir.seed;
  if (ir.quality !== undefined) {
    if (ir.target === 'midjourney') parameters.quality = ir.quality;
    else diagnostics.push({ severity: 'warning', code: 'UNSUPPORTED_FIELD', field: 'quality', message: `quality has no configured mapping for ${ir.target}.` });
  }
  if (ir.rawStylize !== undefined && ir.target !== 'midjourney') diagnostics.push({ severity: 'warning', code: 'UNSUPPORTED_FIELD', field: 'rawStylize', message: `rawStylize is a Midjourney-only setting.` });
  let positivePrompt = renderScene(scene);
  let timeline: NormalizedTimeline | undefined;
  const shotReferences: NonNullable<CompilationDraft['shotReferences']> = [];
  if (ir.mode === 'video' && ir.motion?.directorShots?.length) {
    timeline = normalizeTimeline(ir.motion.directorShots, ir.timelineOptions);
    diagnostics.push(...timeline.diagnostics);
    timeline.shots = timeline.shots.map(shot => {
      const original = ir.motion!.directorShots![shot.sourceIndex];
      const shotScene = resolveScene(inheritShot(ir, original.overrides), library);
      diagnostics.push(...shotScene.diagnostics.map(d => ({ ...d, field: `motion.directorShots.${shot.sourceIndex}.${d.field || 'overrides'}` })));
      shotReferences.push({ index: shot.index, resolution: shotScene.referenceResolution });
      const note = sentence(`Shot action: ${shot.prompt}`);
      const visual = ir.target === 'minimax-h3' ? renderShotVisual(shotScene) : renderScene(shotScene);
      let prompt = `${visual} ${note}`;
      if (shotScene.ir.negativePrompt) prompt += ` ${sentence(`Avoid: ${shotScene.ir.negativePrompt}`)}`;
      const budget = ir.timelineOptions?.maxPromptChars || 512;
      if (prompt.length > budget) diagnostics.push({ severity: 'warning', code: 'SHOT_PROMPT_BUDGET', field: `motion.directorShots.${shot.sourceIndex}`, message: `Expanded shot contains ${prompt.length} characters, above the configured budget ${budget}; preserved in full.` });
      return { ...shot, prompt };
    });
    if (timeline.shots.length) {
      if (ir.target === 'minimax-h3') {
        const formatCut = (seconds: number) => {
          const m = Math.floor(seconds / 60);
          const s = seconds % 60;
          return `${String(m).padStart(2, '0')}:${s.toFixed(3).padStart(6, '0')}`;
        };
        const shotBlocks = timeline.shots.map((s, idx) => {
          const cutPrompt = idx === 0 ? s.prompt : s.prompt.replace(/^A\s+/, 'a ').replace(/^An\s+/, 'an ');
          const cutPrefix = idx === 0 ? `[Shot 1]` : `[Shot ${s.index}] At ${formatCut(s.start)}, the camera cuts to`;
          return `${cutPrefix} ${cutPrompt}`;
        });
        const soundscape = scene.sections.audio.map(a => a.replace(/^AUDIO:\s*/i, '')).filter(Boolean).join(' ') || undefined;
        positivePrompt = [
          `integrated_multimodal_description: ${shotBlocks.join(' ')}`,
          `overall_soundscape: ${soundscape || 'N/A'}`,
          `non_diegetic_music: N/A`,
        ].join('\n\n');
      } else {
        positivePrompt = timeline.shots.map(s => `Shot ${s.index} [${s.start}–${s.end}s; ${s.duration}s]: ${s.prompt}`).join('\n');
      }
      parameters.duration = timeline.totalDuration;
    }
  }
  if (!timeline?.shots.length && ir.negativePrompt && !capability.negativeChannel) positivePrompt += ` ${sentence(`Avoid: ${ir.negativePrompt}`)}`;
  const negativePrompt = [ir.negativePrompt, ir.noText ? 'text, subtitles, captions, watermark' : ''].filter(Boolean).join(', ') || undefined;
  if (ir.target === 'midjourney') {
    const flags = [`--ar ${ir.aspectRatio}`];
    if (ir.rawStylize !== false) { flags.push('--style raw'); parameters.style = 'raw'; }
    if (ir.seed !== undefined) flags.push(`--seed ${ir.seed}`);
    if (ir.quality !== undefined) flags.push(`--q ${ir.quality}`);
    if (negativePrompt) flags.push(`--no ${negativePrompt}`);
    positivePrompt += ` ${flags.join(' ')}`;
  } else if (ir.target === 'minimax-h3') {
    // MiniMax H3 delivers the aspect ratio through the API parameters; prompt body stays pure H3 syntax
  } else {
    positivePrompt += ` ${sentence(`The ${ir.mode === 'video' ? 'video' : 'image'} should be in a ${ir.aspectRatio} format`)}`;
  }
  if (ir.mode !== 'video' && ir.timelineOptions) diagnostics.push({ severity: 'warning', code: 'UNSUPPORTED_FIELD', field: 'timelineOptions', message: 'Timeline limits apply only in video mode.' });
  if (!ir.motion?.directorShots?.length && ir.timelineOptions) diagnostics.push({ severity: 'info', code: 'UNUSED_TIMELINE_OPTIONS', field: 'timelineOptions', message: 'Timeline limits apply only when Director shots are supplied.' });
  return { target: ir.target, positivePrompt, negativePrompt: capability.negativeChannel && !timeline?.shots.length ? negativePrompt : undefined, parameters, diagnostics, warnings: diagnostics.map(d => d.message), timeline, referenceResolution: scene.referenceResolution, shotReferences: shotReferences.length ? shotReferences : undefined };
}
