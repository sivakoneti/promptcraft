import type { AnimePreset, BasePreset, PresetLibrary } from '../state.js';
export type CatalogCategory = keyof Omit<PresetLibrary, 'version'>;
export interface Diagnostic { severity: 'error' | 'warning' | 'info'; code: string; message: string; field?: string }
const aliases: Partial<Record<CatalogCategory, Record<string, string>>> = {
  lighting: { neon: 'neon-lighting', 'neon-lit': 'neon-lighting', neutral: 'soft-lighting', 'neutral-lighting': 'soft-lighting' },
  shots: { wide: 'wide-angle', 'wide-shot': 'wide-angle', closeup: 'close-up' },
  lenses: { anamorphic: 'anamorphic-cinema-lens', 'anamorphic-prime': 'anamorphic-cinema-lens', 'swirly-bokeh': 'helios-44-2-swirly-bokeh' },
  filmStocks: { imax: 'kodak-vision3-imax', '70mm': 'kodak-vision3-imax' },
  cameras: { '35mm': '35mm-film-camera' },
};
export function resolvePreset(library: PresetLibrary, category: CatalogCategory, input: string): { value: string; preset?: BasePreset | AnimePreset; diagnostic?: Diagnostic } {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return { value: '' };
  const items = library[category];
  const slug = normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const exact = items.find(p => p.id.toLowerCase() === normalized) || items.find(p => p.label.toLowerCase() === normalized);
  const alias = aliases[category]?.[normalized];
  const matches = exact ? [exact] : items.filter(p => p.id.toLowerCase() === (alias || slug));
  const candidates = matches.length ? matches : items.filter(p => p.id.toLowerCase().startsWith(slug) || p.label.toLowerCase().startsWith(normalized));
  if (candidates.length === 1) return { value: candidates[0].promptValue, preset: candidates[0] };
  return { value: input.trim(), diagnostic: {
    severity: 'warning', code: candidates.length ? 'AMBIGUOUS_PRESET' : 'UNRESOLVED_PRESET',
    message: candidates.length ? `Ambiguous ${category} selection '${input}'; kept as text. Choose an exact ID: ${candidates.map(p => p.id).join(', ')}.` : `No ${category} preset matches '${input}'; kept as custom text.`,
  } };
}
