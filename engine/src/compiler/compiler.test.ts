import { describe, test, expect } from 'vitest';
import { PromptIRSchema } from './ir.js';
import { compilePrompt, compileMidjourney, compileFlux, compileVideo, compileRunway, compileKling, compileWan, compileVeo, compileMinimaxH3 } from './compilers.js';
import { lintPromptIR } from './linter.js';
import { embeddedPresetLibrary } from '../library-data.js';

describe('Frontier Prompt Compiler', () => {
  test('validates and parses PromptIR schema', () => {
    const valid = PromptIRSchema.parse({
      target: 'midjourney',
      subject: 'cyberpunk detective',
      action: 'examining holographic data',
      environment: 'neon alley in rain',
      aspectRatio: '21:9',
    });
    expect(valid.subject).toBe('cyberpunk detective');
    expect(valid.aspectRatio).toBe('21:9');
  });

  test('compiles to Midjourney flags and parameters', () => {
    const ir = PromptIRSchema.parse({
      target: 'midjourney',
      subject: 'astronaut exploring crystalline caves',
      style: { movieLook: 'blade-runner-2049' },
      optics: { camera: 'arri-alexa-65', shotType: 'close-up' },
      aspectRatio: '16:9',
      noText: true,
    });
    const result = compileMidjourney(ir, embeddedPresetLibrary);
    expect(result.target).toBe('midjourney');
    expect(result.positivePrompt).toContain('--ar 16:9');
    expect(result.positivePrompt).toContain('--style raw');
    expect(result.positivePrompt).not.toContain('--v ');
    expect(result.positivePrompt).toContain('--no text');
  });

  test('compiles to Flux rich natural descriptive prose', () => {
    const ir = PromptIRSchema.parse({
      target: 'flux',
      subject: 'young sorceress',
      action: 'channeling blue ethereal flame',
      environment: 'ancient stone sanctuary',
      lighting: { setup: 'chiaroscuro-lighting', mood: 'mystical' },
      optics: { camera: 'leica-m3', lens: 'helios-44-2-swirly-bokeh', fStop: '1.4' },
      aspectRatio: '4:3',
    });
    const result = compileFlux(ir, embeddedPresetLibrary);
    expect(result.target).toBe('flux');
    expect(result.positivePrompt).toContain('A photographic image of');
    expect(result.positivePrompt).toContain('young sorceress, channeling blue ethereal flame');
    expect(result.positivePrompt).toContain('illuminated by Chiaroscuro Lighting');
    expect(result.positivePrompt).toContain('Captured with the look of a Leica M3');
    expect(result.positivePrompt).toContain('Aperture: f/1.4');
  });

  test('compiles Kling director timeline with duration hints', () => {
    const ir = PromptIRSchema.parse({
      target: 'kling',
      subject: 'sports car drifting',
      motion: {
        directorShots: [
          { note: 'Tracking shot following vehicle from side angle', duration: 4 },
          { note: 'Close-up on burning rubber tires with sparks', duration: 3 },
        ],
      },
    });
    const result = compileVideo(ir, 'kling', embeddedPresetLibrary);
    expect(result.timeline?.shots.map(s => s.duration)).toEqual([4, 3]);
    expect(result.positivePrompt).toContain('Tracking shot following vehicle from side angle');
    expect(result.positivePrompt).toContain('Close-up on burning rubber tires with sparks');
    expect(result.parameters.duration).toBe(7);
  });

  test('compiles Runway Gen-4 channel syntax with physics and kinematics', () => {
    const ir = PromptIRSchema.parse({
      target: 'runway',
      subject: 'armored knight',
      action: 'sprinting through mud',
      environment: 'castle courtyard at dusk',
      optics: { camera: 'arri-alexa-65', lens: 'anamorphic-cinema-lens', shotType: 'medium-shot' },
      spatial: {
        foreground: 'blurred raindrops on lens',
        midground: 'knight sprinting',
        background: 'looming fortress gates',
      },
      physics: {
        massAndInertia: 'heavy steel plate armor with momentum',
        forces: ['30mph headwind', 'heavy mud suction'],
        causalChain: 'boots displace mud chunks that spray backward',
        invariance: ['rigid armor geometry'],
      },
      kinematics: {
        rig: 'steadicam',
        primaryVector: 'forward tracking push-in',
        shutterAngle: '180-degree',
      },
      actionChoreography: {
        anticipation: 'low stance gathering explosive energy',
        execution: 'heavy sprint forward',
        settle: 'sliding to a controlled halt',
      },
    });
    const result = compileRunway(ir, embeddedPresetLibrary);
    expect(result.target).toBe('runway');
    expect(result.positivePrompt).toContain('Rig: steadicam');
    expect(result.positivePrompt).toContain('Captured with the look of a ARRI ALEXA 65');
    expect(result.positivePrompt).toContain('Shutter angle: 180-degree');
    expect(result.positivePrompt).toContain('armored knight');
    expect(result.positivePrompt).toContain('castle courtyard at dusk');
    expect(result.positivePrompt).toContain('Foreground: blurred raindrops on lens');
    expect(result.positivePrompt).toContain('PHYSICS: Mass and inertia: heavy steel plate armor with momentum');
    expect(result.positivePrompt).toContain('Forces: 30mph headwind; heavy mud suction');
  });

  test('compiles Kling multi-beat action with Foley audio and cinematic movement', () => {
    const ir = PromptIRSchema.parse({
      target: 'kling',
      subject: 'samurai',
      optics: { shotType: 'close-up' },
      environment: 'bamboo forest rain',
      motion: { movement: 'dolly-zoom' },
      actionChoreography: {
        anticipation: 'tightens grip on katana hilt',
        execution: 'instantaneous horizontal slash',
        settle: 'blade halts with rigid inertial damping',
        audioFoley: 'sharp metallic ring of blade unsheathing, heavy rain roar',
      },
      physics: {
        causalChain: 'blade splits water droplets in mid-air',
        invariance: ['rigid blade geometry', 'anatomical stability'],
      },
    });
    const result = compileKling(ir, embeddedPresetLibrary);
    expect(result.target).toBe('kling');
    expect(result.timeline).toBeUndefined();
    expect(result.positivePrompt).toContain('Anticipation:');
    expect(result.positivePrompt).toContain('Execution: instantaneous horizontal slash');
    expect(result.positivePrompt).toContain('Dolly zoom');
    expect(result.positivePrompt).toContain('AUDIO: sharp metallic ring of blade unsheathing, heavy rain roar.');
    expect(result.positivePrompt).toContain('Preserve: rigid blade geometry; anatomical stability.');
  });

  test('compiles Wan 2.1 causal prose with 3-plane spatial depth and negative physics', () => {
    const ir = PromptIRSchema.parse({
      target: 'wan',
      subject: 'cybernetic ninja',
      action: 'leaping between skyscrapers',
      environment: 'rainy neon city',
      spatial: {
        foreground: 'wet rooftop aerial antennas with sparks',
        midground: 'ninja mid-flight',
        background: 'distant mega-structures shrouded in fog',
        rackFocus: 'shift focus from foreground antenna to leaping ninja',
      },
      physics: {
        massAndInertia: 'heavy mechanical limbs compressing upon launch',
        causalChain: 'roof gravel kicks outward upon launch under gravity',
      },
      kinematics: {
        rig: 'fpv-drone',
        primaryVector: 'high-speed forward chase',
      },
    });
    const result = compileWan(ir, embeddedPresetLibrary);
    expect(result.target).toBe('wan');
    expect(result.positivePrompt).toContain('Foreground:');
    expect(result.positivePrompt).toContain('Foreground: wet rooftop aerial antennas with sparks');
    expect(result.positivePrompt).toContain('Focus transition: shift focus from foreground antenna to leaping ninja');
    expect(result.positivePrompt).toContain('Rig: fpv-drone');
    expect(result.positivePrompt).toContain('Mass and inertia: heavy mechanical limbs compressing upon launch');
    expect(result.negativePrompt).toContain('text, subtitles, captions, watermark');
  });

  test('compiles Veo 3.1 technical cinematographic optical specifications', () => {
    const ir = PromptIRSchema.parse({
      target: 'veo',
      subject: 'lone astronaut',
      action: 'surveying alien crater',
      environment: 'desolate red moon at twilight',
      optics: {
        camera: 'arri-alexa-65',
        lens: 'anamorphic-cinema-lens',
        fStop: '2.8',
        shotType: 'wide-shot',
      },
      kinematics: {
        rig: 'technocrane',
        primaryVector: 'sweeping slow crane down',
        shutterAngle: '180-degree',
      },
      lighting: { setup: 'volumetric-lighting' },
    });
    const result = compileVeo(ir, embeddedPresetLibrary);
    expect(result.target).toBe('veo');
    expect(result.positivePrompt).toContain('lone astronaut, surveying alien crater');
    expect(result.positivePrompt).toContain('Aperture: f/2.8.');
    expect(result.positivePrompt).toContain('Primary camera vector: sweeping slow crane down.');
    expect(result.positivePrompt).toContain('illuminated by Volumetric Lighting with visible light beams through haze.');
  });

  test('compiles MiniMax H3 multimodal format with integrated description and soundscape', () => {
    const ir = PromptIRSchema.parse({
      target: 'minimax-h3',
      subject: 'baker',
      action: 'placing a fresh warm loaf onto wooden counter',
      environment: 'cozy street bakery before sunrise',
      optics: { camera: 'arri-alexa-65', shotType: 'medium-shot' },
      lighting: { setup: 'volumetric-lighting', mood: 'warm and peaceful' },
      actionChoreography: {
        audioFoley: 'crisp sound of bread crust crackling, wooden counter thud',
      },
      physics: {
        materialProperties: 'crisp golden crust with soft airy interior',
      },
    });
    const result = compileMinimaxH3(ir, embeddedPresetLibrary);
    expect(result.target).toBe('minimax-h3');
    expect(result.positivePrompt).toContain('integrated_multimodal_description: [Shot 1]');
    expect(result.positivePrompt).toContain('baker, placing a fresh warm loaf onto wooden counter');
    expect(result.positivePrompt).toContain('cozy street bakery before sunrise');
    expect(result.positivePrompt).toContain('overall_soundscape:');
    expect(result.positivePrompt).toContain('crisp sound of bread crust crackling, wooden counter thud');
    expect(result.positivePrompt).toContain('non_diegetic_music: N/A');
    expect(result.parameters.aspectRatio).toBe('16:9');
  });

  test('compiles MiniMax H3 Director multi-shot mode with cuts and sequential timestamps', () => {
    const ir = PromptIRSchema.parse({
      target: 'minimax-h3',
      subject: 'lone astronaut',
      environment: 'lunar surface at twilight',
      actionChoreography: {
        audioFoley: 'pressurized suit breathing, radio hum',
      },
      motion: {
        directorShots: [
          { note: 'Camera tracks astronaut walking toward crater edge', duration: 4 },
          { note: 'Close-up of visor reflecting Earth with solar glare', duration: 3 },
        ],
      },
    });
    const result = compilePrompt(ir, embeddedPresetLibrary);
    expect(result.target).toBe('minimax-h3');
    expect(result.positivePrompt).toContain('integrated_multimodal_description: [Shot 1]');
    expect(result.positivePrompt).toContain('Camera tracks astronaut walking toward crater edge');
    expect(result.positivePrompt).toContain('[Shot 2] At 00:04.000, the camera cuts to');
    expect(result.positivePrompt).toContain('Close-up of visor reflecting Earth with solar glare');
    expect(result.positivePrompt).toContain('overall_soundscape: pressurized suit breathing, radio hum');
    expect(result.timeline?.shots).toHaveLength(2);
    expect(result.parameters.duration).toBe(7);
  });

  test('linter catches multi-axis camera conflicts (pan + tilt + zoom + orbit)', () => {
    const ir = PromptIRSchema.parse({
      target: 'kling',
      subject: 'race car',
      motion: { movement: 'orbit' },
      kinematics: {
        primaryVector: 'fast horizontal pan right',
        secondaryDrift: 'steep tilt up and zoom',
      },
    });
    const report = lintPromptIR(ir);
    expect(report.valid).toBe(true);
    expect(report.diagnostics.some((d) => d.code === 'MULTI_AXIS_CONFLICT')).toBe(true);
  });

  test('linter warns on violent action without physical grounding', () => {
    const ir = PromptIRSchema.parse({
      target: 'kling',
      subject: 'two fighters',
      action: 'brutal sword fight clash and strike',
    });
    const report = lintPromptIR(ir);
    expect(report.diagnostics.some((d) => d.code === 'MISSING_INERTIA')).toBe(true);
  });

  test('compilePrompt top-level router routes to correct target', () => {
    const ir = PromptIRSchema.parse({ target: 'wan', subject: 'drone flying' });
    const res = compilePrompt(ir, embeddedPresetLibrary);
    expect(res.target).toBe('wan');
    expect(res.negativePrompt).toBeDefined();
  });
  test('linter catches optical conflicts (fisheye + telephoto)', () => {
    const ir = PromptIRSchema.parse({
      subject: 'bird on wire',
      optics: {
        lens: 'fisheye-lens',
        focalLength: '200mm-super-telephoto',
      },
    });
    const report = lintPromptIR(ir);
    expect(report.valid).toBe(false);
    expect(report.diagnostics.some((d) => d.code === 'OPTICAL_CONFLICT')).toBe(true);
  });

  test('linter catches target mismatch (motion in Midjourney)', () => {
    const ir = PromptIRSchema.parse({
      target: 'midjourney',
      subject: 'warrior',
      motion: { movement: 'dolly-zoom' },
    });
    const report = lintPromptIR(ir);
    expect(report.diagnostics.some((d) => d.code === 'UNSUPPORTED_FIELD')).toBe(true);
  });
});
