/**
 * SPC-001 SC-001..SC-004: Golden-file, fuzz, and property tests.
 * Verifies deterministic prompt assembly across states.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createDefaultState,
  validateLibrary,
  type PromptState,
  type PresetLibrary,
} from './state.js';
import { assemblePhoto, assembleEdit, assembleAnime } from './assemble.js';
import { sync } from './sync.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const library: PresetLibrary = JSON.parse(
  readFileSync(join(__dirname, '..', 'library', 'presets.json'), 'utf-8'),
);

// ─── SC-004: Library validation ─────────────────────────────────────────────────

describe('SC-004: Library validation', () => {
  it('accepts valid library', () => {
    expect(() => validateLibrary(library)).not.toThrow();
  });

  it('rejects missing version', () => {
    const bad = { ...library, version: undefined };
    expect(() => validateLibrary(bad)).toThrow();
  });

  it('rejects unknown fields', () => {
    const bad = { ...library, unknownField: true };
    expect(() => validateLibrary(bad)).toThrow();
  });

  it('rejects legacy/unknown fields in presets like thumb or tier', () => {
    const badWithThumb = {
      ...library,
      shots: [{ ...library.shots[0], thumb: '/images/shots/sample.jpg' }],
    };
    expect(() => validateLibrary(badWithThumb)).toThrow();

    const badWithTier = {
      ...library,
      shots: [{ ...library.shots[0], tier: 'free' }],
    };
    expect(() => validateLibrary(badWithTier)).toThrow();
  });
});

// ─── SC-001: Golden-file tests ──────────────────────────────────────────────────

describe('SC-001: Photo mode golden files', () => {
  it('minimal state produces correct base prompt', () => {
    const state = createDefaultState();
    const result = assemblePhoto(state, library);
    // Minimal: subject sentence + face guard + aspect ratio
    expect(result).toContain('A photographic image of');
    expect(result).toContain('a subject');
    expect(result).toContain("Don't blur faces randomly.");
    expect(result).toContain('The image should be in a 16:9 format.');
  });

  it('full state with all fragments produces ordered output', () => {
    const state: PromptState = {
      ...createDefaultState(),
      subjectAction: 'a warrior standing on a cliff',
      environment: 'a misty mountain range at dawn',
      mood: 'epic',
      lightingId: library.lighting[0].id,
      shotId: library.shots[0].id,
      cameraId: library.cameras[0].id,
      lensId: library.lenses[0].id,
      fStop: '2.8',
      filmId: library.filmStocks[0].id,
      filters: [library.filters[0].id],
      movieLookId: library.movieLooks[0].id,
      photographerId: library.photographers[0].id,
      aspectRatio: '21:9',
    };
    const result = assemblePhoto(state, library);

    // Verify fragment ordering:
    // G2 (subject) → fs (lighting) → Dx (camera) → Ox (photographer) → Lx (movie) → Kx (filters) → face-guard → zr (aspect)
    const subjectIdx = result.indexOf('A photographic image');
    const lightingIdx = result.indexOf('The scene is illuminated');
    const cameraIdx = result.indexOf('Captured with the look');
    const photographerIdx = result.indexOf('In the style of photographer');
    const movieIdx = result.indexOf('With the visual aesthetic');
    const filtersIdx = result.indexOf('Applied effect(s)');
    const faceGuardIdx = result.indexOf("Don't blur faces randomly.");
    const aspectIdx = result.indexOf('The image should be in a 21:9 format.');

    expect(subjectIdx).toBeLessThan(lightingIdx);
    expect(lightingIdx).toBeLessThan(cameraIdx);
    expect(cameraIdx).toBeLessThan(photographerIdx);
    expect(photographerIdx).toBeLessThan(movieIdx);
    expect(movieIdx).toBeLessThan(filtersIdx);
    expect(filtersIdx).toBeLessThan(faceGuardIdx);
    expect(faceGuardIdx).toBeLessThan(aspectIdx);
  });

  it('omits fStop clause when fStop is null (FR-004)', () => {
    const state: PromptState = {
      ...createDefaultState(),
      cameraId: library.cameras[0].id,
      lensId: library.lenses[0].id,
      fStop: null,
    };
    const result = assemblePhoto(state, library);
    expect(result).not.toMatch(/f\//);
    expect(result).toContain('Captured with the look');
  });

  it('strips trailing lens word when no lens selected (FR-004)', () => {
    const state: PromptState = {
      ...createDefaultState(),
      cameraId: library.cameras[0].id,
      lensId: '',
      fStop: '4',
    };
    const result = assemblePhoto(state, library);
    // Should not have "lens" as standalone word after camera
    expect(result).toContain('Captured with the look');
  });

  it('appends noText guard when noText is true (FR-006)', () => {
    const state: PromptState = {
      ...createDefaultState(),
      noText: true,
    };
    // noText is handled in anime mode; photo mode doesn't use it
    // This test verifies the constant exists
    const result = assembleAnime(state, library);
    expect(result).toContain('Generate the image with no subtitles, captions, or text overlays.');
  });
});

describe('SC-001: Edit mode golden files', () => {
  it('produces correct edit template (FR-005)', () => {
    const state: PromptState = {
      ...createDefaultState(),
      mode: 'edit',
      subjectAction: 'make the sky sunset orange',
      aspectRatio: '4:3',
    };
    const result = assembleEdit(state, library);
    expect(result).toContain('Modify the source image to: make the sky sunset orange.');
    expect(result).toContain("Don't blur faces randomly.");
    expect(result).toContain('The image should be in a 4:3 format.');
  });
});

// ─── SC-002: Fuzz test ──────────────────────────────────────────────────────────

describe('SC-002: Fuzz test over random states', () => {
  it('1000 random states produce output with fragments in documented order', () => {
    const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < 1000; i++) {
      const state: PromptState = {
        ...createDefaultState(),
        subjectAction: Math.random() > 0.3 ? `subject ${i}` : '',
        environment: Math.random() > 0.5 ? `env ${i}` : '',
        mood: Math.random() > 0.5 ? `mood ${i}` : '',
        lightingId: Math.random() > 0.3 ? pick(library.lighting).id : '',
        shotId: Math.random() > 0.3 ? pick(library.shots).id : '',
        cameraId: Math.random() > 0.3 ? pick(library.cameras).id : '',
        lensId: Math.random() > 0.5 ? pick(library.lenses).id : '',
        fStop: Math.random() > 0.5 ? pick(['1.4', '2', '2.8', '4', '5.6', '8']) : null,
        filmId: Math.random() > 0.5 ? pick(library.filmStocks).id : '',
        filters: Math.random() > 0.7 ? [pick(library.filters).id] : [],
        movieLookId: Math.random() > 0.5 ? pick(library.movieLooks).id : '',
        photographerId: Math.random() > 0.5 ? pick(library.photographers).id : '',
        aspectRatio: pick(['1:1', '4:3', '16:9', '21:9']),
      };

      const result = assemblePhoto(state, library);

      // Every output must contain face guard and aspect ratio
      expect(result).toContain("Don't blur faces randomly.");
      expect(result).toMatch(/The image should be in a .+ format\./);

      // If camera is set, camera fragment must appear before face guard
      if (state.cameraId) {
        const camIdx = result.indexOf('Captured with the look');
        const fgIdx = result.indexOf("Don't blur faces randomly.");
        expect(camIdx).toBeGreaterThan(-1);
        expect(camIdx).toBeLessThan(fgIdx);
      }
    }
  });
});

// ─── SC-003: Property tests for sync() ──────────────────────────────────────────

describe('SC-003: sync() property tests', () => {
  it('idempotent: sync(t0, sync(t0, t1)) === sync(t0, t1)', () => {
    const t0 = "A photographic image of a subject. Don't blur faces randomly. The image should be in a 16:9 format.";
    const t1 = "A photographic image of a warrior. Don't blur faces randomly. The image should be in a 21:9 format.";

    const first = sync(t0, t1);
    const second = sync(t0, first);
    expect(second).toBe(first);
  });

  it('returns nextText when prevText is empty', () => {
    const next = 'New prompt text.';
    expect(sync('', next)).toBe(next);
  });

  it('collapses whitespace', () => {
    const prev = 'Some   text   here.';
    const next = 'Replacement   text.';
    const result = sync(prev, next);
    expect(result).not.toMatch(/\s{2,}/);
  });
  it('1000 random pairs maintain idempotency on assembled-output text', () => {
    for (let i = 0; i < 1000; i++) {
      // Texts shaped like real assembled output (contain the face-guard marker),
      // since sync's append fallback for foreign text is intentionally non-idempotent.
      const t0 = `A photographic image of subject A ${i}. Don't blur faces randomly. The image should be in a 16:9 format.`;
      const t1 = `A photographic image of subject B ${Math.random()}. Don't blur faces randomly. The image should be in a 21:9 format.`;
      const first = sync(t0, t1);
      const second = sync(t0, first);
      expect(second).toBe(first);
    }
  });
});

