/**
 * Reference slot resolution + priority pruning engine.
 * Pure module — no DOM, no Chrome APIs, deterministic.
 *
 * Key rules:
 * - Construction order (NOT priority) drives numbering and sentence composition:
 *   generate = per character (face -> outfit -> object), then scene, global, anonymous;
 *   edit = global first, then characters, scene, anonymous.
 * - CATEGORY_PRIORITY (global 1 -> face 2 -> scene 3 -> outfit 4 -> object 5 ->
 *   anonymous 6) is used ONLY to rank who survives the `maxReferenceImages` cap;
 *   survivors keep their original construction order.
 * - Overflow is retained, never silently dropped.
 * - In edit mode the global ref stays numbered in the instruction text (image_1);
 *   only the upload payload drops it.
 */

import type { ReferenceSlot } from './state.js';

export type ReferenceCategory = ReferenceSlot['type'];
export type ReferenceOrder = 'generate' | 'edit';
export type ReferenceLabelMode = 'image' | 'file';

/** Global ref may carry the source image's prompt (supplement N4). */
export interface ReferenceSlotInput extends ReferenceSlot {
  sourcePrompt?: string;
}

/**
 * CATEGORY_PRIORITY per usePromptState.ts:360-367.
 * Ranking ONLY — sentence composition follows construction order (V19).
 */
export const CATEGORY_PRIORITY: Readonly<Record<ReferenceCategory, number>> = {
  global: 1,
  face: 2,
  scene: 3,
  outfit: 4,
  object: 5,
  anonymous: 6,
};

export interface ResolvedReference {
  /** 1-based construction-order number (materializeReferenceDescriptors, D7) */
  number: number;
  category: ReferenceCategory;
  /** null for global/scene/anonymous buckets */
  characterIndex: number | null;
  /** `image_N as ...` instruction token (referenceLabelMode 'image' default, N3) */
  displayText: string;
  /** displayText + global sourcePrompt context (N4) */
  fullText: string;
  /** Payload file name sent as image_1.jpg ... image_N.jpg (N20) */
  assetFileName: string;
  /** Anonymous refs only: `@ImageN` mention tag (V22) */
  mentionTag?: string;
  /** Anonymous refs only: `Image N - reference loaded` label (V22) */
  mentionLabel?: string;
}

export interface ReferenceInstruction {
  display: string;
  full: string;
}

export interface ReferenceResolution {
  /** Survivors of the cap, in construction order, numbered 1..N */
  active: ResolvedReference[];
  /** Beyond-cap refs in construction order — retained for UI display, never dropped (N5) */
  overflow: ResolvedReference[];
  instruction: ReferenceInstruction;
}

/** Reference candidate in construction order; text builders close over the final number. */
interface ReferenceCandidate {
  category: ReferenceCategory;
  characterIndex: number | null;
  buildDisplayText: (imageNumber: number, token: string) => string;
  buildFullText: (imageNumber: number, token: string) => string;
  buildMentionTag?: (imageNumber: number) => string;
  buildMentionLabel?: (imageNumber: number) => string;
}

const CHARACTER_CATEGORIES: ReadonlyArray<ReferenceCategory> = ['face', 'outfit', 'object'];

const CHARACTER_TOKEN: Record<Exclude<ReferenceCategory, 'global' | 'scene' | 'anonymous'>, string> = {
  face: 'face reference',
  outfit: 'clothing reference',
  object: 'prop reference',
};

/** Source `getReferenceDisplayToken` (N3): 'file N' vs 'image_N'. */
function displayToken(imageNumber: number, labelMode: ReferenceLabelMode): string {
  return labelMode === 'file' ? `file ${imageNumber}` : `image_${imageNumber}`;
}

/** Source `getReferenceLoadedLabel` (N3): 'File N - reference loaded' vs 'Image N - ...'. */
function loadedLabel(imageNumber: number, labelMode: ReferenceLabelMode): string {
  return labelMode === 'file' ? `File ${imageNumber} - reference loaded` : `Image ${imageNumber} - reference loaded`;
}

/** Source `buildReferenceCandidates` (usePromptState.ts:385-475). */
function buildReferenceCandidates(
  references: ReadonlyArray<ReferenceSlotInput>,
  order: ReferenceOrder,
  labelMode: ReferenceLabelMode,
): ReferenceCandidate[] {
  const candidates: ReferenceCandidate[] = [];
  const filled = references.filter((slot) => slot.image.length > 0);

  const addCharacters = () => {
    const characterIndexes = [
      ...new Set(
        filled
          .filter((slot) => slot.characterIndex !== null)
          .map((slot) => slot.characterIndex as number),
      ),
    ].sort((a, b) => a - b);

    for (const characterIndex of characterIndexes) {
      const charLabel = `Character${characterIndex + 1}`;
      for (const category of CHARACTER_CATEGORIES) {
        const token = CHARACTER_TOKEN[category as keyof typeof CHARACTER_TOKEN];
        for (const slot of filled) {
          if (slot.characterIndex !== characterIndex || slot.type !== category) continue;
          candidates.push({
            category,
            characterIndex,
            buildDisplayText: (_n, tok) => `${tok} as ${charLabel} ${token}`,
            buildFullText: (_n, tok) => `${tok} as ${charLabel} ${token}`,
          });
        }
      }
    }
  };

  const addScene = () => {
    for (const slot of filled) {
      if (slot.type !== 'scene') continue;
      candidates.push({
        category: 'scene',
        characterIndex: null,
        buildDisplayText: (_n, tok) => `${tok} as scene style reference`,
        buildFullText: (_n, tok) => `${tok} as scene style reference`,
      });
    }
  };

  const addGlobal = () => {
    for (const slot of filled) {
      if (slot.type !== 'global') continue;
      const promptCtx = slot.sourcePrompt ? ` (Source content: "${slot.sourcePrompt}")` : '';
      candidates.push({
        category: 'global',
        characterIndex: null,
        buildDisplayText: (_n, tok) => `${tok} as global visual reference`,
        buildFullText: (_n, tok) => `${tok} as global visual reference${promptCtx}`,
      });
    }
  };

  const addAnonymous = () => {
    for (const slot of filled) {
      if (slot.type !== 'anonymous') continue;
      candidates.push({
        category: 'anonymous',
        characterIndex: null,
        buildDisplayText: (n, tok) => `${tok} as ${labelMode === 'file' ? `File${n}` : `Image${n}`} reference`,
        buildFullText: (n, tok) => `${tok} as ${labelMode === 'file' ? `File${n}` : `Image${n}`} reference`,
        buildMentionTag: (n) => `@Image${n}`,
        buildMentionLabel: (n) => loadedLabel(n, labelMode),
      });
    }
  };

  if (order === 'edit') {
    addGlobal();
    addCharacters();
    addScene();
    addAnonymous();
  } else {
    addCharacters();
    addScene();
    addGlobal();
    addAnonymous();
  }

  return candidates;
}

/**
 * Source `selectReferenceCandidates` (usePromptState.ts:501-524).
 * Beyond the cap, lowest CATEGORY_PRIORITY drops first; ties break by original
 * construction order; survivors keep construction order.
 */
function selectReferenceCandidates(
  candidates: ReadonlyArray<ReferenceCandidate>,
  maxReferenceImages: number,
): { active: ReferenceCandidate[]; overflow: ReferenceCandidate[] } {
  const safeLimit = maxReferenceImages > 0 ? maxReferenceImages : Number.MAX_SAFE_INTEGER;
  if (candidates.length <= safeLimit) {
    return { active: [...candidates], overflow: [] };
  }

  const ranked = candidates
    .map((candidate, originalIndex) => ({ candidate, originalIndex }))
    .sort((a, b) => {
      const priorityA = CATEGORY_PRIORITY[a.candidate.category] ?? 99;
      const priorityB = CATEGORY_PRIORITY[b.candidate.category] ?? 99;
      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.originalIndex - b.originalIndex;
    });

  const selectedIndexes = new Set(ranked.slice(0, safeLimit).map((item) => item.originalIndex));
  return {
    active: candidates.filter((_, index) => selectedIndexes.has(index)),
    overflow: candidates.filter((_, index) => !selectedIndexes.has(index)),
  };
}

/** Source `materializeReferenceDescriptors` (usePromptState.ts:527-552). */
function materializeReferenceDescriptors(candidates: ReadonlyArray<ReferenceCandidate>, labelMode: ReferenceLabelMode): ResolvedReference[] {
  return candidates.map((candidate, index) => {
    const imageNumber = index + 1;
    const token = displayToken(imageNumber, labelMode);
    return {
      number: imageNumber,
      category: candidate.category,
      characterIndex: candidate.characterIndex,
      displayText: candidate.buildDisplayText(imageNumber, token),
      fullText: candidate.buildFullText(imageNumber, token),
      assetFileName: `image_${imageNumber}.jpg`,
      mentionTag: candidate.buildMentionTag?.(imageNumber),
      mentionLabel: candidate.buildMentionLabel?.(imageNumber),
    };
  });
}

/** Source `buildInstructionText` (usePromptState.ts:573-583). */
function buildInstructionText(
  descriptors: ReadonlyArray<ResolvedReference>,
  order: ReferenceOrder,
): ReferenceInstruction {
  if (descriptors.length === 0) {
    return { display: '', full: '' };
  }

  const prefix = order === 'edit'
    ? 'Use the provided reference images to guide the edit:'
    : 'Create a new image by combining the provided elements:';
  const hasCharacterRefs = descriptors.some(
    (descriptor) =>
      descriptor.category === 'face'
      || descriptor.category === 'outfit'
      || descriptor.category === 'object',
  );
  const suffix = hasCharacterRefs ? ' Keep character appearances consistent with the references.' : '';

  return {
    display: `${prefix} ${descriptors.map((descriptor) => descriptor.displayText).join('; ')}.${suffix}`,
    full: `${prefix} ${descriptors.map((descriptor) => descriptor.fullText).join('; ')}.${suffix}`,
  };
}

export interface ResolveReferencesOptions {
  order: ReferenceOrder;
  /** Model's maxReferenceImages cap; 0/undefined = unlimited (source safeLimit) */
  maxReferenceImages?: number;
  /** Display token mode; source default 'image' (N3) */
  labelMode?: ReferenceLabelMode;
}

/**
 * Pure slot resolution: construction-order numbering, cap pruning by
 * CATEGORY_PRIORITY, and the byte-exact instruction sentence.
 */
export function resolveReferences(
  references: ReadonlyArray<ReferenceSlotInput>,
  options: ResolveReferencesOptions,
): ReferenceResolution {
  const labelMode = options.labelMode ?? 'image';
  const candidates = buildReferenceCandidates(references, options.order, labelMode);
  const { active, overflow } = selectReferenceCandidates(candidates, options.maxReferenceImages ?? 0);
  const activeDescriptors = materializeReferenceDescriptors(active, labelMode);
  const overflowDescriptors = materializeReferenceDescriptors(overflow, labelMode);
  return {
    active: activeDescriptors,
    overflow: overflowDescriptors,
    instruction: buildInstructionText(activeDescriptors, options.order),
  };
}
