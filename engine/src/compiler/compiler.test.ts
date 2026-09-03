import { describe, test, expect } from 'vitest';
import { PromptIRSchema } from './ir.js';
import { compileMidjourney, compileFlux, compileVideo } from './compilers.js';
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
    expect(result.positivePrompt).toContain('--v 6.1');
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
    expect(result.positivePrompt).toContain('A detailed, high-resolution photograph capturing');
    expect(result.positivePrompt).toContain('young sorceress, actively channeling blue ethereal flame');
    expect(result.positivePrompt).toContain('illuminated by Chiaroscuro Lighting');
    expect(result.positivePrompt).toContain('captured on a Leica M3');
    expect(result.positivePrompt).toContain('at f/1.4');
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
    const result = compileVideo(ir, 'kling');
    expect(result.positivePrompt).toBe('1: Tracking shot following vehicle from side angle [4s] 2: Close-up on burning rubber tires with sparks [3s]');
    expect(result.parameters.duration).toBe(7);
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
    expect(report.diagnostics.some((d) => d.code === 'TARGET_MISMATCH')).toBe(true);
  });
});
