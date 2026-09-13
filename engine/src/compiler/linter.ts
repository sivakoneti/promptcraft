import type { PromptIR } from './ir.js';
import type { PresetLibrary } from '../state.js';
import { embeddedPresetLibrary } from '../library-data.js';
import { renderCompilation, inheritShot, type CompilationDraft } from './render.js';
import { resolvePreset, type Diagnostic } from './catalog.js';
export type LintDiagnostic = Diagnostic;
export interface LintReport { valid: boolean; estimatedTokens: number; tokenBudget: number; diagnostics: Diagnostic[] }
/** A conservative character-based estimate over emitted text, not a provider tokenizer. */
export function lintPromptIR(ir: PromptIR, library: PresetLibrary = embeddedPresetLibrary, compiled?: CompilationDraft): LintReport {
  const result = compiled || renderCompilation(ir, library);
  const diagnostics: Diagnostic[] = [...result.diagnostics];
  if (result.timeline?.shots.length) {
    for (const shot of result.timeline.shots) {
      const original = ir.motion!.directorShots![shot.sourceIndex];
      const effective = inheritShot(ir, original.overrides);
      effective.action = [effective.action, original.note].filter(Boolean).join(' ');
      diagnostics.push(...semanticDiagnostics(effective, library).map(d => ({ ...d, field: `motion.directorShots.${shot.sourceIndex}.${d.field || ''}` })));
    }
  } else diagnostics.push(...semanticDiagnostics(ir, library));
  const text = [result.positivePrompt, result.negativePrompt].filter(Boolean).join(' ');
  const estimatedTokens = Math.ceil(text.length / 4);
  const tokenBudget = ir.tokenBudget || 2048;
  if (estimatedTokens > tokenBudget) diagnostics.push({ severity: 'warning', code: 'TOKEN_OVERFLOW', message: `Emitted prompt is approximately ${estimatedTokens} tokens against the configured advisory budget ${tokenBudget}. Text is preserved; this estimate is not a provider limit.` });
  return { valid: !diagnostics.some(d => d.severity === 'error'), estimatedTokens, tokenBudget, diagnostics };
}

function semanticDiagnostics(ir: PromptIR, library: PresetLibrary): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const lens = ir.optics?.lens ? resolvePreset(library, 'lenses', ir.optics.lens).value.toLowerCase() : '';
  const focal = ir.optics?.focalLength ? resolvePreset(library, 'focalLengths', ir.optics.focalLength).value.toLowerCase() : '';
  if (lens.includes('fisheye') && /telephoto|85mm|200mm|300mm/.test(focal)) diagnostics.push({ severity: 'error', code: 'OPTICAL_CONFLICT', field: 'optics', message: `Fisheye lens conflicts with focal length ${focal}.` });
  const fStop = Number(ir.optics?.fStop?.replace(/^f\/?/i, ''));
  if (fStop > 22) diagnostics.push({ severity: 'warning', code: 'EXTREME_FSTOP', field: 'optics.fStop', message: `Aperture f/${fStop} suggests pronounced diffraction; check the intended look.` });
  const video = ir.mode === 'video' || (!ir.mode && ['kling', 'veo', 'sora', 'runway', 'wan'].includes(ir.target));
  if (video) {
    const motion = [ir.motion?.movement, ir.kinematics?.primaryVector, ir.kinematics?.secondaryDrift].filter(Boolean).join(' ').toLowerCase();
    const axes = [/\b(pan|truck)\b/, /\b(tilt|pedestal|crane)\b/, /\b(dolly|zoom|push)\b/, /\b(orbit|roll|arc)\b/].filter(re => re.test(motion)).length;
    if (axes >= 3) diagnostics.push({ severity: 'warning', code: 'MULTI_AXIS_CONFLICT', field: 'kinematics', message: 'Several camera axes are requested. Clarify which are simultaneous and which are sequential.' });
    if (ir.motion?.speed === 'freeze' && (ir.motion.movement || ir.action || ir.actionChoreography?.execution || ir.kinematics?.primaryVector)) diagnostics.push({ severity: 'warning', code: 'MOTION_CONFLICT', field: 'motion.speed', message: 'Freeze conflicts with supplied movement/action; clarify which subject or camera remains still.' });
    const action = [ir.action, ir.actionChoreography?.execution, ...(ir.motion?.directorShots?.map(s => s.note) || [])].join(' ').toLowerCase();
    if (/fight|slash|crash|explod|slam|sprint|strike|punch|drift/.test(action) && !(ir.physics?.massAndInertia || ir.physics?.causalChain || ir.physics?.forces?.length)) diagnostics.push({ severity: 'warning', code: 'MISSING_INERTIA', field: 'physics', message: 'Fast or forceful action has no mass, force or causal description; consider describing its physical follow-through.' });
  }
  if (ir.style?.mode === 'photo' && (ir.style.animeGenre || ir.style.animeShow || ir.style.westernStyle)) diagnostics.push({ severity: 'warning', code: 'STYLE_CONFLICT', field: 'style', message: 'Photographic medium and animation presets are both selected; confirm this mixed-media intent.' });
  return diagnostics;
}
