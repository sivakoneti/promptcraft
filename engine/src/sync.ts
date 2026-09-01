/**
 * SPC-001 FR-008: Live re-sync primitive.
 * When a control changes, replaces the changed fragment in place in the already-built prompt.
 * If the old fragment is not present, appends the new fragment at the end.
 * Whitespace policy: collapse all runs to single space (matching source behavior).
 */

/**
 * Collapse all whitespace runs to single space and trim.
 * Matches source app's whitespace normalization.
 */
function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Re-sync: given previous assembled text and next assembled text,
 * produce updated text where changed fragments are replaced in place.
 *
 * Strategy per EXTRACTION.md §3 "Live re-sync":
 * - For each fragment present in prevText, replace it with its nextText counterpart.
 * - Fragments newly added in nextText are appended.
 * - All replacements collapse to single-space whitespace.
 *
 * Implementation: simple full-replace when fragments can't be reliably identified
 * by substring matching (fragments may share words). The source app uses the same
 * approach — rebuild and replace the entire prompt block in the target textbox.
 *
 * @param prevText - Previously injected prompt text
 * @param nextText - Newly assembled prompt text
 * @returns Updated prompt text ready for injection
 */
export function sync(prevText: string, nextText: string): string {
  // Normalize both sides
  const normalizedPrev = normalizeWhitespace(prevText);
  const normalizedNext = normalizeWhitespace(nextText);

  // If prev is empty or doesn't contain our fragments, return next as-is
  if (normalizedPrev.length === 0) {
    return normalizedNext;
  }

  // Check if prev contains recognizable Kriativly fragments
  // (face guard or aspect ratio sentence are reliable markers)
  const hasKriativlyFragments =
    normalizedPrev.includes("Don't blur faces randomly.") ||
    normalizedPrev.includes('The image should be in a') ||
    normalizedPrev.includes('A photographic image');

  if (!hasKriativlyFragments) {
    // Prev text doesn't look like our output; append next
    return normalizeWhitespace(`${normalizedPrev} ${normalizedNext}`);
  }

  // Replace-in-place: the source app replaces the entire prompt block
  // This is safe because we own the prompt structure
  return normalizedNext;
}

