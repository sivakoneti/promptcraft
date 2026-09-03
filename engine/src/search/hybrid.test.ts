import { describe, test, expect } from 'vitest';
import { HybridSearchEngine } from './hybrid.js';
import { embeddedPresetLibrary } from '../library-data.js';

describe('Hybrid BM25 + Trigram Search Engine', () => {
  const engine = new HybridSearchEngine(embeddedPresetLibrary);

  test('finds exact and partial matches with high scores', () => {
    const results = engine.search('blade runner 2049');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('blade-runner-2049');
    expect(results[0].score).toBeGreaterThan(30);
  });

  test('finds anime styles through deep descriptive text', () => {
    const results = engine.search('evangelion mecha');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.id === 'neon-revelation')).toBe(true);
  });

  test('finds camera movements and Hitchcock vertigo dolly zoom', () => {
    const results = engine.search('vertigo dolly zoom');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.id === 'dolly-zoom')).toBe(true);
  });

  test('respects category filtering', () => {
    const cameraOnly = engine.search('arri', { category: 'cameras' });
    expect(cameraOnly.every((r) => r.category === 'cameras')).toBe(true);
    expect(cameraOnly.some((r) => r.id === 'arri-alexa-65')).toBe(true);
  });
});
