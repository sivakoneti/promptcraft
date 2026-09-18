# Promptcraft

<p align="center">
  <a href="https://github.com/sivakoneti/promptcraft/actions/workflows/ci.yml"><img src="https://github.com/sivakoneti/promptcraft/actions/workflows/ci.yml/badge.svg" alt="CI Status"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-%23000000.svg?logo=bun&logoColor=white" alt="Bun Ready"></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-Native%20Server-8A2BE2.svg" alt="Model Context Protocol"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-Strict%205.x-3178C6.svg" alt="TypeScript"></a>
</p>
A deterministic prompt compiler and cinematic engine for AI image, animation, and video generation. It unifies prompt crafting across **Midjourney, Flux, Kling 3.0, Runway Gen-4, Veo 3.1, Sora 2, Wan 2.1, MiniMax H3 (Hailuo 3.0), SDXL, and Imagen-3** using a shared structured AST, optical linting, 50+ cinematic camera movements, 15 preset categories, and native Model Context Protocol (MCP) support for Claude and Cursor.
Promptcraft produces **executable prompt text and portable parameters**, not raw API requests. Target names select model-specific dialects.

---

## AI-First: Built for Autonomous Agents

LLMs frequently hallucinate model-specific syntax (e.g. putting Midjourney flags into Flux or Kling), combine conflicting optical physical laws (e.g. fisheye + telephoto), or fail to structure video kinematics. 

**Promptcraft acts as the compiler and linter layer for AI agents:**
- **Native MCP stdio server**: Claude Desktop, Cursor, and custom agent harnesses get direct tool access to `compile_prompt`, `lint_prompt`, and `search_catalog`.
- **Pre-flight Optical Linter**: Detects physical contradictions and token overruns before costly API generation calls.
- **Machine-readable Diagnostics**: Every error and warning returns a structured JSON payload with code, field, and explanation, allowing agents to self-correct in a closed loop.
- **Dual Transport**: Works seamlessly over standard CLI flags, raw stdin/stdout JSON IPC streams, or MCP JSON-RPC.

---

## Why Promptcraft?

| Problem in Modern Prompt Engineering | How Promptcraft Solves It |
|---|---|
| **Dialect Fragmentation**: Midjourney requires parameter flags (`--ar 16:9 --v 6.1`); Runway expects semantic motion channels; Kling requires multi-shot director timings; Wan 2.1 demands 3-plane spatial depth and causal physics. | **Single Unified Schema**: Write once in `PromptIRSchema` and compile natively into Midjourney, Flux, Kling, Runway, Veo, Wan, Sora, or SDXL. |
| **Optical & Cinematic Hallucinations**: Users accidentally combine conflicting optics (e.g. fisheye + telephoto) or impossible multi-axis camera motions (e.g. simultaneously pan-left, pan-right, dolly-in, and tilt-down). | **Built-in Optical Linter**: Detects physical contradictions, unsupported target parameters, and excessive token budgets before generation. |
| **Video Incoherence & Morphing**: Text-to-video generation fails when physics, mass, inertia, and causality are absent. | **Frontier Video Architecture**: First-class support for spatial depth planes (foreground/midground/background), kinematics, causal chains, and Foley audio cues. |
| **Multi-Shot Inconsistency**: Sequenced video cuts lose character clothing, lighting, and environmental context. | **Director Mode**: Inherits shared scene parameters across shots with microsecond-precise duration scaling and per-shot optical overrides. |
| **AI Assistant Hallucinations**: LLMs forget model-specific constraints and invent unsupported parameter flags. | **Native MCP Server**: Plugs directly into Claude Desktop and Cursor to provide real-time validation, search, and compilation tools. |

---

## Installation & Usage

### 1. Zero-Install via Git (npm / npx / bun)
You can install or run Promptcraft directly from GitHub without cloning:

```bash
# Run directly via npx:
npx github:sivakoneti/promptcraft capabilities

# Or install globally:
npm install -g github:sivakoneti/promptcraft
# or with bun:
bun add -g github:sivakoneti/promptcraft
```

### 2. Standalone Binary (Zero Node/Bun Dependency)
Pre-compiled self-contained binary for Linux x86_64:
```bash
./bin/promptcraft capabilities
```

### 3. Model Context Protocol (MCP) Setup
Add to your Claude Desktop (`claude_desktop_config.json`) or Cursor (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "promptcraft": {
      "command": "npx",
      "args": ["-y", "github:sivakoneti/promptcraft", "mcp"]
    }
  }
}
```

---

## Quick start

### Development & Source Build

```bash
git clone https://github.com/sivakoneti/promptcraft.git
cd promptcraft
bun install
bun test
bun run typecheck
bun run build
./bin/promptcraft capabilities
```

The standalone Linux binary embeds the catalog and does not require the repository or Bun at runtime. You can also run `bun engine/src/cli.ts` directly. The runtime schemas use the `zod/v4` entry point available in Zod 3.25.76 and later compatible 3.x releases.

```bash
./bin/promptcraft photo --subject "a cyclist waiting beside a rain-soaked cafe" \
  --shot medium-shot --lighting neon-lighting --lens anamorphic-cinema-lens

./bin/promptcraft anime --subject "a courier crossing a rooftop" \
  --anime-show neon-revelation --no-text

./bin/promptcraft edit --subject "replace the coat with a red raincoat" \
  --lighting soft-lighting --no-text

./bin/promptcraft video --subject "a cyclist rounds a wet corner" \
  --camera arri-alexa-65 --lens anamorphic-cinema-lens \
  --lighting neon-lighting --movement "Dolly in" --no-text
```

All four assembly modes use the same catalog resolver. Camera, lens, film, focal length and aperture are independent selections: choosing a lens does not require choosing a camera. `noText` and reference instructions work in every mode. Animation presets supply their complete pre/post descriptions, and animation does not acquire photographic wording by default.

## Compile a structured scene

Use `compile` for nested controls and a target dialect. With an explicit command, JSON `action` is the **scene action**. With no command, use an envelope such as `{"action":"compile","ir":{...}}` to distinguish dispatch from scene content.

```bash
./bin/promptcraft compile --json '{
  "target": "veo",
  "subject": "a cyclist in a red raincoat",
  "action": "brakes gently before turning left",
  "environment": "a narrow wet street at dusk",
  "optics": {
    "camera": "arri-alexa-65",
    "lens": "anamorphic-cinema-lens",
    "focalLength": "35mm-wide",
    "fStop": "f/2.8",
    "shotType": "medium-shot"
  },
  "lighting": {"setup":"neon-lighting", "mood":"quiet anticipation"},
  "spatial": {
    "foreground":"rain beads on a parked bicycle",
    "midground":"the cyclist at the intersection",
    "background":"a cafe sign reflected on the road",
    "trajectory":"travels screen-right, slows, then turns away from the camera",
    "rackFocus":"hold focus on the cyclist as the foreground passes"
  },
  "motion": {"movement":"tracking-shot", "speed":"slow"},
  "physics": {
    "massAndInertia":"the bicycle leans under its rider while momentum carries it through the turn",
    "causalChain":"braking slows the wheels, the rider shifts weight, then the bicycle turns"
  },
  "anchoring":{"continuityLock":true},
  "actionChoreography":{
    "anticipation":"the rider looks into the turn",
    "execution":"the bicycle follows the curved path",
    "settle":"the rider straightens and resumes pedaling",
    "audioFoley":"soft tire hiss and light rainfall"
  },
  "aspectRatio":"16:9",
  "noText":true
}'
```

`motion.timelineBeats` is an ordered sequence **within a continuous shot**. It never invents cuts or fixed durations. Use `motion.directorShots` for actual cuts.

For coherent prompts, describe one clear subject and action first, then choose the framing and visual style. In video, distinguish the subject's path (`spatial.trajectory`) from the camera's path (`kinematics.primaryVector`). Add depth planes, focus, physical consequences and audio when they matter to the shot. Select compatible presets; the entire library is available, but combining all styles is not a useful default.

## Director mode

Every shot inherits the subject, environment, optics, lighting, style, spatial layout, motion, physics, constraints and references. `overrides` merges nested groups by field. Arrays replace inherited arrays; an empty array clears inherited filters or references. Use explicit `false` to disable an inherited boolean such as `noText` or `continuityLock`.

```json
{
  "action": "compile",
  "ir": {
    "target": "kling",
    "subject": "a courier in a yellow coat",
    "environment": "a rain-soaked station platform",
    "style": {"movieLook":"blade-runner-2049"},
    "lighting": {"setup":"neon-lighting"},
    "anchoring": {"continuityLock":true},
    "motion": {
      "directorShots": [
        {
          "shotId":"arrival",
          "note":"The courier steps onto the platform and stops beneath a lamp",
          "duration":4,
          "overrides":{
            "optics":{"shotType":"wide-shot"},
            "spatial":{"foreground":"wet railings","trajectory":"walks left to right"}
          }
        },
        {
          "shotId":"reaction",
          "note":"The courier notices a departing train and turns toward it",
          "duration":3,
          "overrides":{
            "optics":{"shotType":"close-up"},
            "motion":{"movement":"static-shot"}
          }
        }
      ]
    }
  }
}
```

Feed this JSON to `promptcraft` on stdin. Each returned shot contains its fully inherited prompt, duration, start/end times and original source index. The same Director behavior works for all video dialects and `generic` with `mode: "video"`.

Timeline limits are **configurable engine policy**, not claims about current provider limits:

- Defaults: at most 6 nonempty shots, total duration between 3 and 15 seconds, advisory 512 characters per expanded shot.
- Empty shots and shots beyond the limit are diagnosed. Omitted overflow shots are returned in `timeline.droppedShots`.
- If the selected shots exceed or fall below the duration range, durations scale proportionally. Emitted durations and timeline boundaries agree to microsecond precision. `parameters.duration` describes only emitted shots.
- Long notes and expanded prompts are preserved in full and warned about. They are never silently sliced at a character boundary.
- An empty timeline has zero duration; compilation falls back to its shared single scene.
- Set `timelineOptions` to change `maxShots`, `minTotalDuration`, `maxTotalDuration` or `maxPromptChars`. Invalid limits and nonpositive/nonfinite shot durations are rejected.

The compatibility `director` / `director_timeline` command accepts `shots: [{note, durationHint, overrides?}]`, an optional shared `state` or `ir`, and `timelineOptions`. `durationHint` is a positive numeric string; missing values default to 5. `totalDuration` and `clampedDuration` both report the emitted duration; `requestedTotalDuration` reports the selected shots' original sum.

## Preset discovery and supported fields

```bash
./bin/promptcraft catalog categories
./bin/promptcraft catalog list focalLengths
./bin/promptcraft catalog search "anamorphic"
./bin/promptcraft suggest "rainy cyberpunk street"
./bin/promptcraft capabilities
```

There are 15 embedded preset categories plus cinematic movement catalogs. `suggest` returns ranked candidates, not an instruction to combine every candidate.

| Category | Assembly state field | Structured IR field |
|---|---|---|
| shots | `shotId` | `optics.shotType` |
| directions | `directionId` | `optics.viewAngle` |
| lighting | `lightingId` | `lighting.setup` |
| cameras | `cameraId` | `optics.camera` |
| focalLengths | `focalLengthId` | `optics.focalLength` |
| lenses | `lensId` | `optics.lens` |
| filmStocks | `filmId` | `optics.filmStock` |
| genres | `genreId` | `style.genre` |
| photographers | `photographerId` | `style.photographer` |
| movieLooks | `movieLookId` | `style.movieLook` |
| filters | `filters` | `filters` |
| aspectRatios | `aspectRatio` | `aspectRatio` |
| animeGenres | `animeGenreId` | `style.animeGenre` |
| animeShowStyles | `animeShowStyleId` | `style.animeShow` |
| westernAnimationStyles | `westernAnimationStyleId` | `style.westernStyle` |

Resolution uses exact ID, exact label, category-specific alias, slug, then a unique prefix. Ambiguous prefixes and unknown selections are retained as custom text with a diagnostic. For animation, all selected descriptions are preserved; explicitly mixing photographic and animation styles produces a warning.

Assembly state also accepts `spatial`, `physics`, `kinematics`, `anchoring`, `actionChoreography`, `motion`, `referenceOptions`, `negativePrompt`, `seed`, `quality`, `rawStylize`, `tokenBudget` and `timelineOptions`. `styleMode` selects photo, anime, western-animation, illustration or cinematic rendering, including stylized video. `subjectAction` is a legacy alias for the complete subject description and takes precedence over `subject` when nonempty.

`capabilities.schemas` contains the complete generated input schemas; `sceneCapabilities` describes mode support. Unknown fields are rejected so typos cannot silently disappear.

## Targets, parameters and diagnostics

Supported targets: `midjourney`, `flux`, `sdxl`, `imagen-3`, `kling`, `veo`, `sora`, `runway`, `wan`, `minimax-h3`, `generic`. Each result retains exactly its requested target. `generic` supports every mode. Video targets infer video mode when mode is omitted; explicit image/video target mismatches are errors.

Midjourney emits aspect, optional raw style, seed, quality and negative flags. Runway uses semantic channels; Veo uses blocks; MiniMax H3 emits the official multimodal structure (`integrated_multimodal_description`, `overall_soundscape`, `non_diegetic_music`) with Director cuts and timestamps; other targets use scene prose, with separate negative descriptions for SDXL and Wan. Custom negatives are placed in prompt text when a dialect has no separate negative channel. Director negatives and guards stay scoped to each shot. `seed` is a portable caller hint; other than rendered flags, returned parameters need mapping to the caller's actual API.
- `positivePrompt`, optional `negativePrompt`, `parameters`, and `target`.
- `valid`, structured `diagnostics` with severity/code/field, and readable `warnings`.
- `lint` with diagnostics and estimated emitted token count, after catalog expansion.
- `timeline` when Director shots were supplied, plus reference resolution and per-shot reference metadata where applicable.

Optical contradictions are errors. Multiple camera axes, conflicting motion, mixed style intent, unknown presets and output-budget overruns are warnings. Temporal-only fields in image modes and unsupported target parameters are explicitly diagnosed. Warnings preserve output; errors set `valid: false` and cause CLI failure status.

The default token budget is an advisory 2048, adjustable with `tokenBudget`. The estimate is `ceil(emitted text characters / 4)`, not a provider tokenizer or hard model limit. Text is not truncated automatically.

`--raw` prints only the prompt on stdout and diagnostics on stderr. Normal CLI output is structured JSON. Use `lint` with the same IR or `validate --json '{"type":"ir","ir":{...}}'` for validation. Complex nested fields are passed through `--json`, `--state`, or stdin; simple controls have flags listed by `help`.

## Reference images

`references` holds entries with `type`, `characterIndex` and `image`, plus optional `sourcePrompt`. Character face/outfit/object entries require a nonnegative character index. Empty image slots are inactive.

Generation order places character references before scene/global references; edit mode puts the global source first. With an explicit `referenceOptions.maxReferenceImages`, priority pruning retains the most important references and returns overflow metadata with a warning. A zero or absent cap means unlimited. No target-specific reference count is guessed. Reference numbering describes the prompt; callers still supply the corresponding assets to their generation service.

## TypeScript and MCP

```ts
import { PromptIRSchema, compilePrompt, assembleDetailed, createDefaultState } from './engine/src/index.ts';
import { embeddedPresetLibrary } from './engine/src/library-data.ts';

const ir = PromptIRSchema.parse({ target: 'flux', subject: 'a fox', style: { mode: 'illustration' } });
const compiled = compilePrompt(ir, embeddedPresetLibrary);
const assembled = assembleDetailed({ ...createDefaultState(), subject: 'a fox' }, embeddedPresetLibrary);
```

`assemble`, `assemblePhoto`, `assembleAnime`, `assembleEdit` and `assembleVideo` remain string-returning convenience functions. These convenience functions throw on error diagnostics. Prefer `assembleDetailed` when callers need warnings, parameters, references or a timeline. Fragment helpers use the shared resolver too.

### Model Context Protocol (MCP) Setup

Add Promptcraft to your Claude Desktop configuration (`claude_desktop_config.json`) or Cursor settings:

```json
{
  "mcpServers": {
    "promptcraft": {
      "command": "/path/to/promptcraft/bin/promptcraft",
      "args": ["mcp"]
    }
  }
}
```

Exposed MCP Tools:
- `compile_prompt`: Compile structured IR into model-specific prompts.
- `assemble_prompt`: High-level prompt assembly with preset resolution.
- `lint_prompt`: Optical, kinematic, and target compatibility linter.
- `search_catalog`: Search 15 preset categories and 50+ camera moves via hybrid BM25 + trigram indexing.
- `capabilities`: Inspect supported targets, optical fields, and generated schemas.

## Development and migration

```bash
bun test
bun run typecheck
bun run build:cli
bun run build:bundle
bun run verify:builds
```

The tests cover every preset in every assembly mode; shared fields across every target; video fields, Director inheritance and duration boundaries; schema discovery; actual CLI/MCP transports; reference handling; and deterministic output.

The reliability update intentionally changes previous template output:

- Video and edit now honor presets; photo honors `noText`; camera-free lens/film selections work.
- Director output inherits scene settings, reports omissions and adjusts shot durations coherently. Long notes remain intact.
- Kling single-shot action no longer becomes an invented two-shot sequence.
- Sora/SDXL/Imagen/generic no longer report another target or receive Flux-specific defaults.
- No Midjourney version flag is inserted implicitly.
- Unknown fields and invalid durations are errors; ambiguous catalog prefixes no longer pick the first entry.
- `sync` replaces generated content regardless of mode.

Engineering work is tracked under `.tenx/`; follow `AGENTS.md` and require `tenx validate` to pass before completion.
