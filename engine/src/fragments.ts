/** Compatibility fragment helpers using the same semantics as full assembly. */
import type { PromptState, PresetLibrary } from './state.js';
import { resolvePreset } from './compiler/catalog.js';
import { resolveScene } from './compiler/scene.js';
import { stateToIR } from './compiler/adapter.js';
import { embeddedPresetLibrary } from './library-data.js';
export function lookupPromptValue(library: PresetLibrary, category: keyof Omit<PresetLibrary, 'version'>, id: string): string | null {
  return id?.trim() ? resolvePreset(library, category, id).value : null;
}
export function buildSubjectSentence(state: PromptState, library: PresetLibrary): string {
  return resolveScene(stateToIR(state), library).sections.subject.join(' ');
}
export function buildLightingMood(state: PromptState, library: PresetLibrary): string {
  return resolveScene(stateToIR(state), library).sections.lighting.join(' ');
}
export function buildCameraGear(state: PromptState, library: PresetLibrary): string {
  return resolveScene(stateToIR(state), library).sections.optics.join(' ');
}
export function buildPhotographerStyle(state: PromptState, library: PresetLibrary): string {
  return lookupPromptValue(library, 'photographers', state.photographerId) || '';
}
export function buildMovieLook(state: PromptState, library: PresetLibrary): string {
  return lookupPromptValue(library, 'movieLooks', state.movieLookId) || '';
}
export function buildFilters(state: PromptState, library: PresetLibrary): string {
  return resolveScene(stateToIR(state), library).sections.style.find(s => s.startsWith('Applied effect(s):')) || '';
}
export function buildAspectRatio(state: PromptState): string {
  if (!state.aspectRatio) return '';
  const ratio = resolveScene(stateToIR(state), embeddedPresetLibrary).ir.aspectRatio;
  return `The ${state.mode === 'video' ? 'video' : 'image'} should be in a ${ratio} format.`;
}
export const FACE_GUARD = "Don't blur faces randomly.";
export const NO_TEXT_GUARD = 'Generate the image with no subtitles, captions, or text overlays.';
