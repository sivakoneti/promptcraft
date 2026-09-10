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

  // 4. Video-specific linting: Multi-axis camera conflict check
  const motionMoves: string[] = [];
  if (ir.motion?.movement) motionMoves.push(ir.motion.movement.toLowerCase());
  if (ir.kinematics?.primaryVector) motionMoves.push(ir.kinematics.primaryVector.toLowerCase());
  if (ir.kinematics?.secondaryDrift) motionMoves.push(ir.kinematics.secondaryDrift.toLowerCase());

  const allMotionText = motionMoves.join(' ');
  let axisCount = 0;
  if (allMotionText.includes('pan') || allMotionText.includes('truck')) axisCount++;
  if (allMotionText.includes('tilt') || allMotionText.includes('pedestal') || allMotionText.includes('crane')) axisCount++;
  if (allMotionText.includes('dolly') || allMotionText.includes('zoom') || allMotionText.includes('push')) axisCount++;
  if (allMotionText.includes('orbit') || allMotionText.includes('roll') || allMotionText.includes('arc')) axisCount++;

  if (axisCount >= 3) {
    diagnostics.push({
      severity: 'error',
      code: 'MULTI_AXIS_CONFLICT',
      message: `Camera kinematics attempt ${axisCount} simultaneous vector axes (${motionMoves.join(', ')}). Stacking >= 3 simultaneous axes causes severe latent tearing and geometric distortion in video diffusion models.`,
      field: 'kinematics',
    });
  }

  // 5. Video-specific linting: Missing inertia on violent kinetic action
  const isVideoTarget = ['kling', 'veo', 'sora', 'runway', 'wan'].includes(ir.target);
  if (isVideoTarget) {
    const actionText = [
      ir.action,
      ir.actionChoreography?.execution,
    ].filter(Boolean).join(' ').toLowerCase();

    const violentKeywords = ['fight', 'slash', 'crash', 'explode', 'slam', 'sprint', 'strike', 'punch', 'drift'];
    const hasViolentAction = violentKeywords.some((w) => actionText.includes(w));
    const hasPhysicsGrounding = Boolean(
      ir.physics?.massAndInertia ||
      ir.physics?.causalChain ||
      (ir.physics?.forces && ir.physics.forces.length > 0)
    );

    if (hasViolentAction && !hasPhysicsGrounding) {
      diagnostics.push({
        severity: 'warning',
        code: 'MISSING_INERTIA',
        message: `Kinetic action detected ('${actionText}') without physical mass, forces, or causal impact specification. Video models risk generating weightless, rubberized, or ungrounded motion.`,
        field: 'physics',
      });
    }
  }

  // 6. Token budget estimation (approximation ~ 0.75 words per token)
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
