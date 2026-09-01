/**
 * SPC-003 SC-001 + FR-001/FR-002: Reference slot resolution goldens.
 * Every expected string is byte-identical to the source engine
 * (extraction/EXTRACTION.md §5, corrected per TS_SOURCE_SUPPLEMENT.md D7/V19-V22).
 */

import { describe, it, expect } from 'vitest';
import {
  resolveReferences,
  CATEGORY_PRIORITY,
  type ReferenceSlotInput,
} from './references.js';

function slot(
  type: ReferenceSlotInput['type'],
  characterIndex: number | null,
  tag: string,
): ReferenceSlotInput {
  return { type, characterIndex, image: `data:image/jpeg;base64,${tag}` };
}

/** 3 characters × (face/outfit/object) + scene + global + 2 anonymous = 13 filled slots. */
function fullFixture(): ReferenceSlotInput[] {
  return [
    slot('face', 0, 'c1-face'),
    slot('outfit', 0, 'c1-outfit'),
    slot('object', 0, 'c1-object'),
    slot('face', 1, 'c2-face'),
    slot('outfit', 1, 'c2-outfit'),
    slot('object', 1, 'c2-object'),
    slot('face', 2, 'c3-face'),
    slot('outfit', 2, 'c3-outfit'),
    slot('object', 2, 'c3-object'),
    slot('scene', null, 'scene'),
    slot('global', null, 'global'),
    slot('anonymous', null, 'anon1'),
    slot('anonymous', null, 'anon2'),
  ];
}

describe('SPC-003 FR-001: category priority table', () => {
  it('matches the source CATEGORY_PRIORITY (usePromptState.ts:360-367)', () => {
    expect(CATEGORY_PRIORITY).toEqual({
      global: 1,
      face: 2,
      scene: 3,
      outfit: 4,
      object: 5,
      anonymous: 6,
    });
  });
});

describe('SPC-003 SC-001: generate-mode golden', () => {
  it('3-character all-slots fixture produces the byte-exact instruction block', () => {
    const result = resolveReferences(fullFixture(), { order: 'generate' });
    expect(result.active.length).toBe(13);
    expect(result.overflow.length).toBe(0);
    expect(result.instruction.display).toBe(
      'Create a new image by combining the provided elements: '
      + 'image_1 as Character1 face reference; '
      + 'image_2 as Character1 clothing reference; '
      + 'image_3 as Character1 prop reference; '
      + 'image_4 as Character2 face reference; '
      + 'image_5 as Character2 clothing reference; '
      + 'image_6 as Character2 prop reference; '
      + 'image_7 as Character3 face reference; '
      + 'image_8 as Character3 clothing reference; '
      + 'image_9 as Character3 prop reference; '
      + 'image_10 as scene style reference; '
      + 'image_11 as global visual reference; '
      + 'image_12 as Image12 reference; '
      + 'image_13 as Image13 reference.'
      + ' Keep character appearances consistent with the references.',
    );
  });

  it('numbers follow construction order: characters, then scene, global, anonymous (D7)', () => {
    const { active } = resolveReferences(fullFixture(), { order: 'generate' });
    expect(active.map((ref) => ref.number)).toEqual(active.map((_, i) => i + 1));
    expect(active[0]).toMatchObject({ category: 'face', characterIndex: 0, assetFileName: 'image_1.jpg' });
    expect(active[9]).toMatchObject({ category: 'scene' });
    expect(active[10]).toMatchObject({ category: 'global' });
    expect(active[11]).toMatchObject({ category: 'anonymous' });
  });
});

describe('SPC-003 SC-001: edit-mode golden (D7/D8)', () => {
  it('global ref stays numbered first; prefix switches to the edit sentence', () => {
    const result = resolveReferences(fullFixture(), { order: 'edit' });
    expect(result.instruction.display).toBe(
      'Use the provided reference images to guide the edit: '
      + 'image_1 as global visual reference; '
      + 'image_2 as Character1 face reference; '
      + 'image_3 as Character1 clothing reference; '
      + 'image_4 as Character1 prop reference; '
      + 'image_5 as Character2 face reference; '
      + 'image_6 as Character2 clothing reference; '
      + 'image_7 as Character2 prop reference; '
      + 'image_8 as Character3 face reference; '
      + 'image_9 as Character3 clothing reference; '
      + 'image_10 as Character3 prop reference; '
      + 'image_11 as scene style reference; '
      + 'image_12 as Image12 reference; '
      + 'image_13 as Image13 reference.'
      + ' Keep character appearances consistent with the references.',
    );
  });
});

describe('SPC-003 FR-002: priority pruning at the cap', () => {
  it('drops lowest priority first; survivors keep construction order', () => {
    // Cap 3 of 13: global(1) + first two faces by construction order (priority 2).
    const { active, overflow, instruction } = resolveReferences(fullFixture(), {
      order: 'generate',
      maxReferenceImages: 3,
    });
    expect(active.map((ref) => ref.displayText)).toEqual([
      'image_1 as Character1 face reference',
      'image_2 as Character2 face reference',
      'image_3 as global visual reference',
    ]);
    expect(instruction.display).toBe(
      'Create a new image by combining the provided elements: '
      + 'image_1 as Character1 face reference; '
      + 'image_2 as Character2 face reference; '
      + 'image_3 as global visual reference.'
      + ' Keep character appearances consistent with the references.',
    );
    // Overflow retained, in construction order, re-numbered from 1 (N5).
    expect(overflow.length).toBe(10);
    expect(overflow[0]).toMatchObject({ number: 1, category: 'outfit', characterIndex: 0 });
    expect(overflow[9]).toMatchObject({ number: 10, category: 'anonymous' });
  });

  it('ties within a priority break by construction order (last anonymous dropped at cap 12)', () => {
    const { active, overflow } = resolveReferences(fullFixture(), {
      order: 'generate',
      maxReferenceImages: 12,
    });
    expect(active.length).toBe(12);
    expect(overflow).toEqual([
      expect.objectContaining({ category: 'anonymous', displayText: 'image_1 as Image1 reference' }),
    ]);
  });

  it('cap 0 or undefined means unlimited (source safeLimit)', () => {
    expect(resolveReferences(fullFixture(), { order: 'generate' }).active.length).toBe(13);
  });
});

describe('SPC-003 FR-002: slot edge cases', () => {
  it('skips unfilled slots (empty image)', () => {
    const result = resolveReferences(
      [slot('face', 0, 'a'), { type: 'scene', characterIndex: null, image: '' }, slot('global', null, 'b')],
      { order: 'generate' },
    );
    expect(result.active.map((ref) => ref.category)).toEqual(['face', 'global']);
    expect(result.instruction.display).toBe(
      'Create a new image by combining the provided elements: '
      + 'image_1 as Character1 face reference; '
      + 'image_2 as global visual reference.'
      + ' Keep character appearances consistent with the references.',
    );
  });

  it('no references → empty instruction', () => {
    const result = resolveReferences([], { order: 'generate' });
    expect(result.instruction).toEqual({ display: '', full: '' });
    expect(result.active).toEqual([]);
  });

  it('anonymous refs carry @ImageN mention tags and loaded labels (V22)', () => {
    const { active } = resolveReferences([slot('anonymous', null, 'x'), slot('anonymous', null, 'y')], {
      order: 'generate',
    });
    expect(active[0]).toMatchObject({ mentionTag: '@Image1', mentionLabel: 'Image 1 - reference loaded' });
    expect(active[1]).toMatchObject({ mentionTag: '@Image2', mentionLabel: 'Image 2 - reference loaded' });
  });

  it('file label mode switches tokens and loaded labels (N3)', () => {
    const { active, instruction } = resolveReferences([slot('face', 0, 'a'), slot('anonymous', null, 'b')], {
      order: 'generate',
      labelMode: 'file',
    });
    expect(active[0].displayText).toBe('file 1 as Character1 face reference');
    expect(active[1].displayText).toBe('file 2 as File2 reference');
    expect(active[1].mentionLabel).toBe('File 2 - reference loaded');
    expect(instruction.display).toBe(
      'Create a new image by combining the provided elements: '
      + 'file 1 as Character1 face reference; '
      + 'file 2 as File2 reference.'
      + ' Keep character appearances consistent with the references.',
    );
  });

  it('global sourcePrompt appears in fullText only (N4)', () => {
    const refs: ReferenceSlotInput[] = [
      { type: 'global', characterIndex: null, image: 'data:image/png;base64,g', sourcePrompt: 'a red barn' },
    ];
    const { active, instruction } = resolveReferences(refs, { order: 'generate' });
    expect(active[0].displayText).toBe('image_1 as global visual reference');
    expect(active[0].fullText).toBe('image_1 as global visual reference (Source content: "a red barn")');
    expect(instruction.display).not.toContain('Source content');
    expect(instruction.full).toContain('(Source content: "a red barn")');
  });

  it('no character refs → no keep-appearances suffix (V20)', () => {
    const result = resolveReferences([slot('scene', null, 's'), slot('global', null, 'g')], {
      order: 'generate',
    });
    expect(result.instruction.display).toBe(
      'Create a new image by combining the provided elements: '
      + 'image_1 as scene style reference; image_2 as global visual reference.',
    );
  });
});
