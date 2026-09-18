#!/usr/bin/env node
import { SCENE_CAPABILITIES } from './compiler/capabilities.js';
/**
 * Promptcraft CLI engine for AI Agents and Human Operators
 *
 * Supports commands and subcommands:
 *  - assemble / photo / anime / edit / video : Assemble prompts deterministically
 *  - director / multi-shot : Build Kling-compliant multi-shot director timelines
 *  - references / resolve-references : Priority resolution and numbering of character/scene reference slots
 *  - sync : Fragment synchronization and prompt patching
 *  - catalog / list / search : Inspect preset catalogs (shots, lighting, cameras, lenses, styles, movements, etc.)
 *  - inspect / validate : Validate state payloads against schemas
 *  - help / capabilities : Self-documenting capabilities and usage guide for LLM/AI agents
 *
 * Supports both flag-driven CLI syntax and JSON payload over stdin or --json / --state.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createDefaultState,
  validateLibrary,
  type PromptState,
  type PresetLibrary,
  type PromptMode,
  type BasePreset,
} from './state.js';
import { assembleDetailed } from './assemble.js';
import { normalizeState, stateToIR, PromptStateInputSchema } from './compiler/adapter.js';
import { promptIRJsonSchema, promptStateJsonSchema } from './compiler/discovery.js';
import { TARGET_CAPABILITIES } from './compiler/render.js';
import { ReferenceOptionsSchema } from './compiler/ir.js';
import {
  buildDirectorTimeline,
  VIDEO_MOVEMENTS,
  type VideoState,
  type DirectorShot,
} from './video.js';
import { CINEMATIC_CAMERA_MOVEMENTS, getCinematicMovement } from '../library/cinematic-movements.js';
import { resolveReferences, type ReferenceSlotInput } from './references.js';
import { sync } from './sync.js';
import { embeddedPresetLibrary } from './library-data.js';
import { PromptIRSchema, type PromptIR } from './compiler/ir.js';
import { compilePrompt } from './compiler/compilers.js';
import { lintPromptIR } from './compiler/linter.js';
import { HybridSearchEngine } from './search/hybrid.js';
import { McpStdioServer } from './mcp/server.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getPresetLibrary(): PresetLibrary {
  const localPath = join(__dirname, '..', 'library', 'presets.json');
  if (existsSync(localPath)) {
    try {
      const data = JSON.parse(readFileSync(localPath, 'utf-8'));
      return validateLibrary(data);
    } catch {
      return embeddedPresetLibrary;
    }
  }
  return embeddedPresetLibrary;
}

const library: PresetLibrary = getPresetLibrary();

export interface CliOutput {
  status: 'ok' | 'error';
  action?: string;
  data?: unknown;
  prompt?: string;
  error?: string;
  details?: unknown;
}

export function printHelp(): void {
  const helpText = `
Promptcraft CLI - Cinematic Prompt Assembly Engine for AI Agents

USAGE:
  promptcraft <command> [options]
  promptcraft --state '<json-state>'
  cat state.json | promptcraft

CORE COMMANDS:
  assemble [options]            Assemble prompt from flags or JSON input (mode: photo|anime|edit|video)
  photo [options]               Assemble photo prompt
  anime [options]               Assemble anime/western animation prompt
  edit [options]                Assemble edit/in-painting prompt
  video [options]               Assemble video prompt with camera movement & autofill
  director [options]            Build a validated Director multi-shot timeline
  compile [options]             Compile PromptIR JSON or flags to a target dialect
  lint [options]                Check emitted text, presets and scene contradictions
  mcp                           Serve tools over MCP stdio
  references [options]          Resolve reference slots with category priority pruning
  sync [options]                Re-sync modified prompt fragments in-place
  catalog [subcommand]          Explore available catalogs (shots, lighting, cameras, film, anime, movements...)
  capabilities                  Output machine-readable catalog & action schema for AI agents
  validate [options]            Validate a PromptState or VideoState JSON object
  help                          Show this help message

ASSEMBLE FLAGS:
  --target <name>               Target dialect (see capabilities)
  --focal-length <id>           Focal-length preset or custom value
  --direction <id>              Subject view direction preset
  --genre <id>                  Image genre preset
  --style-mode <name>           photo|anime|western-animation|illustration|cinematic
  --art-style <text>            Custom art direction
  --negative <text>             Elements to exclude
  --seed <integer>              Seed hint returned in parameters
  --quality <number>            Midjourney quality flag; diagnosed on other targets
  --mode <photo|anime|edit|video>
  --subject <text>              Subject description
  --action <text>               Subject action / primary action
  --env <text>                  Environment / background setting
  --mood <text>                 Mood / atmosphere description
  --shot <id>                   Shot ID (e.g. bird-s-eye-view, close-up, wide-shot...)
  --lighting <id>               Lighting ID (e.g. golden-hour, dramatic-cinematic, neon-lit...)
  --camera <id>                 Camera ID (e.g. arri-alexa-65, red-digital-cinema-camera...)
  --lens <id>                   Lens ID (e.g. anamorphic-cinema-lens, helios-44-2-swirly-bokeh...)
  --f-stop <value>              f-stop value (e.g. f/1.4, f/2.8)
  --film <id>                   Film stock ID (e.g. kodak-vision3-500t, fujifilm-eterna...)
  --filter <ids...>             Filter IDs (comma-separated or multiple --filter flags)
  --movie-look <id>             Movie look ID (e.g. blade-runner-2049, the-matrix, dune...)
  --photographer <id>           Photographer style ID (e.g. gregory-crewdson, annie-leibovitz...)
  --anime-genre <id>            Anime genre ID (e.g. 3d-anime, cyberpunk...)
  --anime-show <id>             Anime show style ID (e.g. neon-revelation, demon-hunter...)
  --western-style <id>          Western animation style ID (e.g. pixar-3d, spider-verse...)
  --aspect <ratio>              Aspect ratio (default: 16:9)
  --no-text                     Add no-text / textless guard
  --candid                      Add candid shot clause
  --new-angle                   Add new angle prompt clause
  --video-prompt <text>         Video specific prompt
  --movement <label>            Video camera movement label (e.g. 'Orbit', 'Dolly in', 'Pan')
  --director-mode               Enable multi-shot director mode
  --json                        Output structured JSON result (default in non-TTY or with json input)
  --raw                         Output plain prompt string only
  --state <json>                Pass full state as JSON string

CATALOG SUBCOMMANDS:
  catalog list [category]       List items in a catalog category (e.g. shots, lighting, cameras, movements)
  catalog search <query>        Search presets across all categories or in a specific category
  catalog categories            List all available catalog category names

EXAMPLES:
  # Assemble photo prompt:
  promptcraft photo --subject "cyberpunk detective in rain" --shot close-up --lighting neon-lit --movie-look blade-runner-2049

  # Assemble anime prompt:
  promptcraft anime --subject "sorcerer casting blue flame" --anime-genre cyberpunk --anime-show neon-revelation

  # Assemble video prompt:
  promptcraft video --subject "sports car drifting" --movement "Orbit" --env "neon city wet asphalt"

  # JSON payload over stdin (AI agent integration):
  echo '{"action":"assemble","mode":"photo","subject":"astronaut on Mars","shotId":"wide-shot"}' | promptcraft

  # Discover capabilities for AI agents:
  promptcraft capabilities
`;
  console.log(helpText);
}

export function outputResult(result: CliOutput, raw = false): void {
  if (raw && result.status === 'ok') {
    if (typeof result.prompt === 'string') {
      const diagnostics = (result.data as { diagnostics?: unknown[] } | undefined)?.diagnostics;
      if (diagnostics?.length) process.stderr.write(JSON.stringify({ diagnostics }) + '\n');
      process.stdout.write(result.prompt + '\n');
      return;
    }
    if (typeof result.data === 'string') {
      process.stdout.write(result.data + '\n');
      return;
    }
  }
  console.log(JSON.stringify(result, null, 2));
}

const VALID_COMMANDS: Record<string, true> = {
  assemble: true,
  assemble_prompt: true,
  photo: true,
  anime: true,
  edit: true,
  video: true,
  assemble_video: true,
  director: true,
  director_timeline: true,
  references: true,
  resolve_references: true,
  sync: true,
  catalog: true,
  capabilities: true,
  suggest: true,
  validate: true,
  help: true,
  '--help': true,
  '-h': true,
  compile: true,
  lint: true,
  mcp: true,
  hybrid_search: true,
};

function parseCliArgs(args: string[]): {
  command: string;
  flags: Record<string, string | boolean | string[]>;
  positionals: string[];
} {
  const flags: Record<string, string | boolean | string[]> = {};
  const positionals: string[] = [];
  let command = 'assemble';
  let i = 0;

  if (args.length > 0 && args[0] in VALID_COMMANDS) {
    command = args[0];
    i = 1;
  }

  const booleanFlags = new Set(['raw', 'no-text', 'candid', 'new-angle', 'director-mode']);
  const valueFlags = new Set(['mode', 'subject', 'action', 'env', 'mood', 'shot', 'lighting', 'camera', 'lens', 'f-stop', 'film', 'filter', 'movie-look', 'photographer', 'anime-genre', 'anime-show', 'western-style', 'aspect', 'video-prompt', 'movement', 'state', 'target', 'focal-length', 'direction', 'genre', 'style-mode', 'art-style', 'negative', 'seed', 'quality', 'note', 'prompt', 'duration', 'prev', 'prev-text', 'next', 'next-text', 'category', 'query', 'intent']);
  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (booleanFlags.has(key) || (key === 'json' && (!next || !next.trim().startsWith('{')))) {
        flags[key] = next === 'false' ? false : true;
        i += next === 'true' || next === 'false' ? 2 : 1;
      } else {
        if (!valueFlags.has(key) && key !== 'json') throw new Error(`Unknown option --${key}`);
        if (next === undefined || next.startsWith('--')) throw new Error(`Option --${key} requires a value`);
        if (flags[key] !== undefined) {
          if (key !== 'filter') throw new Error(`Option --${key} may only be supplied once`);
          const current = flags[key];
          flags[key] = Array.isArray(current) ? [...current, next] : [String(current), next];
        } else flags[key] = next;
        i += 2;
      }
    } else if (arg.startsWith('-')) throw new Error(`Unknown option ${arg}`);
    else { positionals.push(arg); i += 1; }
  }

  return { command, flags, positionals };
}

export function handleCapabilities(): CliOutput {
  const catalogSummary: Record<string, { count: number; sample: Array<{ id: string; label: string }> }> = {};
  for (const [key, value] of Object.entries(library)) {
    if (Array.isArray(value)) {
      const presets: BasePreset[] = value;
      catalogSummary[key] = {
        count: presets.length,
        sample: presets.slice(0, 5).map((item) => ({
          id: item.id,
          label: item.label,
        })),
      };
    }
  }

  return {
    status: 'ok',
    action: 'capabilities',
    data: {
      version: '1.2.0',
      schemas: { promptIR: promptIRJsonSchema, state: promptStateJsonSchema },
      targets: TARGET_CAPABILITIES, sceneCapabilities: SCENE_CAPABILITIES,
      actions: [
        { name: 'compile', description: 'Compile PromptIR with automatic diagnostics', inputSchema: promptIRJsonSchema },
        { name: 'lint', description: 'Lint the emitted prompt after preset expansion', inputSchema: promptIRJsonSchema },
        {
          name: 'assemble',
          description: 'Assemble photographic, anime, edit, or video prompts deterministically',
          inputSchema: promptStateJsonSchema,
          parameters: {
            mode: 'photo | anime | edit | video',
            subject: 'string',
            subjectAction: 'string',
            environment: 'string',
            mood: 'string',
            shotId: 'shot catalog id',
            lightingId: 'lighting catalog id',
            cameraId: 'camera catalog id',
            lensId: 'lens catalog id',
            fStop: 'f-stop string',
            filmId: 'film catalog id',
            filters: 'array of filter ids',
            movieLookId: 'movie look catalog id',
            photographerId: 'photographer catalog id',
            animeGenreId: 'anime genre catalog id',
            animeShowStyleId: 'anime show style catalog id',
            westernAnimationStyleId: 'western animation style catalog id',
            aspectRatio: '16:9 | 9:16 | 1:1 | 4:3 | 21:9 | 3:2',
            noText: 'boolean',
            candidShot: 'boolean',
            showNewAnglePrompt: 'boolean',
            references: 'array of ReferenceSlot objects',
          },
        },
        {
          name: 'assemble_video',
          description: 'Assemble video prompts with presets, spatial controls and Director inheritance',
          inputSchema: promptStateJsonSchema,
          parameters: {
            videoPrompt: 'string',
            movementLabel: 'movement label from VIDEO_MOVEMENTS (26 movements)',
            movementCursor: 'number (offset where keyword is inserted)',
            directorMode: 'boolean',
            directorShots: 'array of DirectorShot { shotId?, note, durationHint? }',
            subjectAction: 'string',
            environment: 'string',
            mood: 'string',
            aspectRatio: 'string',
            references: 'array of ReferenceSlot',
          },
        },
        {
          name: 'director_timeline',
          description: 'Construct a coherent timeline using configurable engine limits; accepts shared state or ir and per-shot overrides',
          parameters: {
            shots: 'array of { shotId?, note: string, durationHint?: string }',
            fallbackDuration: 'optional string duration',
          },
        },
        {
          name: 'resolve_references',
          description: 'Resolve and prune reference slots by category priority (global > face > scene > outfit > object > anonymous)',
          parameters: {
            slots: 'array of ReferenceSlotInput',
            options: '{ order?: "generate" | "edit", maxReferenceImages?: number, labelMode?: "image" | "file" }',
          },
        },
        {
          name: 'sync',
          description: 'In-place synchronization and update of prompt fragments when settings change',
          parameters: {
            prevText: 'string',
            nextText: 'string',
          },
        },
        {
          name: 'catalog',
          description: 'Query preset catalog entries and options',
          parameters: {
            category: 'shots | lighting | cameras | lenses | focalLengths | filmStocks | genres | photographers | movieLooks | filters | aspectRatios | animeGenres | animeShowStyles | westernAnimationStyles | movements',
            query: 'optional search query',
          },
        },
      ],
      videoMovementsCount: CINEMATIC_CAMERA_MOVEMENTS.length,
      videoMovements: CINEMATIC_CAMERA_MOVEMENTS.map((m) => ({
        id: m.id,
        label: m.label,
        category: m.category,
        promptKeyword: m.promptKeyword,
        fullPromptRecipe: m.fullPromptRecipe,
      })),
      catalogs: catalogSummary,
    },
  };
}

export const CATALOG_SYNONYMS: Record<string, string[]> = {
  // Anime & Manga franchises and creators
  evangelion: ['neon-revelation', 'retro-mobile-suit', 'modern-mobile-suit'],
  eva: ['neon-revelation'],
  ghibli: ['ghibli-like-fantasy', 'forest-princess'],
  miyazaki: ['ghibli-like-fantasy', 'forest-princess'],
  mononoke: ['forest-princess'],
  frieren: ['beyond-the-journey'],
  titan: ['attack-on-giants'],
  shingeki: ['attack-on-giants'],
  cyberpunk: ['edgerunners', 'ghost-in-the-system', 'blade-runner', 'blade-runner-2049', 'the-matrix', 'neon-lit', 'neon-lighting'],
  edgerunner: ['edgerunners'],
  'ghost in the shell': ['ghost-in-the-system'],
  naruto: ['ninja-bandana'],
  jujutsu: ['jujitsu-curse-domain'],
  'sailor moon': ['lunar-sailor'],
  cardcaptor: ['charmcaptor'],
  'cowboy bebop': ['cowboy-spaceman'],
  bebop: ['cowboy-spaceman'],
  claymore: ['greyblade'],
  'ergo proxy': ['proxy-error'],
  'violet evergarden': ['purple-evergarden'],
  gundam: ['retro-mobile-suit', 'modern-mobile-suit'],
  'solo leveling': ['solo-level-ascension'],
  'junji ito': ['spiral-horror'],
  uzumaki: ['spiral-horror'],
  'tokyo ghoul': ['tokyo-demon-gloom'],
  hellsing: ['van-helsing-limited'],
  'your name': ['your-title'],
  pokemon: ['pok-collector'],
  disney: ['3d-family-film', 'classic-animated-movie', 'modern-mystery-cartoon'],
  pixar: ['pixar-style'],
  dreamworks: ['dreamworks-style'],
  'spider-verse': ['2d-3d-hybrid-animation'],
  arcane: ['2d-3d-hybrid-animation'],
  fortiche: ['2d-3d-hybrid-animation'],
  batman: ['dark-knight-animation'],
  tintin: ['ligne-claire-style'],
  'looney tunes': ['looney-animation'],
  spongebob: ['underwater-comedy-animation'],
  'rick and morty': ['modern-sci-fi-comedy'],
  'gravity falls': ['modern-mystery-cartoon'],
  cuphead: ['rubberhose-video-game-style'],
  'steven universe': ['cn-gem-style-animation'],
  gumball: ['cn-mixed-media-animation'],
  'samurai jack': ['minimalist-cinematic-cartoon'],
  tartakovsky: ['minimalist-cinematic-cartoon'],
  coraline: ['laika-stop-motion'],
  'tim burton': ['burtonesque-stop-motion'],

  // Cinematic Directors, Movies, and Camera Tech
  hitchcock: ['dolly-zoom'],
  vertigo: ['dolly-zoom'],
  kubrick: ['2001-a-space-odyssey'],
  matrix: ['the-matrix'],
  'blade runner': ['blade-runner', 'blade-runner-2049'],
  dune: ['dune'],
  interstellar: ['interstellar'],
  imax: ['kodak-vision3-imax', 'arri-alexa-65', 'red-v-raptor-8k'],
  '70mm': ['kodak-vision3-imax', 'arri-alexa-65', 'red-v-raptor-8k'],
  '35mm': ['35mm-film-camera', 'kodak-portra-400', 'cinestill-800t'],
  anamorphic: ['anamorphic-cinema-lens'],
  bokeh: ['helios-44-2-swirly-bokeh', '85mm-portrait'],
  'wide angle': ['14mm-ultra-wide', '24mm-wide-angle', '35mm-wide'],
  drone: ['drone-photography', 'drone-push-in', 'drone-pull-back', 'helicopter-shot'],
  fpv: ['fpv', 'drone-push-in'],
  'slow motion': ['slow-motion'],
  'time lapse': ['time-lapse'],
  'dutch angle': ['dutch-angle'],
  'golden hour': ['golden-hour'],
  neon: ['neon-lit', 'neon-lighting', 'blade-runner-2049', 'the-matrix', 'edgerunners'],
  noir: ['chiaroscuro-lighting', 'black-and-white', 'blade-runner', 'the-maltese-falcon', 'chinatown'],
};

export function handleCatalog(
  positionals: string[],
  flags: Record<string, string | boolean | string[]>,
): CliOutput {
  const sub = positionals[0] || 'categories';

  if (sub === 'categories') {
    const categories = Object.keys(library).filter((k) => k !== 'version');
    categories.push('movements');
    return {
      status: 'ok',
      action: 'catalog.categories',
      data: categories,
    };
  }

  if (sub === 'movements' || sub === 'cinematicMovements') {
    return {
      status: 'ok',
      action: 'catalog.movements',
      data: CINEMATIC_CAMERA_MOVEMENTS,
    };
  }

  if (sub === 'list') {
    const category = positionals[1] || (flags.category as string);
    if (!category) {
      return {
        status: 'error',
        error: 'Specify a category to list. Available: ' + Object.keys(library).filter((k) => k !== 'version').join(', ') + ', movements',
      };
    }

    if (category === 'movements' || category === 'videoMovements' || category === 'cinematicMovements') {
      return {
        status: 'ok',
        action: 'catalog.list',
        data: CINEMATIC_CAMERA_MOVEMENTS,
      };
    }

    if (!(category in library) || !Array.isArray(library[category as keyof PresetLibrary])) {
      return {
        status: 'error',
        error: `Category '${category}' not found in library.`,
      };
    }

    const items = library[category as keyof PresetLibrary] as unknown[];
    return {
      status: 'ok',
      action: 'catalog.list',
      data: items,
    };
  }

  if (sub === 'search') {
    const query = positionals.slice(1).join(' ') || (flags.query as string) || '';
    if (!query) {
      return {
        status: 'error',
        error: 'Specify search query with `catalog search <query>` or --query <query>',
      };
    }

    const categoryFilter = flags.category as string | undefined;
    const q = query.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    const results: Array<{ category: string; id: string; label: string; promptValue?: string; description?: string; score: number }> = [];

    // Check synonyms
    const synonymTargetIds = new Set<string>();
    for (const [key, targets] of Object.entries(CATALOG_SYNONYMS)) {
      if (q === key || q.includes(key) || key.includes(q)) {
        for (const id of targets) synonymTargetIds.add(id);
      }
    }

    // Search library catalogs (including pre, post, and categories)
    for (const [catName, catItems] of Object.entries(library)) {
      if (categoryFilter && catName !== categoryFilter) continue;
      if (Array.isArray(catItems)) {
        for (const item of catItems as Array<BasePreset & { pre?: string; post?: string }>) {
          const id = item.id.toLowerCase();
          const label = item.label.toLowerCase();
          const pv = (item.promptValue || '').toLowerCase();
          const pre = (item.pre || '').toLowerCase();
          const post = (item.post || '').toLowerCase();
          const fullBlob = `${id} ${label} ${pv} ${pre} ${post} ${catName.toLowerCase()}`;

          let score = 0;
          if (id === q) score += 100;
          else if (label === q) score += 90;
          else if (synonymTargetIds.has(item.id)) score += 85;
          else if (id.includes(q)) score += 60;
          else if (label.includes(q)) score += 50;
          else if (pv.includes(q)) score += 40;
          else if (pre.includes(q)) score += 35;
          else if (post.includes(q)) score += 25;
          else if (terms.length > 1 && terms.every((t) => fullBlob.includes(t))) score += 20;
          else if (terms.length > 1 && terms.some((t) => id.includes(t) || label.includes(t))) score += 10;

          if (score > 0) {
            results.push({
              category: catName,
              id: item.id,
              label: item.label,
              promptValue: item.promptValue || item.label,
              description: item.pre ? `${item.pre} ${item.post}` : (item.promptValue !== item.label ? item.promptValue : undefined),
              score,
            });
          }
        }
      }
    }

    // Search cinematic camera movements (including aliases and categories)
    if (!categoryFilter || categoryFilter === 'movements' || categoryFilter.startsWith('movements/')) {
      for (const m of CINEMATIC_CAMERA_MOVEMENTS) {
        const id = m.id.toLowerCase();
        const label = m.label.toLowerCase();
        const cat = m.category.toLowerCase();
        const kw = m.promptKeyword.toLowerCase();
        const recipe = m.fullPromptRecipe.toLowerCase();
        const aliases = m.aliases.map((a) => a.toLowerCase());
        const fullBlob = `${id} ${label} ${cat} ${kw} ${recipe} ${aliases.join(' ')}`;

        let score = 0;
        if (id === q) score += 100;
        else if (label === q) score += 90;
        else if (synonymTargetIds.has(m.id)) score += 85;
        else if (aliases.includes(q)) score += 80;
        else if (id.includes(q)) score += 60;
        else if (label.includes(q)) score += 50;
        else if (kw.includes(q)) score += 45;
        else if (aliases.some((a) => a.includes(q))) score += 40;
        else if (recipe.includes(q)) score += 30;
        else if (terms.length > 1 && terms.every((t) => fullBlob.includes(t))) score += 20;
        else if (terms.length > 1 && terms.some((t) => id.includes(t) || label.includes(t))) score += 10;

        if (score > 0) {
          results.push({
            category: `movements/${m.category}`,
            id: m.id,
            label: m.label,
            promptValue: m.promptKeyword,
            description: m.fullPromptRecipe,
            score,
          });
        }
      }
    }

    results.sort((a, b) => b.score - a.score);

    return {
      status: 'ok',
      action: 'catalog.search',
      data: { query, count: results.length, results },
    };
  }

  return {
    status: 'error',
    error: `Unknown catalog subcommand '${sub}'. Use categories, list <cat>, search <query>, or movements.`,
  };
}

export function handleSuggest(intent: string): CliOutput {
  const q = intent.trim().toLowerCase();
  if (!q) {
    return { status: 'error', error: 'Specify an intent or theme to suggest presets for.' };
  }

  const words = q.replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length >= 3);

  // Find matched synonym targets
  const synonymTargetIds = new Set<string>();
  for (const [key, targets] of Object.entries(CATALOG_SYNONYMS)) {
    if (q === key || q.includes(key) || key.includes(q)) {
      for (const id of targets) synonymTargetIds.add(id);
    }
  }

  const scoreItem = (item: BasePreset & { pre?: string; post?: string }, cat: string) => {
    const id = item.id.toLowerCase();
    const label = item.label.toLowerCase();
    const pv = (item.promptValue || '').toLowerCase();
    const pre = (item.pre || '').toLowerCase();
    const post = (item.post || '').toLowerCase();
    const text = `${id} ${label} ${pv} ${pre} ${post}`;

    let score = 0;
    if (id === q || label === q) score += 100;
    if (synonymTargetIds.has(item.id)) score += 80;
    for (const w of words) {
      if (id === w || label === w) score += 40;
      else if (id.includes(w)) score += 20;
      else if (label.includes(w)) score += 15;
      else if (pv.includes(w)) score += 10;
      else if (pre.includes(w) || post.includes(w)) score += 8;
    }
    return score;
  };

  const recipe: Record<string, { id: string; label: string; score: number }> = {};
  const targetCategories = Object.keys(library).filter(key => key !== 'version');

  for (const cat of targetCategories) {
    const items = (library[cat as keyof PresetLibrary] || []) as Array<BasePreset & { pre?: string; post?: string }>;
    let best: BasePreset | null = null;
    let maxScore = 0;
    for (const item of items) {
      const s = scoreItem(item, cat);
      if (s > maxScore) {
        maxScore = s;
        best = item;
      }
    }
    if (best && maxScore >= 15) {
      recipe[cat] = { id: best.id, label: best.label, score: maxScore };
    }
  }

  // Movements
  let bestMov: (typeof CINEMATIC_CAMERA_MOVEMENTS)[number] | null = null;
  let maxMovScore = 0;
  for (const m of CINEMATIC_CAMERA_MOVEMENTS) {
    const aliases = m.aliases || [];
    const text = `${m.id} ${m.label} ${m.category} ${m.promptKeyword} ${m.fullPromptRecipe} ${aliases.join(' ')}`.toLowerCase();
    let score = 0;
    if (synonymTargetIds.has(m.id)) score += 80;
    for (const w of words) {
      if (m.id.includes(w) || m.label.toLowerCase().includes(w)) score += 25;
      else if (aliases.some((a) => a.toLowerCase().includes(w))) score += 20;
      else if (text.includes(w)) score += 10;
    }
    if (score > maxMovScore) {
      maxMovScore = score;
      bestMov = m;
    }
  }
  if (bestMov && maxMovScore >= 15) {
    recipe.movement = { id: bestMov.id, label: bestMov.label, score: maxMovScore };
  }

  return {
    status: 'ok',
    action: 'suggest',
    data: { intent, recipe },
  };
}

export function executeAction(action: string, payload: Record<string, unknown>): CliOutput {
  try { return executeValidatedAction(action, payload); }
  catch (err) { return { status: 'error', action, error: err instanceof Error ? err.message : String(err) }; }
}
function executeValidatedAction(action: string, payload: Record<string, unknown>): CliOutput {
  switch (action) {
    case 'assemble':
    case 'assemble_prompt':
    case 'photo':
    case 'anime':
    case 'edit':
    case 'video':
    case 'assemble_video': {
      const { action: dispatchAction, raw, options, state, videoState, ...flat } = payload;
      const source = (videoState || state || flat) as Record<string, unknown>;
      const selectedMode = action === 'video' || action === 'assemble_video' ? 'video' : ['photo', 'anime', 'edit'].includes(action) ? action : payload.mode || source.mode || 'photo';
      const normalized = normalizeState({ ...source, mode: selectedMode });
      const compiled = options ? compilePrompt({ ...stateToIR(normalized), referenceOptions: { ...normalized.referenceOptions, ...ReferenceOptionsSchema.parse(options) } }, library) : assembleDetailed(normalized, library);
      return { status: compiled.valid ? 'ok' : 'error', action: selectedMode === 'video' ? 'assemble_video' : 'assemble', prompt: compiled.positivePrompt,
        ...(compiled.valid ? {} : { error: 'Prompt contains validation errors; inspect data.diagnostics.' }),
        data: { ...compiled, prompt: compiled.positivePrompt, state: normalized, videoState: selectedMode === 'video' ? normalized : undefined } };
    }

    case 'director':
    case 'director_timeline': {
      const shots = (payload.shots || payload.directorShots || []) as ReadonlyArray<DirectorShot>;
      const fallbackDuration = payload.fallbackDuration as string | undefined;
      const scene = payload.ir ? PromptIRSchema.parse(payload.ir) : payload.state ? stateToIR(normalizeState({ ...(payload.state as Record<string, unknown>), mode: 'video' })) : undefined;
      const res = buildDirectorTimeline(shots, fallbackDuration, { scene, library, timelineOptions: payload.timelineOptions as PromptIR['timelineOptions'] });
      return {
        status: res.diagnostics.some(d => d.severity === 'error') ? 'error' : 'ok',
        ...(res.diagnostics.some(d => d.severity === 'error') ? { error: 'Director scene contains validation errors; inspect data.diagnostics.' } : {}),
        action: 'director_timeline',
        prompt: res.timelinePrompt,
        data: res,
      };
    }

    case 'references':
    case 'resolve_references': {
      const slots = (payload.slots || payload.references || []) as ReferenceSlotInput[];
      const options = (payload.options || {}) as Parameters<typeof resolveReferences>[1];
      const res = resolveReferences(slots, options);
      return {
        status: 'ok',
        action: 'resolve_references',
        prompt: res.instruction.display,
        data: res,
      };
    }

    case 'sync': {
      const prevText = String(payload.prevText || '');
      const nextText = String(payload.nextText || '');
      const synced = sync(prevText, nextText);
      return {
        status: 'ok',
        action: 'sync',
        prompt: synced,
        data: { synced },
      };
    }

    case 'suggest': {
      const intent = String(payload.intent || payload.query || payload.prompt || '');
      return handleSuggest(intent);
    }

    case 'catalog': {
      const subcommand = String(payload.subcommand || payload.sub || (payload.query ? 'search' : payload.category ? 'list' : 'categories'));
      const positionals: string[] = [subcommand];
      if (subcommand === 'list' && payload.category) {
        positionals.push(String(payload.category));
      } else if (subcommand === 'search' && payload.query) {
        positionals.push(String(payload.query));
      }
      const flags: Record<string, string | boolean | string[]> = {};
      if (payload.category) flags.category = String(payload.category);
      if (payload.query) flags.query = String(payload.query);
      return handleCatalog(positionals, flags);
    }

    case 'capabilities': {
      return handleCapabilities();
    }

    case 'compile': {
      try {
        const { action: dispatcher, raw, ...flat } = payload;
        const ir = PromptIRSchema.parse(payload.ir || { ...flat, ...(dispatcher && !['compile', 'lint'].includes(String(dispatcher)) ? { action: dispatcher } : {}) });
        const res = compilePrompt(ir, library);
        return { status: res.valid ? 'ok' : 'error', action: 'compile', prompt: res.positivePrompt, data: res, ...(res.valid ? {} : { error: 'Prompt contains validation errors; inspect data.diagnostics.' }) };
      } catch (err: unknown) {
        return { status: 'error', action: 'compile', error: err instanceof Error ? err.message : String(err) };
      }
    }

    case 'lint': {
      try {
        const { action: dispatcher, raw, ...flat } = payload;
        const ir = PromptIRSchema.parse(payload.ir || { ...flat, ...(dispatcher && !['compile', 'lint'].includes(String(dispatcher)) ? { action: dispatcher } : {}) });
        const report = lintPromptIR(ir, library);
        return { status: 'ok', action: 'lint', data: report };
      } catch (err: unknown) {
        return { status: 'error', action: 'lint', error: err instanceof Error ? err.message : String(err) };
      }
    }

    case 'hybrid_search': {
      const engine = new HybridSearchEngine(library);
      const query = String(payload.query || payload.q || '');
      const category = payload.category as string | undefined;
      const limit = typeof payload.limit === 'number' ? payload.limit : 15;
      const results = engine.search(query, { category, limit });
      return { status: 'ok', action: 'hybrid_search', data: { query, count: results.length, results } };
    }

    case 'validate': {
      try {
        const type = String(payload.type || 'state');
        if (type === 'library') {
          const validated = validateLibrary(payload.library || payload.data);
          return { status: 'ok', action: 'validate', data: { valid: true, version: validated.version } };
        }
        const { action: _, type: ignored, ...flat } = payload;
        if (type === 'ir') PromptIRSchema.parse(payload.ir || payload.data || flat);
        else if (type === 'state') PromptStateInputSchema.parse(payload.state || payload.data || flat);
        else throw new Error(`Unknown validation type: ${type}`);
        return { status: 'ok', action: 'validate', data: { valid: true } };
      } catch (err: unknown) {
        return {
          status: 'error',
          action: 'validate',
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }

    default:
      return {
        status: 'error',
        error: `Unknown action: ${action}`,
      };
  }
}

export async function main(): Promise<void> {
  const rawArgs = process.argv.slice(2);

  if (rawArgs.includes('-h') || rawArgs.includes('--help') || rawArgs[0] === 'help') {
    printHelp();
    return;
  }
  if (rawArgs[0] === 'mcp') {
    const server = new McpStdioServer(library);
    await server.start();
    return;
  }

  let stdinPayload = '';
  if (!process.stdin.isTTY) {
    try {
      stdinPayload = readFileSync(0, 'utf-8');
    } catch {
      stdinPayload = '';
    }
  }

  if (rawArgs.length === 0 && !stdinPayload.trim()) {
    printHelp();
    return;
  }
  if (rawArgs[0] === 'capabilities') {
    outputResult(handleCapabilities());
    return;
  }

  const { command, flags, positionals } = parseCliArgs(rawArgs);

  if (command === 'catalog') {
    const raw = Boolean(flags.raw);
    const res = handleCatalog(positionals, flags);
    outputResult(res, raw);
    if (res.status === 'error') process.exit(1);
    return;
  }

  if (command === 'suggest') {
    const raw = Boolean(flags.raw);
    const intent = positionals.join(' ') || (flags.intent as string) || (flags.query as string) || '';
    const res = handleSuggest(intent);
    outputResult(res, raw);
    if (res.status === 'error') process.exit(1);
    return;
  }

  let payloadStr = stdinPayload;
  if (typeof flags.state === 'string') {
    payloadStr = flags.state;
  } else if (typeof flags.json === 'string') {
    payloadStr = flags.json;
  }
  if (payloadStr.trim()) {
    try {
      const input = JSON.parse(payloadStr) as Record<string, unknown>;
      const action = command !== 'assemble' ? command : (input.action as string | undefined) || 'assemble';
      const raw = Boolean(flags.raw || input.raw);
      const res = executeAction(action, input);
      outputResult(res, raw);
      if (res.status === 'error') process.exit(1);
      return;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      outputResult({ status: 'error', error: message });
      process.exit(1);
    }
  }

  const raw = Boolean(flags.raw);
  const filters: string[] = [];
  if (flags.filter) {
    if (Array.isArray(flags.filter)) {
      for (const f of flags.filter) filters.push(...f.split(','));
    } else if (typeof flags.filter === 'string') {
      filters.push(...flags.filter.split(','));
    }
  }

  const mode = (flags.mode as PromptMode) || (command === 'photo' || command === 'anime' || command === 'edit' || command === 'video' ? command : 'photo');

  if (command === 'sync') {
    const prevText = String(flags.prev || flags['prev-text'] || positionals[0] || '');
    const nextText = String(flags.next || flags['next-text'] || positionals[1] || '');
    const res = executeAction('sync', { prevText, nextText });
    outputResult(res, raw);
    if (res.status === 'error') process.exitCode = 1;
    return;
  }

  const subjectVal = typeof flags.subject === 'string'
    ? flags.subject
    : typeof flags.action === 'string'
      ? flags.action
      : (positionals.join(' ') || '');

  const promptState: Partial<PromptState> = {
    mode,
    target: typeof flags.target === 'string' ? flags.target as PromptIR['target'] : undefined,
    styleMode: typeof flags['style-mode'] === 'string' ? flags['style-mode'] as NonNullable<PromptIR['style']>['mode'] : undefined,
    artStyle: typeof flags['art-style'] === 'string' ? flags['art-style'] : '',
    negativePrompt: typeof flags.negative === 'string' ? flags.negative : '',
    seed: typeof flags.seed === 'string' ? Number(flags.seed) : undefined,
    quality: typeof flags.quality === 'string' ? Number(flags.quality) : undefined,
    focalLengthId: typeof flags['focal-length'] === 'string' ? flags['focal-length'] : '',
    directionId: typeof flags.direction === 'string' ? flags.direction : '',
    genreId: typeof flags.genre === 'string' ? flags.genre : '',
    subject: subjectVal,
    subjectAction: subjectVal,
    environment: typeof flags.env === 'string' ? flags.env : '',
    mood: typeof flags.mood === 'string' ? flags.mood : '',
    shotId: typeof flags.shot === 'string' ? flags.shot : '',
    lightingId: typeof flags.lighting === 'string' ? flags.lighting : '',
    cameraId: typeof flags.camera === 'string' ? flags.camera : '',
    lensId: typeof flags.lens === 'string' ? flags.lens : '',
    fStop: typeof flags['f-stop'] === 'string' ? flags['f-stop'] : null,
    filmId: typeof flags.film === 'string' ? flags.film : '',
    filters: filters.map((f) => f.trim()).filter(Boolean),
    movieLookId: typeof flags['movie-look'] === 'string' ? flags['movie-look'] : '',
    photographerId: typeof flags.photographer === 'string' ? flags.photographer : '',
    animeGenreId: typeof flags['anime-genre'] === 'string' ? flags['anime-genre'] : '',
    animeShowStyleId: typeof flags['anime-show'] === 'string' ? flags['anime-show'] : '',
    westernAnimationStyleId: typeof flags['western-style'] === 'string' ? flags['western-style'] : '',
    aspectRatio: typeof flags.aspect === 'string' ? flags.aspect : '16:9',
    noText: Boolean(flags['no-text']),
    candidShot: Boolean(flags.candid),
    showNewAnglePrompt: Boolean(flags['new-angle']),
    references: [],
  };

  if (command === 'director' || command === 'director_timeline') {
    const shotNote = String(flags.note || flags.prompt || positionals.join(' ') || '');
    const durationHint = typeof flags.duration === 'string' ? flags.duration : '5';
    const shots: DirectorShot[] = shotNote ? [{ note: shotNote, durationHint }] : [];
    const res = executeAction('director_timeline', { shots, state: { ...promptState, mode: 'video', subject: typeof flags.subject === 'string' ? flags.subject : '', subjectAction: typeof flags.subject === 'string' ? flags.subject : '' } });
    outputResult(res, raw);
    if (res.status === 'error') process.exitCode = 1;
    return;
  }

  if (command === 'compile' || command === 'lint') {
    const ir = stateToIR(normalizeState({ ...promptState, target: typeof flags.target === 'string' ? flags.target : 'generic', mode: flags.mode || (['kling', 'veo', 'sora', 'runway', 'wan', 'minimax-h3'].includes(String(flags.target)) ? 'video' : mode),
      movementLabel: typeof flags.movement === 'string' ? flags.movement : '',
    }));
    if (typeof flags.action === 'string' && flags.subject) ir.action = flags.action;
    const res = executeAction(command, { ir });
    outputResult(res, raw);
    if (res.status === 'error') process.exitCode = 1;
    return;
  }

  if (mode === 'video' || command === 'video' || command === 'assemble_video') {
    const videoState: Partial<VideoState> = {
      ...promptState,
      subject: subjectVal,
      subjectAction: subjectVal,
      environment: typeof flags.env === 'string' ? flags.env : '',
      mood: typeof flags.mood === 'string' ? flags.mood : '',
      videoPrompt: typeof flags['video-prompt'] === 'string' ? flags['video-prompt'] : (positionals.join(' ') || ''),
      movementLabel: typeof flags.movement === 'string' ? flags.movement : '',
      directorMode: Boolean(flags['director-mode']),
      aspectRatio: typeof flags.aspect === 'string' ? flags.aspect : '16:9',
      directorShots: [],
      references: [],
    };
    const res = executeAction('assemble_video', { videoState });
    outputResult(res, raw);
    if (res.status === 'error') process.exitCode = 1;
    return;
  }

  const res = executeAction(command === 'assemble' ? 'assemble' : command, { state: promptState, mode });
  outputResult(res, raw);
  if (res.status === 'error') process.exitCode = 1;
}

if (import.meta.main || (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))) {
  main().catch(err => { outputResult({ status: 'error', error: err instanceof Error ? err.message : String(err) }); process.exitCode = 1; });
}
