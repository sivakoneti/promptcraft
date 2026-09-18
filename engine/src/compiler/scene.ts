import type { PresetLibrary } from '../state.js';
import { resolveReferences } from '../references.js';
import { getCinematicMovement } from '../../library/cinematic-movements.js';
import { getMovementByLabel } from '../../library/video-movements.js';
import { resolvePreset, type CatalogCategory, type Diagnostic } from './catalog.js';
import type { PromptIR } from './ir.js';

export const VIDEO_TARGETS = ['kling', 'veo', 'sora', 'runway', 'wan', 'minimax-h3'];
export const sentence = (value: string) => value.trim() ? `${value.trim().replace(/[.\s]+$/, '')}.` : '';
export interface SceneSections {
  subject: string[]; lighting: string[]; optics: string[]; style: string[]; spatial: string[];
  motion: string[]; physics: string[]; anchoring: string[]; choreography: string[]; audio: string[];
  constraints: string[]; references: string[];
}
export interface ResolvedScene { ir: PromptIR; sections: SceneSections; diagnostics: Diagnostic[]; referenceResolution: ReturnType<typeof resolveReferences> }

/** Resolve catalog values once, then render semantic sections shared by all dialects. */
export function resolveScene(input: PromptIR, library: PresetLibrary): ResolvedScene {
  const ir = structuredClone(input);
  const diagnostics: Diagnostic[] = [];
  ir.mode ??= VIDEO_TARGETS.includes(ir.target) ? 'video' : ir.style?.mode === 'anime' || ir.style?.animeGenre || ir.style?.animeShow || ir.style?.westernStyle ? 'anime' : 'photo';
  const video = ir.mode === 'video';
  const resolve = (category: CatalogCategory, value: string | undefined, field: string) => {
    if (!value) return '';
    const result = resolvePreset(library, category, value);
    if (result.diagnostic) diagnostics.push({ ...result.diagnostic, field });
    return result.value;
  };
  const s: SceneSections = { subject: [], lighting: [], optics: [], style: [], spatial: [], motion: [], physics: [], anchoring: [], choreography: [], audio: [], constraints: [], references: [] };
  const shot = resolve('shots', ir.optics?.shotType, 'optics.shotType');
  const styleMode = ir.style?.mode || (ir.style?.westernStyle ? 'western-animation' : ir.style?.animeGenre || ir.style?.animeShow || ir.mode === 'anime' ? 'anime' : 'photo');
  const medium = styleMode === 'photo' ? (video ? 'cinematic video' : 'photographic image') : styleMode === 'cinematic' ? (video ? 'cinematic video' : 'cinematic image') : `${styleMode.replace('-', ' ')} ${video ? 'video' : 'image'}`;
  const subject = [ir.subject, ir.action].filter(Boolean).join(', ');
  s.subject.push(ir.mode === 'edit' ? sentence(`Modify the source image to: ${subject}`) : sentence(`${/^[aeiou]/i.test(medium) ? 'An' : 'A'} ${medium} of ${subject}${ir.environment ? `, set in ${ir.environment}` : ''}`));
  if (ir.mode === 'edit') {
    if (ir.environment) s.subject.push(sentence(`Environment: ${ir.environment}`));
    s.subject.push('Preserve source content outside the requested changes.');
  }
  if (shot) s.subject.push(sentence(`Framing: ${shot}`));
  if (ir.optics?.viewAngle) s.subject.push(sentence(`View direction: ${resolve('directions', ir.optics.viewAngle, 'optics.viewAngle')}`));
  if (ir.candidShot) s.subject.push('The subject is unaware of the camera.');
  if (ir.showNewAnglePrompt) s.subject.push('Show the scene from the selected new viewpoint while preserving its identity.');
  const light = resolve('lighting', ir.lighting?.setup, 'lighting.setup');
  if (light) s.lighting.push(sentence(`The scene is illuminated by ${light}${ir.lighting?.mood ? `, creating a ${ir.lighting.mood} atmosphere` : ''}`));
  else if (ir.lighting?.mood) s.lighting.push(sentence(`A ${ir.lighting.mood} atmosphere`));
  if (ir.lighting?.timeOfDay) s.lighting.push(sentence(`Time of day: ${ir.lighting.timeOfDay}`));
  if (ir.lighting?.colorTemperature) s.lighting.push(sentence(`Color temperature: ${ir.lighting.colorTemperature}`));
  if (ir.optics?.camera) s.optics.push(sentence(`Captured with the look of a ${resolve('cameras', ir.optics.camera, 'optics.camera')}`));
  if (ir.optics?.lens) s.optics.push(sentence(`Lens: ${resolve('lenses', ir.optics.lens, 'optics.lens')}`));
  if (ir.optics?.focalLength) s.optics.push(sentence(`Focal length: ${resolve('focalLengths', ir.optics.focalLength, 'optics.focalLength')}`));
  if (ir.optics?.fStop) s.optics.push(sentence(`Aperture: f/${ir.optics.fStop}`));
  if (ir.optics?.filmStock) s.optics.push(sentence(`Film texture: ${resolve('filmStocks', ir.optics.filmStock, 'optics.filmStock')}`));
  for (const [field, category] of [['photographer', 'photographers'], ['movieLook', 'movieLooks'], ['genre', 'genres']] as const) {
    if (ir.style?.[field]) s.style.push(sentence(resolve(category, ir.style[field], `style.${field}`)));
  }
  for (const [field, category] of [['animeGenre', 'animeGenres'], ['animeShow', 'animeShowStyles'], ['westernStyle', 'westernAnimationStyles']] as const) {
    const value = ir.style?.[field];
    if (!value) continue;
    const result = resolvePreset(library, category, value);
    if (result.diagnostic) diagnostics.push({ ...result.diagnostic, field: `style.${field}` });
    const preset = result.preset;
    s.style.push(preset && 'pre' in preset ? `${preset.pre} ${preset.post}` : sentence(`Style: ${result.value}`));
  }
  if (ir.style?.mode && ir.mode === 'edit') s.style.push(sentence(`Rendering medium: ${ir.style.mode}`));
  if (ir.style?.artStyle) s.style.push(sentence(`Art direction: ${ir.style.artStyle}`));
  if (ir.filters?.length) s.style.push(sentence(`Applied effect(s): ${ir.filters.map((v, i) => resolve('filters', v, `filters.${i}`)).join(', ')}`));
  for (const field of ['foreground', 'midground', 'background'] as const) if (ir.spatial?.[field]) s.spatial.push(sentence(`${field[0].toUpperCase()}${field.slice(1)}: ${ir.spatial[field]}`));
  if (ir.physics?.materialProperties) s.physics.push(sentence(`Material properties: ${ir.physics.materialProperties}`));
  if (ir.physics?.invariance?.length) s.constraints.push(sentence(`Preserve: ${ir.physics.invariance.join('; ')}`));
  if (video) {
    if (ir.spatial?.trajectory) s.spatial.push(sentence(`Subject trajectory: ${ir.spatial.trajectory}`));
    if (ir.spatial?.rackFocus) s.spatial.push(sentence(`Focus transition: ${ir.spatial.rackFocus}`));
    if (ir.motion?.movement) {
      const movement = getCinematicMovement(ir.motion.movement);
      const keyword = getMovementByLabel(ir.motion.movement);
      // Explicit speed overrides the recipe speed; never append a contradictory default speed.
      s.motion.push(movement ? sentence(`${movement.label}: ${movement.movement}. ${ir.motion.speed ? '' : `Speed: ${movement.speed}. `}Framing: ${movement.framing}. End: ${movement.end}`) : sentence(keyword?.promptKeyword || ir.motion.movement));
      if (!movement && !keyword) diagnostics.push({ severity: 'info', code: 'CUSTOM_MOVEMENT', field: 'motion.movement', message: `Movement '${ir.motion.movement}' is preserved as custom text.` });
    }
    if (ir.motion?.speed) s.motion.push(ir.motion.speed === 'freeze' ? 'Hold the subject and camera still throughout the shot.' : sentence(`Motion speed: ${ir.motion.speed}`));
    if (ir.motion?.pacing) s.motion.push(sentence(`Pacing: ${ir.motion.pacing}`));
    if (ir.motion?.timelineBeats?.length) s.choreography.push(sentence(`Continuous action beats, in order without cuts: ${ir.motion.timelineBeats.map((v, i) => `${i + 1}) ${v}`).join('; ')}`));
    for (const [field, label] of [['rig', 'Rig'], ['primaryVector', 'Primary camera vector'], ['secondaryDrift', 'Secondary camera drift'], ['shutterAngle', 'Shutter angle'], ['speedRamp', 'Speed ramp']] as const) if (ir.kinematics?.[field]) s.motion.push(sentence(`${label}: ${ir.kinematics[field]}`));
    if (ir.physics?.massAndInertia) s.physics.push(sentence(`Mass and inertia: ${ir.physics.massAndInertia}`));
    if (ir.physics?.forces?.length) s.physics.push(sentence(`Forces: ${ir.physics.forces.join('; ')}`));
    if (ir.physics?.causalChain) s.physics.push(sentence(`Cause and effect: ${ir.physics.causalChain}`));
    if (ir.anchoring?.frame0State) s.anchoring.push(sentence(`Starting frame: ${ir.anchoring.frame0State}`));
    if (ir.anchoring?.transitionVector) s.anchoring.push(sentence(`Transition to the next frame: ${ir.anchoring.transitionVector}`));
    if (ir.anchoring?.continuityLock !== undefined) s.anchoring.push(ir.anchoring.continuityLock ? 'Maintain subject identity, wardrobe, geometry, screen direction and lighting continuity between frames and shots.' : 'Continuity lock is off; allow the explicitly described changes between frames and shots.');
    for (const [field, label] of [['anticipation', 'Anticipation'], ['execution', 'Execution'], ['settle', 'Follow-through']] as const) if (ir.actionChoreography?.[field]) s.choreography.push(sentence(`${label}: ${ir.actionChoreography[field]}`));
    if (ir.actionChoreography?.audioFoley) s.audio.push(sentence(`AUDIO: ${ir.actionChoreography.audioFoley}`));
  } else {
    const temporal: Array<[string, unknown]> = [['motion', ir.motion], ['kinematics', ir.kinematics], ['anchoring', ir.anchoring], ['actionChoreography', ir.actionChoreography], ['spatial.trajectory', ir.spatial?.trajectory], ['spatial.rackFocus', ir.spatial?.rackFocus], ['physics.forces', ir.physics?.forces], ['physics.massAndInertia', ir.physics?.massAndInertia], ['physics.causalChain', ir.physics?.causalChain]];
    for (const [field, value] of temporal) if (value !== undefined) diagnostics.push({ severity: 'warning', code: 'UNSUPPORTED_FIELD', field, message: `${field} describes temporal behavior and is not rendered in ${ir.mode} mode. Use video mode to retain it.` });
  }
  if (!video) s.constraints.push("Don't blur faces randomly.");
  if (ir.noText) s.constraints.push(`Generate the ${video ? 'video' : 'image'} with no subtitles, captions, or text overlays.`);
  const references = resolveReferences(ir.references || [], { order: ir.mode === 'edit' ? 'edit' : 'generate', maxReferenceImages: ir.referenceOptions?.maxReferenceImages, labelMode: ir.referenceOptions?.referenceLabelMode });
  if (references.instruction.full) s.references.push(video ? references.instruction.full.replace('Create a new image', 'Create a video') : references.instruction.full);
  if (references.overflow.length) diagnostics.push({ severity: 'warning', code: 'REFERENCE_OVERFLOW', field: 'references', message: `${references.overflow.length} references exceed the configured cap; see referenceResolution.overflow.` });
  const aspect = library.aspectRatios.find(p => p.id === ir.aspectRatio || p.label === ir.aspectRatio || p.promptValue === ir.aspectRatio)?.promptValue || ir.aspectRatio;
  if (!/^\d+(?:\.\d+)?:\d+(?:\.\d+)?$/.test(aspect) || aspect.split(':').some(v => Number(v) <= 0)) diagnostics.push({ severity: 'error', code: 'INVALID_ASPECT_RATIO', field: 'aspectRatio', message: `Invalid aspect ratio '${ir.aspectRatio}'. Use a catalog ID or positive width:height ratio.` });
  ir.aspectRatio = aspect;
  return { ir, sections: s, diagnostics, referenceResolution: references };
}
