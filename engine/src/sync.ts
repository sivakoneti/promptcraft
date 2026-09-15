/** Replace the previously generated block with the new generated block in every mode.
 * Callers own any surrounding hand-written text; this function accepts generated blocks only.
 */
export function sync(prevText: string, nextText: string): string {
  return nextText.replace(/\s+/g, ' ').trim();
}
