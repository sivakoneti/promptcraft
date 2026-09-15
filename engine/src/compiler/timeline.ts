import type { Diagnostic } from './catalog.js';
import { TimelineOptionsSchema, type PromptIR } from './ir.js';
export interface TimelineInput { shotId?: string; note: string; duration: number }
export interface NormalizedShot { index: number; sourceIndex: number; shotId?: string; prompt: string; duration: number; start: number; end: number }
export interface NormalizedTimeline { shots: NormalizedShot[]; totalDuration: number; requestedTotalDuration: number; droppedShots: TimelineInput[]; diagnostics: Diagnostic[] }
/** Engine policy, configurable by callers; not a claim about a provider's current API limits. */
export const DEFAULT_TIMELINE_LIMITS = { maxShots: 6, minTotalDuration: 3, maxTotalDuration: 15, maxPromptChars: 512 };
export function normalizeTimeline(input: readonly TimelineInput[], options: PromptIR['timelineOptions'] = {}): NormalizedTimeline {
  const limits = { ...DEFAULT_TIMELINE_LIMITS, ...TimelineOptionsSchema.parse(options) };
  if (limits.minTotalDuration > limits.maxTotalDuration) throw new Error('Minimum duration exceeds maximum');
  if (!Array.isArray(input)) throw new Error('Director shots must be an array');
  for (const s of input) {
    if (!s || typeof s.note !== 'string') throw new Error('Shot note must be a string');
    if (!Number.isFinite(s.duration) || s.duration <= 0) throw new Error('Shot duration must be a positive finite number');
  }
  const diagnostics: Diagnostic[] = [];
  const valid = input.map((s, sourceIndex) => ({ ...s, note: s.note.trim(), sourceIndex })).filter(s => {
    if (!s.note) diagnostics.push({ severity: 'warning', code: 'EMPTY_SHOT', field: `motion.directorShots.${s.sourceIndex}.note`, message: 'Empty shot omitted.' });
    return !!s.note;
  });
  const droppedShots = valid.slice(limits.maxShots);
  if (droppedShots.length) diagnostics.push({ severity: 'warning', code: 'SHOT_LIMIT', field: 'motion.directorShots', message: `${droppedShots.length} shots omitted by configured maxShots=${limits.maxShots}; see timeline.droppedShots.` });
  const selected = valid.slice(0, limits.maxShots);
  for (const s of selected) if (!Number.isFinite(s.duration) || s.duration <= 0) throw new Error(`Shot ${s.sourceIndex + 1} duration must be a positive finite number`);
  const requestedTotalDuration = selected.reduce((sum, s) => sum + s.duration, 0);
  if (!Number.isFinite(requestedTotalDuration)) throw new Error('Timeline duration exceeds numeric range');
  const target = selected.length ? Math.max(limits.minTotalDuration, Math.min(limits.maxTotalDuration, requestedTotalDuration)) : 0;
  if (target !== requestedTotalDuration) diagnostics.push({ severity: 'warning', code: 'DURATION_ADJUSTED', field: 'motion.directorShots', message: `Shot durations proportionally adjusted from ${requestedTotalDuration}s to ${target}s to fit configured timeline limits.` });
  let elapsed = 0;
  let cumulativeRequested = 0;
  const shots = selected.map((s, index) => {
    cumulativeRequested += s.duration;
    // Cumulative boundaries avoid independently rounded durations disagreeing with totals.
    const end = Math.round((cumulativeRequested / requestedTotalDuration) * target * 1000000) / 1000000;
    const duration = Math.round((end - elapsed) * 1000000) / 1000000;
    if (duration <= 0) throw new Error('Shot duration is too small for timeline precision');
    if (s.note.length > limits.maxPromptChars) diagnostics.push({ severity: 'warning', code: 'SHOT_PROMPT_BUDGET', field: `motion.directorShots.${s.sourceIndex}.note`, message: `Shot contains ${s.note.length} characters, above configured budget ${limits.maxPromptChars}; preserved in full to avoid losing intent.` });
    const result = { index: index + 1, sourceIndex: s.sourceIndex, shotId: s.shotId, prompt: s.note, duration, start: elapsed, end };
    elapsed = end;
    return result;
  });
  return { shots, totalDuration: elapsed, requestedTotalDuration, droppedShots, diagnostics };
}
