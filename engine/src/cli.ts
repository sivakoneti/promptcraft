#!/usr/bin/env node
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
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createDefaultState,
  validateLibrary,
  type PromptState,
  type PresetLibrary,
  type PromptMode,
  type BasePreset,
} from './state.js';
import { assemble, assemblePhoto, assembleAnime, assembleEdit } from './assemble.js';
import {
  assembleVideo,
  buildDirectorTimeline,
  createDefaultVideoState,
  VIDEO_MOVEMENTS,
  type VideoState,
  type DirectorShot,
} from './video.js';
import { resolveReferences, type ReferenceSlotInput } from './references.js';
import { sync } from './sync.js';
import { embeddedPresetLibrary } from './library-data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getPresetLibrary(): PresetLibrary {
  const localPath = join(__dirname, '..', 'library', 'presets.json');
  if (existsSync(localPath)) {
    try {
      const data = JSON.parse(readFileSync(localPath, 'utf-8'));
      return data as PresetLibrary;
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
  director [options]            Build Kling director multi-shot timeline
  references [options]          Resolve reference slots with category priority pruning
  sync [options]                Re-sync modified prompt fragments in-place
  catalog [subcommand]          Explore available catalogs (shots, lighting, cameras, film, anime, movements...)
  capabilities                  Output machine-readable catalog & action schema for AI agents
  validate [options]            Validate a PromptState or VideoState JSON object
  help                          Show this help message

ASSEMBLE FLAGS:
  --mode <photo|anime|edit|video>
  --subject <text>              Subject description
  --action <text>               Subject action / primary action
  --env <text>                  Environment / background setting
  --mood <text>                 Mood / atmosphere description
  --shot <id>                   Shot ID (e.g. bird-s-eye-view, close-up, wide-shot...)
  --lighting <id>               Lighting ID (e.g. golden-hour, dramatic-cinematic, neon-lit...)
  --camera <id>                 Camera ID (e.g. arri-alexa-65, red-v-raptor-8k, imax-70mm...)
  --lens <id>                   Lens ID (e.g. anamorphic-prime, master-prime, vintage-warm...)
  --f-stop <value>              f-stop value (e.g. f/1.4, f/2.8)
  --film <id>                   Film stock ID (e.g. kodak-vision3-500t, fujifilm-eterna...)
  --filter <ids...>             Filter IDs (comma-separated or multiple --filter flags)
  --movie-look <id>             Movie look ID (e.g. blade-runner-2049, the-matrix, dune...)
  --photographer <id>           Photographer style ID (e.g. gregory-crewdson, annie-leibovitz...)
  --anime-genre <id>            Anime genre ID (e.g. cyberpunk, shonen, studio-ghibli...)
  --anime-show <id>             Anime show style ID (e.g. evangelion, demon-slayer...)
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
  promptcraft anime --subject "sorcerer casting blue flame" --anime-genre cyberpunk --anime-show evangelion

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
  validate: true,
  help: true,
  '--help': true,
  '-h': true,
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

  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        if (flags[key] !== undefined) {
          const current = flags[key];
          if (Array.isArray(current)) {
            current.push(next);
          } else if (typeof current === 'string') {
            flags[key] = [current, next];
          }
        } else {
          flags[key] = next;
        }
        i += 2;
      } else {
        flags[key] = true;
        i += 1;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      flags[key] = true;
      i += 1;
    } else {
      positionals.push(arg);
      i += 1;
    }
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
      version: '1.0.0',
      actions: [
        {
          name: 'assemble',
          description: 'Assemble photographic, anime, edit, or video prompts deterministically',
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
          description: 'Assemble video prompts with camera movements, autofill, and reference slots',
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
          description: 'Construct Kling-compliant multi-shot timeline prompt and structured normalized shots',
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
      videoMovementsCount: VIDEO_MOVEMENTS.length,
      videoMovements: VIDEO_MOVEMENTS.map((m) => ({ label: m.label, promptKeyword: m.promptKeyword })),
      catalogs: catalogSummary,
    },
  };
}

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

  if (sub === 'movements') {
    return {
      status: 'ok',
      action: 'catalog.movements',
      data: VIDEO_MOVEMENTS,
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

    if (category === 'movements' || category === 'videoMovements') {
      return {
        status: 'ok',
        action: 'catalog.list',
        data: VIDEO_MOVEMENTS,
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

    const q = query.toLowerCase();
    const results: Array<{ category: string; id: string; label: string; promptValue?: string }> = [];

    // Search library catalogs
    for (const [catName, catItems] of Object.entries(library)) {
      if (Array.isArray(catItems)) {
        const presets: BasePreset[] = catItems;
        for (const item of presets) {
          if (
            item.id.toLowerCase().includes(q) ||
            item.label.toLowerCase().includes(q) ||
            (item.promptValue && item.promptValue.toLowerCase().includes(q))
          ) {
            results.push({
              category: catName,
              id: item.id,
              label: item.label,
              promptValue: item.promptValue,
            });
          }
        }
      }
    }

    // Search video movements
    for (const m of VIDEO_MOVEMENTS) {
      if (m.label.toLowerCase().includes(q) || m.promptKeyword.toLowerCase().includes(q)) {
        results.push({
          category: 'movements',
          id: m.label,
          label: m.label,
          promptValue: m.promptKeyword,
        });
      }
    }

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

export function executeAction(action: string, payload: Record<string, unknown>): CliOutput {
  switch (action) {
    case 'assemble':
    case 'assemble_prompt':
    case 'photo':
    case 'anime':
    case 'edit': {
      const mode = (payload.mode as PromptMode) || (action === 'anime' ? 'anime' : action === 'edit' ? 'edit' : 'photo');
      const stateObj = (payload.state || payload) as Partial<PromptState>;
      const subjectText = typeof stateObj.subjectAction === 'string' && stateObj.subjectAction.length > 0
        ? stateObj.subjectAction
        : typeof stateObj.subject === 'string' && stateObj.subject.length > 0
          ? stateObj.subject
          : typeof payload.subjectAction === 'string' && payload.subjectAction.length > 0
            ? payload.subjectAction
            : typeof payload.subject === 'string' && payload.subject.length > 0
              ? payload.subject
              : '';

      const state: PromptState = {
        ...createDefaultState(),
        ...stateObj,
        subject: subjectText,
        subjectAction: subjectText,
        mode,
      };

      let prompt = '';
      if (mode === 'photo') {
        prompt = assemblePhoto(state, library);
      } else if (mode === 'anime') {
        prompt = assembleAnime(state, library);
      } else if (mode === 'edit') {
        prompt = assembleEdit(state, library);
      } else {
        prompt = assemble(state, library);
      }

      return {
        status: 'ok',
        action: 'assemble',
        prompt,
        data: { prompt, state },
      };
    }

    case 'video':
    case 'assemble_video': {
      const stateObj = (payload.videoState || payload.state || payload) as Partial<VideoState>;
      const subjectText = typeof stateObj.subjectAction === 'string' && stateObj.subjectAction.length > 0
        ? stateObj.subjectAction
        : typeof stateObj.subject === 'string' && stateObj.subject.length > 0
          ? stateObj.subject
          : typeof payload.subjectAction === 'string' && payload.subjectAction.length > 0
            ? payload.subjectAction
            : typeof payload.subject === 'string' && payload.subject.length > 0
              ? payload.subject
              : '';

      const videoState: VideoState = {
        ...createDefaultVideoState(),
        ...stateObj,
        subject: subjectText,
        subjectAction: subjectText,
        mode: 'video',
      };
      const options = (payload.options || {}) as Record<string, unknown>;
      const prompt = assembleVideo(videoState, library, options);
      return {
        status: 'ok',
        action: 'assemble_video',
        prompt,
        data: { prompt, videoState },
      };
    }

    case 'director':
    case 'director_timeline': {
      const shots = (payload.shots || payload.directorShots || []) as ReadonlyArray<DirectorShot>;
      const fallbackDuration = payload.fallbackDuration as string | undefined;
      const res = buildDirectorTimeline(shots, fallbackDuration);
      return {
        status: 'ok',
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

    case 'capabilities': {
      return handleCapabilities();
    }

    case 'validate': {
      try {
        const type = String(payload.type || 'state');
        if (type === 'library') {
          const validated = validateLibrary(payload.library || payload.data);
          return { status: 'ok', action: 'validate', data: { valid: true, version: validated.version } };
        }
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

export function main(): void {
  const rawArgs = process.argv.slice(2);

  if (rawArgs.length === 0 || rawArgs.includes('-h') || rawArgs.includes('--help') || rawArgs[0] === 'help') {
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

  let payloadStr = '';
  if (typeof flags.state === 'string') {
    payloadStr = flags.state;
  } else if (typeof flags.json === 'string') {
    payloadStr = flags.json;
  } else if (!process.stdin.isTTY) {
    try {
      payloadStr = readFileSync(0, 'utf-8');
    } catch {
      payloadStr = '';
    }
  }

  if (payloadStr.trim()) {
    try {
      const input = JSON.parse(payloadStr) as Record<string, unknown>;
      const action = (input.action as string | undefined) || (command !== 'assemble' ? command : 'assemble');
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
    return;
  }

  if (command === 'director') {
    const shotNote = String(flags.note || flags.prompt || positionals.join(' ') || '');
    const durationHint = typeof flags.duration === 'string' ? flags.duration : '5';
    const shots: DirectorShot[] = shotNote ? [{ note: shotNote, durationHint }] : [];
    const res = executeAction('director_timeline', { shots });
    outputResult(res, raw);
    return;
  }

  const subjectVal = typeof flags.subject === 'string'
    ? flags.subject
    : typeof flags.action === 'string'
      ? flags.action
      : (positionals.join(' ') || '');

  if (mode === 'video' || command === 'video') {
    const videoState: Partial<VideoState> = {
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
    return;
  }

  const promptState: Partial<PromptState> = {
    mode,
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

  const res = executeAction(command === 'assemble' ? 'assemble' : command, { state: promptState, mode });
  outputResult(res, raw);
}

if (import.meta.main || process.argv[1]?.endsWith('cli.ts') || process.argv[1]?.endsWith('promptcraft')) {
  main();
}
