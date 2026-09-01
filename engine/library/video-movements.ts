/**
 * SPC-003 FR-004: The 26 video camera-movement keywords, verbatim.
 *
 * Provenance: `extraction/dump/ts_catalogs.json` has NO movement catalog (its 20
 * catalogs cover image-mode only), so this table is hand-authored verbatim from
 * the reference apps' unminified shared-core
 * `extraction/studio/app-out/node_modules/@sourceapp/shared-core/services/video/catalog/movement.ts:8-33`
 * (extraction/TS_SOURCE_SUPPLEMENT.md V18), which EXTRACTION.md §4.15 confirms
 * byte-for-byte.
 *
 * `image` is the source's picker asset path: `toSlug(label) + '.gif'`
 * (movement.ts:35-47, L52-57) resolving into the extracted
 * extraction/<app>/app-out/dist/images/video-movements/ set (26 assets).
 */

export interface VideoMovementPromptOption {
  /** UI label; also the picker thumbnail lookup key */
  label: string;
  /** Exact keyword string inserted into the video prompt at the cursor */
  promptKeyword: string;
  /** Picker thumbnail path (gif) under the extracted video-movements asset set */
  image: string;
}

/** Verbatim RAW_MOVEMENTS pairs (movement.ts:8-33) — source order preserved. */
const RAW_MOVEMENTS: ReadonlyArray<{ label: string; promptKeyword: string }> = [
  { label: 'Static Lock-Off', promptKeyword: 'static lock-off shot' },
  { label: 'Dolly in', promptKeyword: 'camera dolly in' },
  { label: 'Dolly out', promptKeyword: 'camera dolly out' },
  { label: 'Pan', promptKeyword: 'camera pans left right' },
  { label: 'Tilt Up', promptKeyword: 'camera tilts up' },
  { label: 'Tilt Down', promptKeyword: 'camera tilts down' },
  { label: 'Tracking', promptKeyword: 'camera tracking subject left right' },
  { label: 'Pedestal Up', promptKeyword: 'camera pedestals up' },
  { label: 'Pedestal Down', promptKeyword: 'camera pedestals down' },
  { label: 'Truck', promptKeyword: 'camera trucks left right' },
  { label: 'Orbit', promptKeyword: 'orbit 360 rotation around subject' },
  { label: 'Follow', promptKeyword: 'tracking shot following the subject' },
  { label: 'Camera Jib up', promptKeyword: 'camera crane jibs up' },
  { label: 'Camera Jib down', promptKeyword: 'camera crane jibs down' },
  { label: 'Zoom', promptKeyword: 'camera zooms in out with focal length change' },
  { label: 'Aerial Photography', promptKeyword: 'aerial photography overhead birds eye view' },
  { label: 'Handheld', promptKeyword: 'handheld natural camera shake' },
  { label: 'Shot Switch', promptKeyword: 'Shot switch cut to:' },
  { label: 'Time-lapse', promptKeyword: 'static camera time-lapse motion' },
  { label: 'Reverse Shot', promptKeyword: 'Reverse shot cut to:' },
  { label: 'Crash Zoom', promptKeyword: 'crash zoom' },
  { label: 'Pull Focus', promptKeyword: 'pull focus' },
  { label: 'Whip Pan', promptKeyword: 'whip pan transition' },
  { label: 'Arc Shot', promptKeyword: 'arc shot around subject' },
  { label: 'Dolly Zoom', promptKeyword: 'dolly zoom (Hitchcock style)' },
  { label: 'Slow Motion', promptKeyword: 'slow motion moment' },
];

/** toSlug replica of movement.ts:35-47 (NFD strip, lowercase, de-apostrophe, dash). */
function toSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** All 26 options, images slugged exactly as the source's ALL_MOVEMENT_PROMPTS map. */
export const VIDEO_MOVEMENTS: VideoMovementPromptOption[] = RAW_MOVEMENTS.map((item) => ({
  label: item.label,
  promptKeyword: item.promptKeyword,
  image: `/images/video-movements/${toSlug(item.label)}.gif`,
}));

/** Authoritative catalog count — the spec's "26 movement keywords" invariant. */
export const MOVEMENT_COUNT = VIDEO_MOVEMENTS.length;

/** Label lookup (source `getMovementPromptOptions` is provider-independent, N19). */
export function getMovementByLabel(label: string): VideoMovementPromptOption | undefined {
  return VIDEO_MOVEMENTS.find((movement) => movement.label === label);
}
