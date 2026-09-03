import type { PromptIR } from './ir.js';

export interface LintDiagnostic {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  field?: string;
}

export interface LintReport {
  valid: boolean;
  estimatedTokens: number;
  tokenBudget: number;
  diagnostics: LintDiagnostic[];
}

export function lintPromptIR(ir: PromptIR): LintReport {
  const diagnostics: LintDiagnostic[] = [];

  // 1. Check optical contradictions
  if (ir.optics?.lens && ir.optics?.focalLength) {
    const lens = ir.optics.lens.toLowerCase();
    const focal = ir.optics.focalLength.toLowerCase();
    if (lens.includes('fisheye') && (focal.includes('telephoto') || focal.includes('85mm') || focal.includes('200mm'))) {
      diagnostics.push({
        severity: 'error',
        code: 'OPTICAL_CONFLICT',
        message: `Contradictory optics: Fisheye lens (${ir.optics.lens}) cannot be combined with telephoto focal length (${ir.optics.focalLength}).`,
        field: 'optics',
      });
    }
  }

  // 2. Check f-stop and lens depth of field
  if (ir.optics?.fStop) {
    const fVal = parseFloat(ir.optics.fStop.replace(/f\/?/i, ''));
    if (!isNaN(fVal) && fVal > 22) {
      diagnostics.push({
        severity: 'warning',
        code: 'EXTREME_FSTOP',
        message: `High f-stop (f/${fVal}) will cause severe diffraction in physical optics simulation.`,
        field: 'optics.fStop',
      });
    }
  }

  // 3. Check target model compatibility
  if (ir.target === 'midjourney' && ir.motion) {
    diagnostics.push({
      severity: 'warning',
      code: 'TARGET_MISMATCH',
      message: 'Motion parameters specified for Midjourney (image-only model target).',
      field: 'motion',
    });
  }

  // 4. Token budget estimation (approximation ~ 0.75 words per token)
  const fullText = [
    ir.subject,
    ir.action,
    ir.environment,
    ir.optics?.camera,
    ir.optics?.lens,
    ir.lighting?.setup,
    ir.lighting?.mood,
    ir.style?.movieLook,
    ir.style?.animeShow,
  ].filter(Boolean).join(' ');

  const estimatedTokens = Math.ceil(fullText.split(/\s+/).filter(Boolean).length * 1.33);

  let tokenBudget = 512;
  if (ir.target === 'midjourney') tokenBudget = 1000;
  else if (ir.target === 'flux') tokenBudget = 512;
  else if (ir.target === 'kling') tokenBudget = 250;

  if (estimatedTokens > tokenBudget) {
    diagnostics.push({
      severity: 'error',
      code: 'TOKEN_OVERFLOW',
      message: `Prompt estimated at ${estimatedTokens} tokens, exceeding target ${ir.target} budget (${tokenBudget} tokens). Model will truncate trailing prompt elements.`,
    });
  }

  const hasErrors = diagnostics.some((d) => d.severity === 'error');

  return {
    valid: !hasErrors,
    estimatedTokens,
    tokenBudget,
    diagnostics,
  };
}
