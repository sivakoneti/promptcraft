# Promptcraft

A deterministic TypeScript engine and CLI for assembling image, animation, edit and video prompts from a shared cinematic preset library. It includes Director timelines, spatial blocking, camera motion, physical action, reference-image instructions and automatic diagnostics.

Promptcraft produces **prompt text and portable metadata**, not provider API requests. Target names select text dialects. Provider model versions and generation settings are not pinned implicitly, and output quality still depends on the generation model and the scene you describe.

## Quick start

```bash
bun install
bun test
bun run typecheck
bun run build:cli
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

Supported targets: `midjourney`, `flux`, `sdxl`, `imagen-3`, `kling`, `veo`, `sora`, `runway`, `wan`, `generic`. Each result retains exactly its requested target. `generic` supports every mode. Video targets infer video mode when mode is omitted; explicit image/video target mismatches are errors.

Midjourney emits aspect, optional raw style, seed, quality and negative flags. Runway uses semantic channels; Veo uses blocks; other targets use scene prose, with separate negative descriptions for SDXL and Wan. Custom negatives are placed in prompt text when a dialect has no separate negative channel. Director negatives and guards stay scoped to each shot. `seed` is a portable caller hint; other than rendered flags, returned parameters need mapping to the caller's actual API.

Every compilation returns:

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

Run `promptcraft mcp` to expose `compile_prompt`, `assemble_prompt`, `lint_prompt`, `search_catalog` and `capabilities`. Discovery schemas are generated from the runtime Zod schemas, including Director overrides. Tool validation errors are returned as MCP error results; malformed JSON does not terminate the server.

`sync(previousGeneratedBlock, nextGeneratedBlock)` replaces the generated block in every mode. It does not append stale video/anime text or attempt to edit surrounding hand-written content.

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
