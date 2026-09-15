import type { PresetLibrary, BasePreset } from '../state.js';
import { CINEMATIC_CAMERA_MOVEMENTS } from '../../library/cinematic-movements.js';

export interface SearchDoc {
  category: string;
  id: string;
  label: string;
  promptValue?: string;
  description?: string;
  tokens: string[];
  trigrams: Set<string>;
  length: number;
}

export interface SearchResult {
  category: string;
  id: string;
  label: string;
  promptValue?: string;
  description?: string;
  score: number;
}

function makeTrigrams(text: string): Set<string> {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const set = new Set<string>();
  for (let i = 0; i <= clean.length - 3; i++) {
    set.add(clean.slice(i, i + 3));
  }
  return set;
}

function trigramSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let matches = 0;
  for (const t of a) {
    if (b.has(t)) matches++;
  }
  return (2 * matches) / (a.size + b.size);
}

export class HybridSearchEngine {
  private docs: SearchDoc[] = [];
  private avgDocLength = 0;
  private df: Map<string, number> = new Map();

  constructor(library: PresetLibrary) {
    this.indexLibrary(library);
  }

  private indexLibrary(library: PresetLibrary): void {
    let totalLength = 0;

    for (const [catName, catItems] of Object.entries(library)) {
      if (Array.isArray(catItems)) {
        for (const item of catItems as Array<BasePreset & { pre?: string; post?: string }>) {
          const desc = item.pre ? `${item.pre} ${item.post}` : item.promptValue;
          const fullText = `${item.id} ${item.label} ${item.promptValue || ''} ${item.pre || ''} ${item.post || ''} ${catName}`;
          const tokens = fullText.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length >= 2);
          const trigrams = makeTrigrams(`${item.id} ${item.label} ${item.promptValue || ''}`);

          const doc: SearchDoc = {
            category: catName,
            id: item.id,
            label: item.label,
            promptValue: item.promptValue || item.label,
            description: desc,
            tokens,
            trigrams,
            length: tokens.length,
          };
          this.docs.push(doc);
          totalLength += tokens.length;

          const uniqueTokens = new Set(tokens);
          for (const t of uniqueTokens) {
            this.df.set(t, (this.df.get(t) || 0) + 1);
          }
        }
      }
    }

    for (const m of CINEMATIC_CAMERA_MOVEMENTS) {
      const fullText = `${m.id} ${m.label} ${m.category} ${m.promptKeyword} ${m.fullPromptRecipe} ${(m.aliases || []).join(' ')}`;
      const tokens = fullText.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length >= 2);
      const trigrams = makeTrigrams(`${m.id} ${m.label} ${(m.aliases || []).join(' ')}`);

      const doc: SearchDoc = {
        category: `movements/${m.category}`,
        id: m.id,
        label: m.label,
        promptValue: m.promptKeyword,
        description: m.fullPromptRecipe,
        tokens,
        trigrams,
        length: tokens.length,
      };
      this.docs.push(doc);
      totalLength += tokens.length;

      const uniqueTokens = new Set(tokens);
      for (const t of uniqueTokens) {
        this.df.set(t, (this.df.get(t) || 0) + 1);
      }
    }

    this.avgDocLength = totalLength / Math.max(1, this.docs.length);
  }

  public search(query: string, options: { category?: string; limit?: number } = {}): SearchResult[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const queryTokens = q.replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length >= 2);
    const queryTrigrams = makeTrigrams(q);

    const k1 = 1.2;
    const b = 0.75;
    const N = this.docs.length;
    const results: SearchResult[] = [];

    for (const doc of this.docs) {
      if (options.category && !doc.category.startsWith(options.category)) continue;

      // 1. BM25 calculation
      let bm25 = 0;
      for (const term of queryTokens) {
        const tf = doc.tokens.filter((t) => t === term).length;
        if (tf > 0) {
          const docFreq = this.df.get(term) || 1;
          const idf = Math.log((N - docFreq + 0.5) / (docFreq + 0.5) + 1);
          const numerator = tf * (k1 + 1);
          const denominator = tf + k1 * (1 - b + (b * doc.length) / this.avgDocLength);
          bm25 += idf * (numerator / denominator);
        }
      }

      // 2. Exact match boost
      let exactBoost = 0;
      if (doc.id.toLowerCase() === q || doc.label.toLowerCase() === q) exactBoost += 50;
      else if (doc.id.toLowerCase().includes(q) || doc.label.toLowerCase().includes(q)) exactBoost += 20;

      // 3. Trigram fuzzy similarity
      const fuzzy = trigramSimilarity(queryTrigrams, doc.trigrams) * 15;

      const totalScore = bm25 * 5 + exactBoost + fuzzy;
      if (totalScore > 1.5) {
        results.push({
          category: doc.category,
          id: doc.id,
          label: doc.label,
          promptValue: doc.promptValue,
          description: doc.description,
          score: Math.round(totalScore * 10) / 10,
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, options.limit || 20);
  }
}
