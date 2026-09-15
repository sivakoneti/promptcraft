/** All legacy modes share the same scene semantics and preset resolution as compile. */
import type { PromptState, PresetLibrary } from './state.js';
import { stateToIR } from './compiler/adapter.js';
import { compilePrompt, type CompilationResult } from './compiler/compilers.js';
export function assembleDetailed(state: PromptState, library: PresetLibrary): CompilationResult {
  return compilePrompt(stateToIR(state), library);
}
export function assemble(state: PromptState, library: PresetLibrary): string {
  const result = assembleDetailed(state, library);
  if (!result.valid) throw new Error(result.diagnostics.filter(d => d.severity === 'error').map(d => d.message).join(' '));
  return result.positivePrompt;
}
export function assemblePhoto(state: PromptState, library: PresetLibrary): string { return assemble({ ...state, mode: 'photo' }, library); }
export function assembleAnime(state: PromptState, library: PresetLibrary): string { return assemble({ ...state, mode: 'anime' }, library); }
export function assembleEdit(state: PromptState, library: PresetLibrary): string { return assemble({ ...state, mode: 'edit' }, library); }
