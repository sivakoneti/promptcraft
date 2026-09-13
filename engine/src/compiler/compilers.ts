import type { PresetLibrary } from '../state.js';
import { PromptIRSchema, type PromptIR, type ModelTarget } from './ir.js';
import { renderCompilation, type CompilationDraft } from './render.js';
import { lintPromptIR, type LintReport } from './linter.js';
export interface CompilationResult extends CompilationDraft { valid: boolean; lint: LintReport }
export function compilePrompt(input: PromptIR, library: PresetLibrary): CompilationResult {
  const ir = PromptIRSchema.parse(input);
  const result = renderCompilation(ir, library);
  const lint = lintPromptIR(ir, library, result);
  return { ...result, valid: lint.valid, lint, diagnostics: lint.diagnostics, warnings: lint.diagnostics.map(d => d.message) };
}
const targetCompiler = (target: ModelTarget) => (ir: PromptIR, library: PresetLibrary) => compilePrompt({ ...ir, target }, library);
export const compileMidjourney = targetCompiler('midjourney');
export const compileFlux = targetCompiler('flux');
export const compileKling = targetCompiler('kling');
export const compileRunway = targetCompiler('runway');
export const compileWan = targetCompiler('wan');
export const compileSora = targetCompiler('sora');
export const compileVeo = targetCompiler('veo');
export const compileGeneric = targetCompiler('generic');
export const compileSDXL = targetCompiler('sdxl');
export const compileImagen = targetCompiler('imagen-3');
export function compileVideo(ir: PromptIR, target: 'kling' | 'veo' | 'sora' | 'runway' | 'wan', library: PresetLibrary): CompilationResult { return compilePrompt({ ...ir, target, mode: 'video' }, library); }
