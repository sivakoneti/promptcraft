import type { PromptIR } from './ir.js';
import type { PresetLibrary } from '../state.js';
import { lookupPromptValue } from '../fragments.js';
import { getCinematicMovement } from '../../library/cinematic-movements.js';
export interface CompilationResult {
  target: string;
  positivePrompt: string;
  negativePrompt?: string;
  parameters: Record<string, string | number | boolean>;
  warnings?: string[];
}

export function compileMidjourney(ir: PromptIR, library: PresetLibrary): CompilationResult {
  const chunks: string[] = [];

  // 1. Subject and action
  const subjectText = ir.action ? `${ir.subject} ${ir.action}` : ir.subject;
  chunks.push(subjectText);

  // 2. Environment
  if (ir.environment) {
    chunks.push(`in ${ir.environment}`);
  }

  // 3. Style / Movie look / Anime / Photographer
  if (ir.style?.movieLook) {
    const ml = lookupPromptValue(library, 'movieLooks', ir.style.movieLook);
    chunks.push(ml || ir.style.movieLook);
  }
  if (ir.style?.photographer) {
    const ph = lookupPromptValue(library, 'photographers', ir.style.photographer);
    chunks.push(ph || ir.style.photographer);
  }
  if (ir.style?.animeShow) {
    const style = library.animeShowStyles.find(
      (s) => s.id.toLowerCase() === ir.style?.animeShow?.toLowerCase(),
    );
    if (style) chunks.push(`${style.pre} ${style.post}`);
    else chunks.push(ir.style.animeShow);
  }

  // 4. Optics & Film
  if (ir.optics?.shotType) {
    const shot = lookupPromptValue(library, 'shots', ir.optics.shotType);
    chunks.push(shot || ir.optics.shotType);
  }
  if (ir.optics?.camera) {
    const cam = lookupPromptValue(library, 'cameras', ir.optics.camera);
    chunks.push(`shot on ${cam || ir.optics.camera}`);
  }
  if (ir.optics?.lens) {
    const lens = lookupPromptValue(library, 'lenses', ir.optics.lens);
    chunks.push(lens || ir.optics.lens);
  }
  if (ir.optics?.filmStock) {
    const film = lookupPromptValue(library, 'filmStocks', ir.optics.filmStock);
    chunks.push(film || ir.optics.filmStock);
  }

  // 5. Lighting
  if (ir.lighting?.setup) {
    const lit = lookupPromptValue(library, 'lighting', ir.lighting.setup);
    chunks.push(lit || ir.lighting.setup);
  }
  if (ir.lighting?.mood) {
    chunks.push(`${ir.lighting.mood} atmosphere`);
  }

  // Midjourney parameter flags
  const flags: string[] = [];
  flags.push(`--ar ${ir.aspectRatio}`);
  if (ir.rawStylize) flags.push('--style raw');
  flags.push('--v 6.1');
  if (ir.noText) flags.push('--no text, watermark, signature, blurry');

  const positivePrompt = `${chunks.filter(Boolean).join(', ')} ${flags.join(' ')}`.trim();

  return {
    target: 'midjourney',
    positivePrompt,
    negativePrompt: ir.noText ? 'text, watermark, signature, blurry' : undefined,
    parameters: {
      ar: ir.aspectRatio,
      style: 'raw',
      v: '6.1',
    },
  };
}

export function compileFlux(ir: PromptIR, library: PresetLibrary): CompilationResult {
  // Flux and modern T5-XXL text encoders perform best with rich natural descriptive paragraphs
  const sentences: string[] = [];

  const subjectClause = ir.action ? `${ir.subject}, actively ${ir.action}` : ir.subject;
  const envClause = ir.environment ? `, situated within ${ir.environment}` : '';
  const shotClause = ir.optics?.shotType
    ? `${lookupPromptValue(library, 'shots', ir.optics.shotType) || ir.optics.shotType} of `
    : '';

  sentences.push(`A detailed, high-resolution photograph capturing ${shotClause}${subjectClause}${envClause}.`);

  // Lighting & Mood
  if (ir.lighting?.setup || ir.lighting?.mood) {
    const lit = ir.lighting?.setup ? lookupPromptValue(library, 'lighting', ir.lighting.setup) || ir.lighting.setup : '';
    const mood = ir.lighting?.mood ? `evoking a ${ir.lighting.mood} atmosphere` : '';
    const lightText = [lit ? `illuminated by ${lit}` : '', mood].filter(Boolean).join(', ');
    if (lightText) sentences.push(`The scene is ${lightText}.`);
  }

  // Optics & Hardware
  const gearParts: string[] = [];
  if (ir.optics?.camera) {
    gearParts.push(`captured on a ${lookupPromptValue(library, 'cameras', ir.optics.camera) || ir.optics.camera}`);
  }
  if (ir.optics?.lens) {
    gearParts.push(`paired with a ${lookupPromptValue(library, 'lenses', ir.optics.lens) || ir.optics.lens}`);
  }
  if (ir.optics?.fStop) {
    gearParts.push(`at f/${ir.optics.fStop}`);
  }
  if (ir.optics?.filmStock) {
    gearParts.push(`rendering with the authentic texture and grain of ${lookupPromptValue(library, 'filmStocks', ir.optics.filmStock) || ir.optics.filmStock} film`);
  }
  if (gearParts.length > 0) {
    sentences.push(`${gearParts.join(', ')}.`);
  }

  // Style / Aesthetic
  if (ir.style?.movieLook) {
    const ml = lookupPromptValue(library, 'movieLooks', ir.style.movieLook) || ir.style.movieLook;
    sentences.push(`${ml}.`);
  }
  if (ir.style?.animeShow) {
    const style = library.animeShowStyles.find(
      (s) => s.id.toLowerCase() === ir.style?.animeShow?.toLowerCase(),
    );
    if (style) sentences.push(`${style.pre} ${style.post}`);
  }

  if (ir.noText) {
    sentences.push('The image has immaculate clarity with no digital artifacts, text, or subtitles.');
  }

  return {
    target: 'flux',
    positivePrompt: sentences.join(' '),
    parameters: {
      aspectRatio: ir.aspectRatio,
      guidanceScale: 3.5,
      steps: 28,
    },
  };
}
function resolveMovementRecipe(movement: string): string {
  const cinematic = getCinematicMovement(movement);
  if (cinematic) {
    return `${cinematic.label} (${cinematic.movement}, ${cinematic.speed}, ${cinematic.framing})`;
  }
  return movement;
}

export function compileRunway(ir: PromptIR, library: PresetLibrary): CompilationResult {
  const cameraParts: string[] = [];
  if (ir.kinematics?.rig) cameraParts.push(`Rig: ${ir.kinematics.rig}`);
  if (ir.motion?.movement) cameraParts.push(resolveMovementRecipe(ir.motion.movement));
  if (ir.kinematics?.primaryVector) cameraParts.push(`Vector: ${ir.kinematics.primaryVector}`);
  if (ir.kinematics?.secondaryDrift) cameraParts.push(`Drift: ${ir.kinematics.secondaryDrift}`);
  if (ir.kinematics?.shutterAngle) cameraParts.push(`${ir.kinematics.shutterAngle} shutter`);
  if (ir.optics?.camera) {
    const cam = lookupPromptValue(library, 'cameras', ir.optics.camera) || ir.optics.camera;
    cameraParts.push(`Shot on ${cam}`);
  }
  if (ir.optics?.lens) {
    const lens = lookupPromptValue(library, 'lenses', ir.optics.lens) || ir.optics.lens;
    cameraParts.push(`Lens: ${lens}`);
  }
  if (ir.optics?.shotType) {
    const shot = lookupPromptValue(library, 'shots', ir.optics.shotType) || ir.optics.shotType;
    cameraParts.push(`Framing: ${shot}`);
  }

  const subjectParts: string[] = [];
  subjectParts.push(ir.subject);
  if (ir.action) subjectParts.push(ir.action);
  if (ir.actionChoreography?.anticipation) subjectParts.push(`Anticipation: ${ir.actionChoreography.anticipation}`);
  if (ir.actionChoreography?.execution) subjectParts.push(`Execution: ${ir.actionChoreography.execution}`);
  if (ir.actionChoreography?.settle) subjectParts.push(`Follow-through: ${ir.actionChoreography.settle}`);
  if (ir.style?.movieLook) {
    const ml = lookupPromptValue(library, 'movieLooks', ir.style.movieLook) || ir.style.movieLook;
    subjectParts.push(`Aesthetic: ${ml}`);
  }

  const sceneParts: string[] = [];
  if (ir.environment) sceneParts.push(ir.environment);
  if (ir.spatial?.foreground) sceneParts.push(`Foreground: ${ir.spatial.foreground}`);
  if (ir.spatial?.midground) sceneParts.push(`Midground: ${ir.spatial.midground}`);
  if (ir.spatial?.background) sceneParts.push(`Background: ${ir.spatial.background}`);
  if (ir.spatial?.rackFocus) sceneParts.push(`Focus transition: ${ir.spatial.rackFocus}`);
  if (ir.lighting?.setup) {
    const lit = lookupPromptValue(library, 'lighting', ir.lighting.setup) || ir.lighting.setup;
    sceneParts.push(`Lighting: ${lit}`);
  }
  if (ir.lighting?.mood) sceneParts.push(`Atmosphere: ${ir.lighting.mood}`);

  const physicsParts: string[] = [];
  if (ir.physics?.massAndInertia) physicsParts.push(`Mass & Inertia: ${ir.physics.massAndInertia}`);
  if (ir.physics?.forces && ir.physics.forces.length > 0) physicsParts.push(`Forces: ${ir.physics.forces.join(', ')}`);
  if (ir.physics?.causalChain) physicsParts.push(`Causality: ${ir.physics.causalChain}`);
  if (ir.physics?.invariance && ir.physics.invariance.length > 0) {
    physicsParts.push(`Invariance: ${ir.physics.invariance.join(', ')}`);
  }

  const channels: string[] = [];
  if (cameraParts.length > 0) channels.push(`CAMERA: ${cameraParts.join('. ')}.`);
  if (subjectParts.length > 0) channels.push(`SUBJECT: ${subjectParts.join('. ')}.`);
  if (sceneParts.length > 0) channels.push(`SCENE: ${sceneParts.join('. ')}.`);
  if (physicsParts.length > 0) channels.push(`PHYSICS: ${physicsParts.join('. ')}.`);

  return {
    target: 'runway',
    positivePrompt: channels.join('\n'),
    parameters: {
      aspectRatio: ir.aspectRatio,
    },
  };
}

export function compileKling(ir: PromptIR, library: PresetLibrary): CompilationResult {
  // Director timeline mode if directorShots present
  if (ir.motion?.directorShots && ir.motion.directorShots.length > 0) {
    const shots = ir.motion.directorShots
      .slice(0, 6)
      .map((s, idx) => `${idx + 1}: ${s.note.slice(0, 512)} [${s.duration}s]`)
      .join(' ');
    let promptText = shots;
    if (ir.actionChoreography?.audioFoley) {
      promptText += `\nAUDIO: ${ir.actionChoreography.audioFoley}.`;
    }
    return {
      target: 'kling',
      positivePrompt: promptText,
      parameters: {
        aspectRatio: ir.aspectRatio,
        duration: ir.motion.directorShots.reduce((acc, s) => acc + s.duration, 0),
      },
    };
  }

  // Multi-beat / rich single shot synthesis
  const shots: string[] = [];
  const framing = ir.optics?.shotType
    ? lookupPromptValue(library, 'shots', ir.optics.shotType) || ir.optics.shotType
    : 'Cinematic shot';

  // Shot 1: Anticipation / Frame 0
  const shot1Parts: string[] = [];
  if (ir.anchoring?.frame0State) {
    shot1Parts.push(ir.anchoring.frame0State);
  } else {
    shot1Parts.push(`${framing} of ${ir.subject}`);
    if (ir.environment) shot1Parts.push(`positioned in ${ir.environment}`);
  }
  if (ir.spatial?.foreground || ir.spatial?.midground || ir.spatial?.background) {
    const spatialPlanes = [
      ir.spatial.foreground ? `foreground: ${ir.spatial.foreground}` : '',
      ir.spatial.midground ? `midground: ${ir.spatial.midground}` : '',
      ir.spatial.background ? `background: ${ir.spatial.background}` : '',
    ].filter(Boolean).join(', ');
    shot1Parts.push(`Spatial depth: ${spatialPlanes}`);
  }
  if (ir.actionChoreography?.anticipation) {
    shot1Parts.push(`Anticipation: ${ir.actionChoreography.anticipation}`);
  }
  shots.push(`1: ${shot1Parts.join('. ')} [2s]`);

  // Shot 2: Kinetic execution & movement
  const shot2Parts: string[] = [];
  const action = ir.actionChoreography?.execution || ir.action || 'actively engaged in motion';
  shot2Parts.push(action);
  if (ir.motion?.movement) {
    shot2Parts.push(resolveMovementRecipe(ir.motion.movement));
  }
  if (ir.kinematics?.rig) {
    shot2Parts.push(`Rig: ${ir.kinematics.rig}`);
  }
  if (ir.physics?.causalChain) {
    shot2Parts.push(ir.physics.causalChain);
  }
  if (ir.actionChoreography?.settle) {
    shot2Parts.push(`Follow-through: ${ir.actionChoreography.settle}`);
  }
  shots.push(`2: ${shot2Parts.join('. ')} [3s]`);

  let promptText = shots.join(' ');
  if (ir.actionChoreography?.audioFoley) {
    promptText += `\nAUDIO: ${ir.actionChoreography.audioFoley}.`;
  }
  if (ir.physics?.invariance && ir.physics.invariance.length > 0) {
    promptText += `\nInvariance: ${ir.physics.invariance.join(', ')}.`;
  }

  return {
    target: 'kling',
    positivePrompt: promptText,
    parameters: {
      aspectRatio: ir.aspectRatio,
      duration: 5,
    },
  };
}

export function compileWan(ir: PromptIR, library: PresetLibrary): CompilationResult {
  const sentences: string[] = [];

  // Initial setup & spatial planes
  if (ir.anchoring?.frame0State) {
    sentences.push(`${ir.anchoring.frame0State}.`);
  } else {
    const framing = ir.optics?.shotType
      ? `${lookupPromptValue(library, 'shots', ir.optics.shotType) || ir.optics.shotType} of `
      : '';
    const env = ir.environment ? ` in ${ir.environment}` : '';
    sentences.push(`A cinematic ${framing}${ir.subject}${env}.`);
  }

  // 3-Plane Spatial blocking
  if (ir.spatial?.foreground || ir.spatial?.midground || ir.spatial?.background) {
    const planes: string[] = [];
    if (ir.spatial.foreground) planes.push(`in the foreground, ${ir.spatial.foreground}`);
    if (ir.spatial.midground) planes.push(`in the midground, ${ir.spatial.midground}`);
    if (ir.spatial.background) planes.push(`in the background, ${ir.spatial.background}`);
    sentences.push(`The scene is composed with distinct depth planes: ${planes.join('; ')}.`);
  }
  if (ir.spatial?.rackFocus) {
    sentences.push(`Dynamic focus: ${ir.spatial.rackFocus}.`);
  }

  // Kinetic action & causal physics
  const actionParts: string[] = [];
  if (ir.actionChoreography?.anticipation) actionParts.push(ir.actionChoreography.anticipation);
  if (ir.actionChoreography?.execution || ir.action) {
    actionParts.push(ir.actionChoreography?.execution || ir.action!);
  }
  if (ir.physics?.massAndInertia) actionParts.push(`with ${ir.physics.massAndInertia}`);
  if (ir.physics?.causalChain) actionParts.push(`resulting in ${ir.physics.causalChain}`);
  if (ir.actionChoreography?.settle) actionParts.push(`settling with ${ir.actionChoreography.settle}`);
  if (actionParts.length > 0) {
    sentences.push(actionParts.join(', ') + '.');
  }

  // Camera kinematics
  const cameraParts: string[] = [];
  if (ir.kinematics?.rig) cameraParts.push(`on a ${ir.kinematics.rig} rig`);
  if (ir.motion?.movement) cameraParts.push(resolveMovementRecipe(ir.motion.movement));
  if (ir.kinematics?.primaryVector) cameraParts.push(ir.kinematics.primaryVector);
  if (ir.kinematics?.shutterAngle) cameraParts.push(`${ir.kinematics.shutterAngle} shutter angle`);
  if (ir.optics?.camera) {
    const cam = lookupPromptValue(library, 'cameras', ir.optics.camera) || ir.optics.camera;
    cameraParts.push(`captured on ${cam}`);
  }
  if (ir.optics?.lens) {
    const lens = lookupPromptValue(library, 'lenses', ir.optics.lens) || ir.optics.lens;
    cameraParts.push(`with ${lens}`);
  }
  if (cameraParts.length > 0) {
    sentences.push(`Camera kinematics: ${cameraParts.join(', ')}.`);
  }

  // Lighting & Movie style
  if (ir.lighting?.setup || ir.lighting?.mood) {
    const lit = ir.lighting?.setup ? lookupPromptValue(library, 'lighting', ir.lighting.setup) || ir.lighting.setup : '';
    const mood = ir.lighting?.mood ? `${ir.lighting.mood} atmosphere` : '';
    const lightDesc = [lit, mood].filter(Boolean).join(' with ');
    sentences.push(`Illuminated by ${lightDesc}.`);
  }
  if (ir.style?.movieLook) {
    const ml = lookupPromptValue(library, 'movieLooks', ir.style.movieLook) || ir.style.movieLook;
    sentences.push(`${ml}.`);
  }

  // Negative physics & geometric invariance
  const invariants = [
    ...(ir.physics?.invariance || []),
    'no morphing',
    'no rubberized physics',
    'no ghost limbs',
    'no frame flickering',
    'zero anatomical warping',
  ];
  sentences.push(`Maintain physical consistency: ${invariants.join(', ')}.`);

  return {
    target: 'wan',
    positivePrompt: sentences.join(' '),
    negativePrompt: 'morphing, melting, rubber physics, distorted anatomy, jitter, flickering, blurry motion',
    parameters: {
      aspectRatio: ir.aspectRatio,
    },
  };
}

export function compileVeo(ir: PromptIR, library: PresetLibrary): CompilationResult {
  const blocks: string[] = [];

  const framing = ir.optics?.shotType
    ? lookupPromptValue(library, 'shots', ir.optics.shotType) || ir.optics.shotType
    : 'Cinematic composition';
  blocks.push(`${framing} of ${ir.action ? `${ir.subject} ${ir.action}` : ir.subject}.`);

  if (ir.environment) {
    blocks.push(`Environment: ${ir.environment}.`);
  }

  // Optics specification
  const opticsList: string[] = [];
  if (ir.optics?.camera) {
    opticsList.push(lookupPromptValue(library, 'cameras', ir.optics.camera) || ir.optics.camera);
  }
  if (ir.optics?.lens) {
    opticsList.push(lookupPromptValue(library, 'lenses', ir.optics.lens) || ir.optics.lens);
  }
  if (ir.optics?.fStop) opticsList.push(`f/${ir.optics.fStop}`);
  if (ir.kinematics?.shutterAngle) opticsList.push(`${ir.kinematics.shutterAngle} shutter angle`);
  if (opticsList.length > 0) {
    blocks.push(`Optical parameters: ${opticsList.join(', ')}.`);
  }

  // Kinematics & movement
  const motionList: string[] = [];
  if (ir.kinematics?.rig) motionList.push(`Rig: ${ir.kinematics.rig}`);
  if (ir.motion?.movement) motionList.push(resolveMovementRecipe(ir.motion.movement));
  if (ir.kinematics?.primaryVector) motionList.push(ir.kinematics.primaryVector);
  if (motionList.length > 0) {
    blocks.push(`Camera movement: ${motionList.join(', ')}.`);
  }

  // Spatial blocking
  if (ir.spatial?.foreground || ir.spatial?.midground || ir.spatial?.background) {
    blocks.push(`Spatial depth: Foreground: ${ir.spatial.foreground || 'natural atmospheric falloff'}; Midground: ${ir.spatial.midground || ir.subject}; Background: ${ir.spatial.background || ir.environment || 'soft perspective'}.`);
  }

  // Physics & dynamics
  if (ir.physics?.massAndInertia || ir.physics?.causalChain) {
    const phys: string[] = [];
    if (ir.physics.massAndInertia) phys.push(ir.physics.massAndInertia);
    if (ir.physics.causalChain) phys.push(ir.physics.causalChain);
    blocks.push(`Physical dynamics: ${phys.join('; ')}.`);
  }

  // Lighting & Style
  if (ir.lighting?.setup) {
    blocks.push(`Lighting: ${lookupPromptValue(library, 'lighting', ir.lighting.setup) || ir.lighting.setup}.`);
  }
  if (ir.style?.movieLook) {
    blocks.push(`Color grade: ${lookupPromptValue(library, 'movieLooks', ir.style.movieLook) || ir.style.movieLook}.`);
  }

  return {
    target: 'veo',
    positivePrompt: blocks.join('\n'),
    parameters: {
      aspectRatio: ir.aspectRatio,
    },
  };
}

export function compileVideo(
  ir: PromptIR,
  target: 'kling' | 'veo' | 'sora' | 'runway' | 'wan',
  library: PresetLibrary,
): CompilationResult {
  switch (target) {
    case 'runway':
      return compileRunway(ir, library);
    case 'kling':
      return compileKling(ir, library);
    case 'wan':
    case 'sora':
      return compileWan(ir, library);
    case 'veo':
      return compileVeo(ir, library);
    default:
      return compileKling(ir, library);
  }
}

export function compileGeneric(ir: PromptIR, library: PresetLibrary): CompilationResult {
  return compileFlux(ir, library);
}

export function compilePrompt(ir: PromptIR, library: PresetLibrary): CompilationResult {
  switch (ir.target) {
    case 'midjourney':
      return compileMidjourney(ir, library);
    case 'flux':
      return compileFlux(ir, library);
    case 'kling':
    case 'veo':
    case 'sora':
    case 'runway':
    case 'wan':
      return compileVideo(ir, ir.target, library);
    default:
      return compileGeneric(ir, library);
  }
}
