import type { PromptIR } from './ir.js';
import type { PresetLibrary } from '../state.js';
import { lookupPromptValue } from '../fragments.js';

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

export function compileVideo(ir: PromptIR, target: 'kling' | 'veo' | 'sora'): CompilationResult {
  const parts: string[] = [];

  // Action and subject
  parts.push(ir.action ? `${ir.subject} ${ir.action}` : ir.subject);

  // Environment & mood
  if (ir.environment) parts.push(`in ${ir.environment}`);
  if (ir.lighting?.mood) parts.push(`with ${ir.lighting.mood} atmosphere`);

  // Movement
  if (ir.motion?.movement) {
    parts.push(`Camera movement: ${ir.motion.movement}`);
  }
  if (ir.motion?.speed) {
    parts.push(`Speed: ${ir.motion.speed}`);
  }

  // Temporal timeline beats if present
  if (ir.motion?.timelineBeats && ir.motion.timelineBeats.length > 0) {
    const beats = ir.motion.timelineBeats.map((b, i) => `Beat ${i + 1}: ${b}`).join('. ');
    parts.push(beats);
  }

  let promptText = parts.join('. ');
  if (target === 'kling' && ir.motion?.directorShots && ir.motion.directorShots.length > 0) {
    promptText = ir.motion.directorShots
      .slice(0, 6)
      .map((s, idx) => `${idx + 1}: ${s.note.slice(0, 512)} [${s.duration}s]`)
      .join(' ');
  }

  return {
    target,
    positivePrompt: promptText,
    parameters: {
      aspectRatio: ir.aspectRatio,
      duration: ir.motion?.directorShots?.reduce((acc, s) => acc + s.duration, 0) || 5,
    },
  };
}

export function compileGeneric(ir: PromptIR, library: PresetLibrary): CompilationResult {
  return compileFlux(ir, library);
}
