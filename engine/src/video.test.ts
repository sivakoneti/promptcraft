/**
 * SPC-003 SC-002 + FR-004/FR-005/FR-006: Video engine goldens.
 * Expected strings are byte-identical to the extraction sources:
 * - Movement table: EXTRACTION.md §4.15 / shared-core movement.ts:8-33 (V18)
 * - Autofill: EXTRACTION.md §6 `[subjectAction, environment, mood].filter(Boolean).join(', ')`
 * - Director mechanics: TS_SOURCE_SUPPLEMENT.md D11/N12 (dynamic.ts:392-409, 995-1004)
 */

import { describe, it, expect } from 'vitest';
import {
  assembleVideo,
  buildAutofillSentence,
  buildDirectorTimeline,
  createDefaultVideoState,
  defaultAspect,
  insertMovementKeyword,
  resolveVideoAspect,
  MOVEMENT_COUNT,
  PROVIDER_DEFAULT_ASPECT,
  VIDEO_MOVEMENTS,
  type DirectorShot,
  type VideoState,
} from './video.js';
import type { PresetLibrary } from './state.js';

// ─── FR-004: 26 movement keywords (verbatim table golden) ──────────────────────

const EXPECTED_MOVEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['Static Lock-Off', 'static lock-off shot'],
  ['Dolly in', 'camera dolly in'],
  ['Dolly out', 'camera dolly out'],
  ['Pan', 'camera pans left right'],
  ['Tilt Up', 'camera tilts up'],
  ['Tilt Down', 'camera tilts down'],
  ['Tracking', 'camera tracking subject left right'],
  ['Pedestal Up', 'camera pedestals up'],
  ['Pedestal Down', 'camera pedestals down'],
  ['Truck', 'camera trucks left right'],
  ['Orbit', 'orbit 360 rotation around subject'],
  ['Follow', 'tracking shot following the subject'],
  ['Camera Jib up', 'camera crane jibs up'],
  ['Camera Jib down', 'camera crane jibs down'],
  ['Zoom', 'camera zooms in out with focal length change'],
  ['Aerial Photography', 'aerial photography overhead birds eye view'],
  ['Handheld', 'handheld natural camera shake'],
  ['Shot Switch', 'Shot switch cut to:'],
  ['Time-lapse', 'static camera time-lapse motion'],
  ['Reverse Shot', 'Reverse shot cut to:'],
  ['Crash Zoom', 'crash zoom'],
  ['Pull Focus', 'pull focus'],
  ['Whip Pan', 'whip pan transition'],
  ['Arc Shot', 'arc shot around subject'],
  ['Dolly Zoom', 'dolly zoom (Hitchcock style)'],
  ['Slow Motion', 'slow motion moment'],
];

describe('SPC-003 FR-004: movement catalog', () => {
  it('contains exactly 26 movements', () => {
    expect(MOVEMENT_COUNT).toBe(26);
    expect(VIDEO_MOVEMENTS.length).toBe(26);
  });

  it('label → promptKeyword table is byte-identical to the extraction (V18)', () => {
    expect(VIDEO_MOVEMENTS.map((movement) => [movement.label, movement.promptKeyword] as const))
      .toEqual(EXPECTED_MOVEMENTS);
  });

  it('labels are unique and keywords non-empty', () => {
    const labels = VIDEO_MOVEMENTS.map((movement) => movement.label);
    expect(new Set(labels).size).toBe(26);
    expect(VIDEO_MOVEMENTS.every((movement) => movement.promptKeyword.length > 0)).toBe(true);
  });

  it('picker image slugs resolve into the extracted video-movements asset set', () => {
    expect(VIDEO_MOVEMENTS[0].image).toBe('/images/video-movements/static-lock-off.gif');
    expect(VIDEO_MOVEMENTS[12].image).toBe('/images/video-movements/camera-jib-up.gif');
    expect(VIDEO_MOVEMENTS[24].image).toBe('/images/video-movements/dolly-zoom.gif');
    expect(VIDEO_MOVEMENTS.every((movement) => movement.image.startsWith('/images/video-movements/'))).toBe(true);
  });

  it('label lookup is provider-independent (N19)', () => {
    expect(VIDEO_MOVEMENTS.find((movement) => movement.label === 'Shot Switch')?.promptKeyword)
      .toBe('Shot switch cut to:');
  });
});

// ─── FR-004: movement insertion + autofill ─────────────────────────────────────

describe('SPC-003 FR-004: insertMovementKeyword', () => {
  it('appends at the end when no cursor is given', () => {
    expect(insertMovementKeyword('a surfer rides', 'crash zoom')).toBe('a surfer rides crash zoom');
  });

  it('inserts at the cursor offset with single-space joins', () => {
    expect(insertMovementKeyword('abc def', 'crash zoom', 4)).toBe('abc crash zoom def');
    expect(insertMovementKeyword('abc def', 'crash zoom', 0)).toBe('crash zoom abc def');
    expect(insertMovementKeyword('abc ', 'crash zoom', 4)).toBe('abc crash zoom');
  });

  it('clamps out-of-range cursors and ignores empty keywords', () => {
    expect(insertMovementKeyword('abc', 'crash zoom', 99)).toBe('abc crash zoom');
    expect(insertMovementKeyword('abc', 'crash zoom', -5)).toBe('crash zoom abc');
    expect(insertMovementKeyword('abc', '', 1)).toBe('abc');
  });
});

describe('SPC-003 FR-004: autofill sentence (EXTRACTION §6, byte-exact)', () => {
  it('joins subjectAction, environment, mood with ", "', () => {
    expect(buildAutofillSentence({ ...createDefaultVideoState(), subjectAction: 'a', environment: 'b', mood: 'c' }))
      .toBe('a, b, c');
  });

  it('skips empty fields', () => {
    expect(buildAutofillSentence({ ...createDefaultVideoState(), subjectAction: 'a', mood: 'c' })).toBe('a, c');
    expect(buildAutofillSentence({ ...createDefaultVideoState(), environment: 'b' })).toBe('b');
  });

  it('all empty → empty string', () => {
    expect(buildAutofillSentence(createDefaultVideoState())).toBe('');
  });
});

// ─── FR-004/FR-007: assembleVideo golden composition ───────────────────────────

describe('SPC-003 SC-002: assembleVideo goldens', () => {
  it('full composition: prompt + movement + autofill + reference sentence', () => {
    const state: VideoState = {
      ...createDefaultVideoState(),
      videoPrompt: 'A lone surfer at dawn',
      movementLabel: 'Dolly Zoom',
      subjectAction: 'a surfer paddles out',
      environment: 'stormy ocean',
      mood: 'melancholic',
      references: [
        { type: 'face', characterIndex: 0, image: 'data:image/jpeg;base64,f1' },
        { type: 'scene', characterIndex: null, image: 'data:image/jpeg;base64,s1' },
      ],
    };
    expect(assembleVideo(state, {} as PresetLibrary)).toBe(
      'A lone surfer at dawn dolly zoom (Hitchcock style)'
      + ' a surfer paddles out, stormy ocean, melancholic'
      + ' Create a new image by combining the provided elements:'
      + ' image_1 as Character1 face reference; image_2 as scene style reference.'
      + ' Keep character appearances consistent with the references.',
    );
  });

  it('empty state → empty prompt; unknown movement label contributes nothing', () => {
    expect(assembleVideo(createDefaultVideoState(), {} as PresetLibrary)).toBe('');
    const unknownLabel: VideoState = { ...createDefaultVideoState(), videoPrompt: 'x', movementLabel: 'Nope' };
    expect(assembleVideo(unknownLabel, {} as PresetLibrary)).toBe('x');
  });

  it('photo/edit/anime outputs are untouched by video composition', () => {
    // assembleVideo never mutates its input (pure), and the shared state carries no video fields.
    const state = createDefaultVideoState();
    assembleVideo(state, {} as PresetLibrary);
    expect(state.mode).toBe('video');
    expect(state.videoPrompt).toBe('');
  });
});

// ─── FR-005: director multi-shot (D11/N12) ─────────────────────────────────────

describe('SPC-003 SC-002: director timeline goldens', () => {
  it('3-shot scenario matches the deterministic text form', () => {
    const shots: DirectorShot[] = [
      { shotId: 's1', note: 'Establish drone over coastline', durationHint: '5' },
      { shotId: 's2', note: 'Surfer paddles into wave', durationHint: '4' },
      { shotId: 's3', note: 'Close-up water drops in slow motion', durationHint: '6' },
    ];
    const timeline = buildDirectorTimeline(shots);
    expect(timeline.shots.map((shot) => [shot.index, shot.prompt, shot.duration])).toEqual([
      [1, 'Establish drone over coastline', '5'],
      [2, 'Surfer paddles into wave', '4'],
      [3, 'Close-up water drops in slow motion', '6'],
    ]);
    expect(timeline.totalDuration).toBe(15);
    expect(timeline.clampedDuration).toBe(15);
    expect(timeline.shotType).toBe('customize');
    expect(timeline.timelinePrompt).toBe(
      'Shot 1: Establish drone over coastline (5s)'
      + ' Shot 2: Surfer paddles into wave (4s)'
      + ' Shot 3: Close-up water drops in slow motion (6s)',
    );
  });

  it('2-shot scenario with durations summing below the floor clamps to 3 s', () => {
    const timeline = buildDirectorTimeline([
      { note: 'Wide establishing shot', durationHint: '1' },
      { note: 'Reaction cut', durationHint: '1' },
    ]);
    expect(timeline.totalDuration).toBe(2);
    expect(timeline.clampedDuration).toBe(3);
  });

  it('total duration clamps at 15 s (clampEvolinkKlingDuration, D11)', () => {
    const timeline = buildDirectorTimeline([
      { note: 'a', durationHint: '10' },
      { note: 'b', durationHint: '10' },
    ]);
    expect(timeline.totalDuration).toBe(20);
    expect(timeline.clampedDuration).toBe(15);
  });

  it('more than 6 shots slices to the first 6 (dynamic.ts:997)', () => {
    const shots: DirectorShot[] = Array.from({ length: 8 }, (_, i) => ({ note: `shot ${i + 1}` }));
    const timeline = buildDirectorTimeline(shots);
    expect(timeline.shots.length).toBe(6);
    expect(timeline.shots[5].prompt).toBe('shot 6');
  });

  it('empty notes are dropped before slicing; durations default to 5 (dynamic.ts:392-395)', () => {
    const timeline = buildDirectorTimeline([
      { note: '   ' },
      { note: '' },
      { note: 'real shot' },
      {},
    ]);
    expect(timeline.shots).toEqual([
      { index: 1, shotId: undefined, prompt: 'real shot', duration: '5' },
    ]);
  });

  it('prompts truncate at 512 chars (KLING_PROMPT_MAX_CHARS, N12)', () => {
    const timeline = buildDirectorTimeline([{ note: 'a'.repeat(600) }]);
    expect(timeline.shots[0].prompt.length).toBe(512);
  });

  it('request-level fallback duration stands in for missing hints (dynamic.ts:403)', () => {
    const timeline = buildDirectorTimeline([{ note: 'x' }, { note: 'y', durationHint: '9' }], '7');
    expect(timeline.shots.map((shot) => shot.duration)).toEqual(['7', '9']);
  });

  it('assembleVideo in director mode emits the timeline text (body.prompt cleared per D11)', () => {
    const state: VideoState = {
      ...createDefaultVideoState(),
      videoPrompt: 'ignored single prompt',
      directorMode: true,
      directorShots: [{ note: 'opening wide shot', durationHint: '5' }, { note: 'close on subject', durationHint: '5' }],
      subjectAction: 'hero walks forward',
    };
    expect(assembleVideo(state, {} as PresetLibrary)).toBe(
      'Shot 1: opening wide shot (5s) Shot 2: close on subject (5s) hero walks forward',
    );
  });
});

// ─── FR-006: per-provider aspect defaults ──────────────────────────────────────

describe('SPC-003 FR-006: per-provider aspect defaults', () => {
  it('defaults table matches the source (single state default 16:9, V23)', () => {
    expect(PROVIDER_DEFAULT_ASPECT).toEqual({
      gemini: '16:9',
      chatgpt: '16:9',
      veo: '16:9',
      other: '16:9',
    });
    expect(defaultAspect('gemini')).toBe('16:9');
    expect(defaultAspect('chatgpt')).toBe('16:9');
    expect(defaultAspect('veo')).toBe('16:9');
    expect(defaultAspect('other')).toBe('16:9');
  });

  it('applies the default only when state.aspectRatio is empty', () => {
    expect(resolveVideoAspect({ ...createDefaultVideoState(), aspectRatio: '' }, 'veo')).toBe('16:9');
    expect(resolveVideoAspect({ ...createDefaultVideoState(), aspectRatio: '9:16' }, 'veo')).toBe('9:16');
  });
});
