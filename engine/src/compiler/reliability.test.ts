import { describe, test, expect } from 'vitest';
import { PromptIRSchema, ModelTargetSchema, type PromptIR } from './ir.js';
import { compilePrompt } from './compilers.js';
import { embeddedPresetLibrary as library } from '../library-data.js';
import { resolvePreset, type CatalogCategory } from './catalog.js';
import { assembleDetailed } from '../assemble.js';
import { createDefaultState, type PromptMode, type PromptState } from '../state.js';
import { createDefaultVideoState, buildDirectorTimeline } from '../video.js';
import { normalizeTimeline } from './timeline.js';
import { normalizeState } from './adapter.js';
import { executeAction, handleCapabilities } from '../cli.js';
import { McpStdioServer, MCP_TOOLS } from '../mcp/server.js';
import { promptIRJsonSchema } from './discovery.js';
import { sync } from '../sync.js';
import { CINEMATIC_CAMERA_MOVEMENTS } from '../../library/cinematic-movements.js';
const compile = (input: Record<string, unknown>) => compilePrompt(PromptIRSchema.parse({ subject: 'SUBJECT', noText: false, ...input }), library);
const output = (input: Record<string, unknown>) => { const r = compile(input); return [r.positivePrompt, r.negativePrompt, JSON.stringify(r.parameters)].join(' '); };
const videoTargets = ['kling', 'veo', 'sora', 'runway', 'wan', 'minimax-h3', 'generic'];
const catalogFields: Record<CatalogCategory, keyof PromptState> = { shots: 'shotId', directions: 'directionId', lighting: 'lightingId', cameras: 'cameraId', focalLengths: 'focalLengthId', lenses: 'lensId', filmStocks: 'filmId', genres: 'genreId', photographers: 'photographerId', movieLooks: 'movieLookId', filters: 'filters', aspectRatios: 'aspectRatio', animeGenres: 'animeGenreId', animeShowStyles: 'animeShowStyleId', westernAnimationStyles: 'westernAnimationStyleId' };

describe('SPC-007 FR-001/002: every library preset reaches every assembly mode', () => {
  for (const mode of ['photo', 'anime', 'edit', 'video'] as PromptMode[]) {
    for (const category of Object.keys(catalogFields) as CatalogCategory[]) test(`${mode}: all ${category}`, () => {
      for (const preset of library[category]) {
        const result = assembleDetailed({ ...createDefaultState(), mode, subject: 'SUBJECT', [catalogFields[category]]: category === 'filters' ? [preset.id] : preset.id }, library);
        const combined = result.positivePrompt + JSON.stringify(result.parameters);
        if ('pre' in preset) { expect(combined).toContain(preset.pre); expect(combined).toContain(preset.post); }
        else expect(combined).toContain(preset.promptValue.replace(/[.\s]+$/, ''));
        expect(result.diagnostics.some(d => ['UNRESOLVED_PRESET', 'AMBIGUOUS_PRESET'].includes(d.code))).toBe(false);
      }
    });
  }
  test('resolves all exact IDs and labels consistently and rejects ambiguous prefixes', () => {
    for (const category of Object.keys(catalogFields) as CatalogCategory[]) for (const preset of library[category]) {
      expect(resolvePreset(library, category, preset.id).preset?.id).toBe(preset.id);
      expect(resolvePreset(library, category, preset.label).value).toBe(preset.promptValue);
    }
    expect(resolvePreset(library, 'cameras', 'sony').diagnostic?.code).toBe('AMBIGUOUS_PRESET');
    expect(resolvePreset(library, 'lighting', 'custom violet glow').value).toBe('custom violet glow');
    expect(resolvePreset(library, 'shots', 'wide-shot').value).toBe('Wide shot');
    expect(resolvePreset(library, 'cameras', '   ').preset).toBeUndefined();
  });
  test('animation styles never acquire an implicit photographic medium', () => {
    for (const style of [{ mode: 'anime' }, { animeGenre: library.animeGenres[0].id }, { westernStyle: library.westernAnimationStyles[0].id }, { mode: 'illustration' }]) {
      const text = output({ target: 'flux', style });
      expect(text).not.toContain('photographic image');
      expect(text).not.toContain('high-resolution photograph');
    }
  });
  test('lens, film and aperture survive without camera; prefixed apertures normalize', () => {
    const r = assembleDetailed({ ...createDefaultState(), lensId: library.lenses[0].id, filmId: library.filmStocks[0].id, fStop: 'f/2.8' }, library);
    expect(r.positivePrompt).toContain(library.lenses[0].promptValue);
    expect(r.positivePrompt).toContain(library.filmStocks[0].promptValue);
    expect(r.positivePrompt).toContain('f/2.8');
    expect(r.positivePrompt).not.toContain('f/f/');
  });
});

const videoFields: Array<[string, Record<string, unknown>, string]> = [
  ['foreground', { spatial: { foreground: 'NEAR_PLANE' } }, 'NEAR_PLANE'],
  ['midground', { spatial: { midground: 'ACTION_PLANE' } }, 'ACTION_PLANE'],
  ['background', { spatial: { background: 'FAR_PLANE' } }, 'FAR_PLANE'],
  ['trajectory', { spatial: { trajectory: 'LEFT_TO_RIGHT' } }, 'LEFT_TO_RIGHT'],
  ['rack focus', { spatial: { rackFocus: 'NEAR_TO_FAR' } }, 'NEAR_TO_FAR'],
  ['forces', { physics: { forces: ['FORCE_A', 'FORCE_B'] } }, 'FORCE_B'],
  ['mass', { physics: { massAndInertia: 'HEAVY_MASS' } }, 'HEAVY_MASS'],
  ['cause', { physics: { causalChain: 'IMPACT_DUST' } }, 'IMPACT_DUST'],
  ['material', { physics: { materialProperties: 'BRITTLE_GLASS' } }, 'BRITTLE_GLASS'],
  ['invariance', { physics: { invariance: ['RIGID_WHEELS'] } }, 'RIGID_WHEELS'],
  ['rig', { kinematics: { rig: 'technocrane' } }, 'technocrane'],
  ['primary vector', { kinematics: { primaryVector: 'CAMERA_FORWARD' } }, 'CAMERA_FORWARD'],
  ['secondary drift', { kinematics: { secondaryDrift: 'SUBTLE_LEFT' } }, 'SUBTLE_LEFT'],
  ['shutter', { kinematics: { shutterAngle: '90-degree' } }, '90-degree'],
  ['speed ramp', { kinematics: { speedRamp: 'FAST_TO_SLOW' } }, 'FAST_TO_SLOW'],
  ['frame zero', { anchoring: { frame0State: 'STARTING_POSE' } }, 'STARTING_POSE'],
  ['transition', { anchoring: { transitionVector: 'END_ON_DOOR' } }, 'END_ON_DOOR'],
  ['continuity', { anchoring: { continuityLock: true } }, 'Maintain subject identity'],
  ['continuity off', { anchoring: { continuityLock: false } }, 'Continuity lock is off'],
  ['anticipation', { actionChoreography: { anticipation: 'CROUCH_PREPARE' } }, 'CROUCH_PREPARE'],
  ['execution', { actionChoreography: { execution: 'LEAP_FORWARD' } }, 'LEAP_FORWARD'],
  ['settle', { actionChoreography: { settle: 'LAND_HEAVY' } }, 'LAND_HEAVY'],
  ['audio', { actionChoreography: { audioFoley: 'FOOTSTEP_FOLEY' } }, 'FOOTSTEP_FOLEY'],
  ['movement', { motion: { movement: 'dolly-zoom' } }, 'Dolly zoom'],
  ['speed', { motion: { speed: 'slow' } }, 'Motion speed: slow'],
  ['freeze', { motion: { speed: 'freeze' } }, 'Hold the subject and camera still'],
  ['pacing', { motion: { pacing: 'MEASURED_TENSION' } }, 'MEASURED_TENSION'],
  ['beats', { motion: { timelineBeats: ['REACH_HANDLE', 'OPEN_DOOR'] } }, 'REACH_HANDLE; 2) OPEN_DOOR'],
  ['negative', { negativePrompt: 'EXCLUDE_RED' }, 'EXCLUDE_RED'],
];
describe('SPC-007 FR-003/005: video fields survive every target', () => {
  for (const target of videoTargets) for (const [name, fields, expected] of videoFields) test(`${target}: ${name}`, () => {
    expect(output({ target, mode: 'video', ...fields })).toContain(expected);
  });
  test('single shots with action beats do not invent cuts or durations', () => {
    const r = compile({ target: 'kling', motion: { timelineBeats: ['prepare', 'jump', 'land'] } });
    expect(r.timeline).toBeUndefined(); expect(r.parameters.duration).toBeUndefined();
    expect(r.positivePrompt).toContain('without cuts'); expect(r.positivePrompt).not.toContain('Shot 1');
  });
  test('all target identities and neutral routing are preserved', () => {
    for (const target of ModelTargetSchema.options) expect(compile({ target }).target).toBe(target);
    for (const target of ['sdxl', 'imagen-3', 'generic', 'sora']) expect(compile({ target }).parameters).not.toHaveProperty('guidanceScale');
  });
  test('parameters and unsupported fields are explicit', () => {
    const mj = compile({ target: 'midjourney', rawStylize: false, seed: 123, quality: 1, negativePrompt: 'red' });
    expect(mj.parameters).not.toHaveProperty('style'); expect(mj.positivePrompt).not.toContain('--style raw');
    expect(mj.positivePrompt).toContain('--seed 123'); expect(mj.positivePrompt).toContain('--q 1'); expect(mj.positivePrompt).toContain('--no red');
    const r = compile({ target: 'flux', quality: 1, motion: { speed: 'fast' } });
    expect(r.diagnostics.some(d => d.field === 'quality' && d.code === 'UNSUPPORTED_FIELD')).toBe(true);
    expect(r.diagnostics.some(d => d.field === 'motion' && d.code === 'UNSUPPORTED_FIELD')).toBe(true);
  });
});

describe('SPC-007 FR-004: coherent Director inheritance and limits', () => {
  for (const target of videoTargets) test(`${target}: inheritance and per-shot overrides`, () => {
    const r = compile({ target, mode: 'video', environment: 'SHARED_FOREST', optics: { camera: 'arri-alexa-65', lens: 'anamorphic-cinema-lens' }, spatial: { foreground: 'NEAR_REEDS', trajectory: 'GLOBAL_PATH' }, lighting: { mood: 'GLOBAL_MOOD' }, motion: { directorShots: [
      { note: 'FIRST_ACTION', duration: 4, overrides: { lighting: { mood: 'SHOT_MOOD' }, spatial: { trajectory: 'SHOT_PATH' } } },
      { note: 'SECOND_ACTION', duration: 3 },
    ] } });
    const [a, b] = r.timeline!.shots;
    for (const s of [a, b]) for (const marker of ['SUBJECT', 'SHARED_FOREST', 'ARRI ALEXA 65', 'Anamorphic Cinema Lens', 'NEAR_REEDS']) expect(s.prompt).toContain(marker);
    expect(a.prompt).toContain('SHOT_MOOD'); expect(a.prompt).not.toContain('GLOBAL_MOOD');
    expect(a.prompt).toContain('SHOT_PATH'); expect(a.prompt).not.toContain('GLOBAL_PATH');
    expect(b.prompt).toContain('GLOBAL_PATH'); expect(b.prompt).toContain('GLOBAL_MOOD');
    expect(r.parameters.duration).toBe(7);
  });
  test('seventh shot is diagnosed and does not contribute duration', () => {
    const r = compile({ target: 'kling', motion: { directorShots: Array.from({ length: 7 }, (_, i) => ({ note: `ACTION_${i}`, duration: 5 })) } });
    expect(r.timeline!.shots).toHaveLength(6); expect(r.timeline!.droppedShots).toHaveLength(1);
    expect(r.timeline!.requestedTotalDuration).toBe(30); expect(r.parameters.duration).toBe(15);
    expect(r.timeline!.shots.reduce((n, s) => n + s.duration, 0)).toBe(15);
    expect(r.positivePrompt).not.toContain('ACTION_6'); expect(r.diagnostics.some(d => d.code === 'SHOT_LIMIT')).toBe(true);
  });
  test('legacy and IR timeline normalizers agree; empty and fractional timelines are coherent', () => {
    const legacy = buildDirectorTimeline([{ note: '', durationHint: '5' }, { note: 'A', durationHint: '7' }, { note: 'B', durationHint: '9' }]);
    const ir = normalizeTimeline([{ note: '', duration: 5 }, { note: 'A', duration: 7 }, { note: 'B', duration: 9 }]);
    expect(legacy.shots.map(s => Number(s.duration))).toEqual(ir.shots.map(s => s.duration));
    expect(legacy.totalDuration).toBe(ir.totalDuration);
    expect(normalizeTimeline([]).totalDuration).toBe(0);
    const small = normalizeTimeline([{ note: 'A', duration: .5 }, { note: 'B', duration: .5 }]);
    expect(small.shots.map(s => s.duration)).toEqual([1.5, 1.5]);
    expect(() => normalizeTimeline([{ note: 'A', duration: NaN }])).toThrow();
  });
  test('long notes retain their ending and produce a budget diagnostic', () => {
    const note = 'movement '.repeat(1000) + 'CRITICAL_END';
    const r = compile({ target: 'kling', motion: { directorShots: [{ note, duration: 5 }] }, tokenBudget: 100 });
    expect(r.positivePrompt).toContain('CRITICAL_END'); expect(r.lint.estimatedTokens).toBeGreaterThan(2000);
    expect(r.diagnostics.some(d => d.code === 'TOKEN_OVERFLOW')).toBe(true);
    expect(r.diagnostics.some(d => d.code === 'SHOT_PROMPT_BUDGET')).toBe(true);
  });
});

describe('SPC-007 FR-006/007/008: validation and public interface parity', () => {
  const mcp = new McpStdioServer(library);
  test('CLI and MCP compile identical scenes including action, overrides and spatial fields', () => {
    const ir = { target: 'kling', subject: 'fox', action: 'jumps', spatial: { trajectory: 'left to right' }, motion: { directorShots: [{ note: 'lands', overrides: { lighting: { mood: 'joyful' } } }] } };
    const cli = executeAction('compile', { ir });
    expect(cli.status).toBe('ok'); expect(cli.data).toEqual(mcp.handleCall('compile_prompt', ir));
  });
  test('all legacy actions and nested video modes are safe and equivalent to MCP', () => {
    for (const mode of ['photo', 'anime', 'edit', 'video']) {
      const state = { mode, subject: 'fox', cameraId: 'arri-alexa-65', noText: true };
      const cli = executeAction('assemble', { state });
      expect(cli.status).toBe('ok');
      expect(cli.prompt).toBe((mcp.handleCall('assemble_prompt', state) as { positivePrompt: string }).positivePrompt);
      expect(cli.prompt).toContain('ARRI ALEXA 65');
      expect(cli.prompt).toContain('no subtitles');
    }
  });
  test('discovery is generated from strict input schemas', () => {
    expect(MCP_TOOLS.find(t => t.name === 'compile_prompt')!.inputSchema).toEqual(promptIRJsonSchema);
    expect(JSON.stringify(handleCapabilities().data)).toContain('directorShots');
    for (const field of ['trajectory', 'timelineBeats', 'continuityLock', 'overrides', 'negativePrompt', 'viewAngle', 'westernStyle']) expect(JSON.stringify(promptIRJsonSchema)).toContain(field);
  });
  test('invalid states, unknown fields, invalid enums and invalid duration reject predictably', () => {
    for (const state of [{ mode: 'bogus' }, { directorShots: 'oops' }, { cameraId: 123 }, { references: [{}] }, { spatial: { typo: 'value' } }]) expect(executeAction('assemble', { state }).status).toBe('error');
    expect(executeAction('validate', { state: { cameraId: 123 } }).status).toBe('error');
    expect(executeAction('compile', { ir: { subject: 'fox', spatial: { typo: 'value' } } }).status).toBe('error');
    expect(() => PromptIRSchema.parse({ subject: 'fox', motion: { directorShots: [{ note: 'x', duration: 0 }] } })).toThrow();
  });
  test('references survive all modes with edit numbering and overflow diagnostics', () => {
    const references = [{ type: 'face', characterIndex: 0, image: 'face' }, { type: 'global', characterIndex: null, image: 'source', sourcePrompt: 'SOURCE_CONTEXT' }];
    for (const mode of ['photo', 'anime', 'edit', 'video']) {
      const r = compile({ mode, references, referenceOptions: { maxReferenceImages: 1 } });
      expect(r.referenceResolution.active).toHaveLength(1); expect(r.referenceResolution.overflow).toHaveLength(1);
      expect(r.diagnostics.some(d => d.code === 'REFERENCE_OVERFLOW')).toBe(true);
      expect(r.positivePrompt).toContain('SOURCE_CONTEXT');
    }
  });
  test('compilation is deterministic, does not mutate inputs and sync replaces video/anime blocks', () => {
    const input = PromptIRSchema.parse({ subject: 'fox', target: 'kling', motion: { directorShots: [{ note: 'run', overrides: { spatial: { trajectory: 'forward' } } }] } });
    const before = JSON.stringify(input); const one = compilePrompt(input, library);
    expect(compilePrompt(input, library)).toEqual(one); expect(JSON.stringify(input)).toBe(before);
    expect(sync('Shot 1: old video', 'Shot 1: new video')).toBe('Shot 1: new video');
    expect(sync('An anime image of fox', 'An anime image of bear')).toBe('An anime image of bear');
  });
});

describe('SPC-007 completion audit: target coverage and override edge cases', () => {
  const imageFields: Array<[Record<string, unknown>, string]> = [
    [{ action: 'ACTION_TEXT' }, 'ACTION_TEXT'], [{ environment: 'ENV_TEXT' }, 'ENV_TEXT'],
    [{ optics: { viewAngle: 'from-the-back', focalLength: '85mm-portrait', fStop: 'f/4' } }, 'facing away from the camera'],
    [{ lighting: { timeOfDay: 'DAWN_TIME', colorTemperature: 'WARM_TEMPERATURE' } }, 'WARM_TEMPERATURE'],
    [{ style: { artStyle: 'ART_MARKER', genre: library.genres[0].id } }, 'ART_MARKER'],
    [{ candidShot: true }, 'unaware of the camera'], [{ showNewAnglePrompt: true }, 'new viewpoint'],
    [{ spatial: { foreground: 'FOREGROUND_STATIC' } }, 'FOREGROUND_STATIC'],
    [{ noText: true }, 'no subtitles'], [{ seed: 349 }, '349'], [{ negativePrompt: 'NEGATIVE_MARKER' }, 'NEGATIVE_MARKER'],
  ];
  for (const target of ModelTargetSchema.options) test(`${target}: all catalog categories and shared image fields`, () => {
    const mode = videoTargets.includes(target) && target !== 'generic' ? 'video' : 'photo';
    for (const category of Object.keys(catalogFields) as CatalogCategory[]) {
      const preset = library[category][0];
      const r = assembleDetailed({ ...createDefaultState(), target, mode, subject: 'SUBJECT', [catalogFields[category]]: category === 'filters' ? [preset.id] : preset.id }, library);
      expect(r.valid).toBe(true);
      expect(r.positivePrompt + JSON.stringify(r.parameters)).toContain('pre' in preset ? preset.pre : preset.promptValue.replace(/[.\s]+$/, ''));
    }
    for (const [fields, expected] of imageFields) expect(output({ target, mode, ...fields })).toContain(expected);
  });
  test('Director per-shot optics are linted after inheritance, without rejecting replaced global optics', () => {
    const r = compile({ target: 'kling', optics: { lens: 'fisheye-lens', focalLength: '200mm-super-telephoto' }, motion: { directorShots: [
      { note: 'safe shot', overrides: { optics: { lens: 'anamorphic-cinema-lens' } } },
    ] } });
    expect(r.diagnostics.some(d => d.code === 'OPTICAL_CONFLICT')).toBe(false);
    const bad = compile({ target: 'kling', motion: { directorShots: [{ note: 'bad shot', overrides: { optics: { lens: 'fisheye-lens', focalLength: '200mm-super-telephoto' } } }] } });
    expect(bad.valid).toBe(false); expect(bad.diagnostics.find(d => d.code === 'OPTICAL_CONFLICT')?.field).toContain('directorShots.0');
  });
  test('per-shot negative constraints and noText overrides do not leak across shots', () => {
    const r = compile({ target: 'wan', noText: true, negativePrompt: 'GLOBAL_NEGATIVE', motion: { directorShots: [
      { note: 'a', overrides: { negativePrompt: 'SHOT_NEGATIVE', noText: false } }, { note: 'b' },
    ] } });
    expect(r.timeline!.shots[0].prompt).toContain('SHOT_NEGATIVE'); expect(r.timeline!.shots[0].prompt).not.toContain('GLOBAL_NEGATIVE');
    expect(r.timeline!.shots[0].prompt).not.toContain('no subtitles'); expect(r.timeline!.shots[1].prompt).toContain('no subtitles');
    expect(r.negativePrompt).toBeUndefined();
  });
  test('legacy Director helper and CLI support shared scene plus overrides', () => {
    const shots = [{ note: 'first', overrides: { spatial: { trajectory: 'CUSTOM_PATH' } } }];
    const result = buildDirectorTimeline(shots, undefined, { scene: { subject: 'SHARED_SUBJECT', environment: 'SHARED_ENV' } });
    expect(result.shots[0].prompt).toContain('SHARED_SUBJECT'); expect(result.shots[0].prompt).toContain('CUSTOM_PATH');
    const cli = executeAction('director', { shots, state: { subject: 'SHARED_SUBJECT', cameraId: 'arri-alexa-65' } });
    expect(cli.prompt).toContain('ARRI ALEXA 65'); expect(cli.prompt).toContain('CUSTOM_PATH');
  });
  test('cursor insertion works in direct and unified assembly', () => {
    const state = { ...createDefaultVideoState(), videoPrompt: 'start finish', movementLabel: 'Dolly in', movementCursor: 6 };
    expect(assembleDetailed(state, library).positivePrompt).toContain('start camera dolly in finish');
    expect(executeAction('assemble', { state }).prompt).toContain('start camera dolly in finish');
  });
  test('timeline limits validate and scale deterministically with explicit warnings', () => {
    expect(() => normalizeTimeline([{ note: 'x', duration: 1 }], { maxTotalDuration: 1 })).toThrow();
    expect(() => normalizeTimeline([{ note: 'x', duration: 1 }], { maxShots: 0 })).toThrow();
    const r = compile({ target: 'kling', timelineOptions: { maxShots: 8, maxTotalDuration: 60 }, motion: { directorShots: Array.from({ length: 7 }, (_, i) => ({ note: String(i), duration: 5 })) } });
    expect(r.timeline!.shots).toHaveLength(7); expect(r.parameters.duration).toBe(35);
    expect(r.diagnostics.some(d => d.code === 'DURATION_ADJUSTED')).toBe(false);
  });
});

test('MCP assembly and direct video preserve referenceOptions from state', () => {
  const state = { ...createDefaultVideoState(), subject: 'fox', references: [
    { type: 'global' as const, characterIndex: null, image: 'source' },
    { type: 'scene' as const, characterIndex: null, image: 'scene' },
  ], referenceOptions: { maxReferenceImages: 1 } };
  const r = new McpStdioServer(library).handleCall('assemble_prompt', state) as ReturnType<typeof compilePrompt>;
  expect(r.referenceResolution.active).toHaveLength(1); expect(r.referenceResolution.overflow).toHaveLength(1);
  expect(r.diagnostics.some(d => d.code === 'REFERENCE_OVERFLOW')).toBe(true);
});


test('every cinematic movement preserves its motion, framing and ending across video targets', () => {
  for (const target of videoTargets) for (const movement of CINEMATIC_CAMERA_MOVEMENTS) {
    const text = output({ target, mode: 'video', motion: { movement: movement.id } });
    for (const value of [movement.movement, movement.framing, movement.end]) expect(text).toContain(value);
  }
});

test('Director physics lint includes the actual shot note', () => {
  const r = compile({ target: 'kling', motion: { directorShots: [{ note: 'a sudden crash into the wall' }] } });
  expect(r.diagnostics.some(d => d.code === 'MISSING_INERTIA' && d.field?.includes('directorShots.0'))).toBe(true);
});
