<div align="center">

# Promptcraft

**Production-Grade Prompt Assembly Engine & Agent Interface for Cinematic Image & Video Generation**

[![CI](https://github.com/sivakoneti/promptcraft/actions/workflows/ci.yml/badge.svg)](https://github.com/sivakoneti/promptcraft/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Runtime: Bun](https://img.shields.io/badge/Built%20with-Bun-f472b6.svg)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![Tenx Managed](https://img.shields.io/badge/Harness-Tenx%20SDLC-black.svg)](.tenx/)

*Deterministic, zero-hallucination prompt synthesis with 16 cinematic preset catalogs, 26 camera movements, multi-character reference resolution, and Kling/Veo multi-shot director timelines.*

[Quickstart](#quickstart) • [Core Capabilities](#core-capabilities) • [AI Agent Integration](#ai-agent-integration) • [Action Reference](#action-reference) • [Architecture](#architecture) • [Testing & CI](#testing--ci)

---

</div>

## Overview

Modern text-to-image and generative video models (Flux, Midjourney, Kling, Veo, Sora, Stable Diffusion) require precise, structured prompt syntax to yield consistent results. Ad-hoc natural language prompts frequently produce inconsistent optics, lighting mismatches, and broken multi-character identities.

**Promptcraft** solves this by providing:
1. **Deterministic Master Assemblers**: Byte-exact ordering for camera gear, focal lengths, lighting, film stocks, movie looks, and guardrails.
2. **16 Curated Preset Catalogs**: Over 500+ verified cinematic dimensions embedded directly in binary builds.
3. **Multi-Character Priority Pruning**: Resolves reference image slots (`face`, `outfit`, `scene`, `global`) by strict priority order.
4. **Director Multi-Shot Timeline**: Compiles Kling-compliant multi-shot sequences with duration tags (3–15s clamps) and character limits.
5. **Dual Interface**: Native standalone binary with both CLI flag syntax and structured JSON IPC over `stdin`/`stdout`.

---

## Quickstart

### 1. Prerequisites
- [Bun](https://bun.sh) (v1.1+ recommended)

### 2. Installation & Build
```bash
git clone https://github.com/sivakoneti/promptcraft.git
cd promptcraft
bun install

# Compile zero-dependency standalone native executable
bun run build:cli
# Compiled binary located at: ./bin/promptcraft
```

### 3. Basic CLI Usage

#### Photographic / Cinematic Prompt
```bash
./bin/promptcraft photo \
  --subject "cyberpunk detective examining glowing holographic data" \
  --shot close-up \
  --lighting neon-lit \
  --camera arri-alexa-65 \
  --lens anamorphic-cinema-lens \
  --film kodak-vision3-500t \
  --movie-look blade-runner-2049 \
  --aspect 21:9 \
  --raw
```
**Output:**
```text
A photographic image of a Close up shot of cyberpunk detective examining glowing holographic data. Captured with the look of a ARRI ALEXA 65, Anamorphic Cinema, Kodak Vision3 500T film. With the visual aesthetic of the movie Blade Runner 2049 with amber desert tones, cyan shadows, clean contrast, minimal grain Don't blur faces randomly. The image should be in a 21:9 format.
```

#### Video Mode with Camera Movement
```bash
./bin/promptcraft video \
  --video-prompt "hypercar accelerating across rainy bridge" \
  --movement "Orbit" \
  --env "neon reflections on wet asphalt at midnight" \
  --mood "high adrenaline" \
  --raw
```
**Output:**
```text
hypercar accelerating across rainy bridge orbit 360 rotation around subject neon reflections on wet asphalt at midnight, high adrenaline
```

---

## Core Capabilities

```
                       ┌───────────────────────────────────────────────┐
                       │               Promptcraft Engine              │
                       └──────────────────────┬────────────────────────┘
                                              │
         ┌──────────────────┬─────────────────┼─────────────────┬──────────────────┐
         ▼                  ▼                 ▼                 ▼                  ▼
    Photo Mode         Anime Mode         Edit Mode         Video Mode       Director Mode
 (Cinematic Optics)  (Anime & Comics)   (In-Painting)     (26 Movements)   (Kling Multi-Shot)
         │                  │                 │                 │                  │
         └──────────────────┴─────────────────┼─────────────────┴──────────────────┘
                                              │
                                   ┌──────────┴──────────┐
                                   │  Reference Engine   │
                                   │  (Priority Pruning) │
                                   └──────────┬──────────┘
                                              ▼
                                 [Deterministic Formatted Prompt]
```

### 1. 16 Curated Catalog Dimensions
- **Shots & Angles** (24): `bird-s-eye-view`, `close-up`, `cutaway-shot`, `dutch-angle`, `entire-body`, `establishing-shot`, `extreme-close-up`, `worm-s-eye-view`...
- **Cameras** (49): `arri-alexa-65`, `red-v-raptor-8k`, `imax-70mm`, `hasselblad-500c`, `leica-m6`, `sony-fx9`...
- **Lenses** (12): `anamorphic-cinema-lens`, `helios-44-2-swirly-bokeh`, `catadioptric-mirror-lens`, `fisheye-lens`...
- **Focal Lengths** (9): `8mm-fisheye`, `14mm-ultra-wide`, `24mm-wide-angle`, `35mm-wide`, `50mm-standard`, `85mm-portrait`...
- **Film Stocks** (30): `kodak-vision3-500t`, `kodak-portra-400`, `cinestill-800t`, `fujifilm-eterna`, `agfa-vista`...
- **Lighting & Mood** (29): `backlighting-rim-lighting`, `blue-hour`, `chiaroscuro-lighting`, `golden-hour`, `neon-lit`...
- **Movie Aesthetics** (110): `blade-runner-2049`, `the-matrix`, `dune`, `alien`, `2001-a-space-odyssey`, `interstellar`...
- **Photographer Styles** (99): `annie-leibovitz`, `gregory-crewdson`, `alec-soth`, `sebastiao-salgado`...
- **Anime & Show Styles** (97): `cyberpunk`, `battle-shonen-anime`, `demon-slayer`, `evangelion`, `studio-ghibli`, `spider-verse`...

### 2. Video Camera Movements (26 Movements)
Verbatim keyword insertions at precise character offsets:
- `Orbit` $\to$ `orbit 360 rotation around subject`
- `Dolly in` / `Dolly out` $\to$ `camera dolly in` / `camera dolly out`
- `Whip Pan` $\to$ `whip pan transition`
- `Crash Zoom` $\to$ `crash zoom`
- `Arc Shot` $\to$ `arc shot around subject`
- `Slow Motion` $\to$ `slow motion moment`
- `Shot Switch` $\to$ `Shot switch cut to:`

### 3. Multi-Character Reference Resolution
Ensures character and scene consistency across generation and edit workflows:
- **Priority Hierarchy**: `global (1)` > `face (2)` > `scene (3)` > `outfit (4)` > `object (5)` > `anonymous (6)`.
- Automatically caps to target model maximums while retaining overflow in structured metadata.
- Synthesizes exact binding instructions: `image_1 as Character1 face reference; image_2 as scene style reference...`.

---

## AI Agent Integration

Promptcraft is designed from the ground up for agentic execution. Agents interact through JSON over `stdin`/`stdout`.

### Agent Workflow

```
[Agent boots] ──> [calls `capabilities`] ──> [searches `catalog`] ──> [assembles prompt] ──> [dispatches to model]
```

### 1. Discover Capabilities
```bash
./bin/promptcraft capabilities
```
Returns machine-readable JSON containing action schemas, catalog counts, and movement tokens.

### 2. Search Presets
```bash
./bin/promptcraft catalog search "blade runner"
```

### 3. Multi-Shot Director Timeline Generation
```bash
echo '{
  "action": "director_timeline",
  "shots": [
    { "note": "Low angle tracking shot of android sprinting through neon alley", "durationHint": "4" },
    { "note": "Close up on optical sensors locking onto target", "durationHint": "3" },
    { "note": "Drone pull-back revealing surrounding security perimeter", "durationHint": "5" }
  ]
}' | ./bin/promptcraft
```
**JSON Response:**
```json
{
  "status": "ok",
  "action": "director_timeline",
  "prompt": "Shot 1: Low angle tracking shot of android sprinting through neon alley (4s) Shot 2: Close up on optical sensors locking onto target (3s) Shot 3: Drone pull-back revealing surrounding security perimeter (5s)",
  "data": {
    "shots": [
      { "index": 1, "prompt": "Low angle tracking shot of android sprinting through neon alley", "duration": "4" },
      { "index": 2, "prompt": "Close up on optical sensors locking onto target", "duration": "3" },
      { "index": 3, "prompt": "Drone pull-back revealing surrounding security perimeter", "duration": "5" }
    ],
    "shotType": "customize",
    "totalDuration": 12,
    "clampedDuration": 12,
    "timelinePrompt": "Shot 1: Low angle tracking shot of android sprinting through neon alley (4s) Shot 2: Close up on optical sensors locking onto target (3s) Shot 3: Drone pull-back revealing surrounding security perimeter (5s)"
  }
}
```

### 4. Live Fragment Synchronization
When an agent or user alters only one parameter (e.g. changing lighting or aspect ratio), `sync` patches the prompt in-place:
```bash
./bin/promptcraft sync \
  --prev "A photographic image of a subject. The scene is illuminated by studio lighting. The image should be in a 16:9 format." \
  --next "A photographic image of a subject. The scene is illuminated by dramatic neon backlight. The image should be in a 16:9 format." \
  --raw
```

---

## Action Reference

| Command / Action | Description | Input Parameters |
|---|---|---|
| `assemble` / `photo` | Assemble cinematic photo prompt | `subject`, `shotId`, `lightingId`, `cameraId`, `lensId`, `filmId`, `movieLookId`, `photographerId`, `aspectRatio` |
| `anime` | Assemble anime or western animation prompt | `subject`, `animeGenreId`, `animeShowStyleId`, `westernAnimationStyleId`, `lightingId`, `aspectRatio` |
| `edit` | Assemble inpainting / modification prompt | `subjectAction`, `lightingId`, `references`, `aspectRatio` |
| `video` / `assemble_video` | Assemble single-shot video prompt with movement | `videoPrompt`, `movementLabel`, `environment`, `mood`, `references` |
| `director` / `director_timeline` | Compile Kling multi-shot timeline | `shots: Array<{ note: string, durationHint?: string }>` |
| `references` / `resolve_references` | Resolve and prune reference slots | `slots: Array<ReferenceSlot>`, `options: { maxReferenceImages, order }` |
| `sync` | Live prompt fragment patcher | `prevText: string`, `nextText: string` |
| `catalog` | Explore and search preset database | `subcommand: categories \| list <category> \| search <query>` |
| `capabilities` | Self-documenting agent catalog schema | None |

---

## Architecture & Project Structure

```
promptcraft/
├── .github/workflows/ci.yml       # GitHub Actions CI pipeline
├── .tenx/                         # Tenx SDLC management harness
│   ├── conventions/CON-001...     # Architecture and coding conventions
│   ├── docs/DOC-001...            # Deep-dive architecture overview
│   ├── epics/EPC-001...           # Epic roadmap
│   └── specs/SPC-001...           # Technical specification & tickets
├── bin/
│   └── promptcraft                # Standalone native compiled executable (Bun)
├── engine/
│   ├── library/
│   │   ├── presets.json           # 16 dimension preset catalog definitions
│   │   └── video-movements.ts     # 26 camera movement keyword catalog
│   └── src/
│       ├── assemble.ts            # Master mode assembler
│       ├── cli.ts                 # Dual interface CLI dispatcher
│       ├── cli.test.ts            # CLI integration tests
│       ├── fragments.ts           # Pure fragment generator functions
│       ├── library-data.ts        # Embedded catalog export for zero-dep binary
│       ├── references.ts          # Priority-based reference resolution engine
│       ├── state.ts               # Zod schemas and state definitions
│       ├── sync.ts                # In-place prompt synchronization
│       └── video.ts               # Video prompt and director timeline engine
├── package.json                   # Root scripts and workspace config
├── CHANGELOG.md                   # Keep-a-Changelog tracking
├── CONTRIBUTING.md                # Contribution guidelines
├── SECURITY.md                    # Security policy
└── LICENSE                        # MIT License
```

---

## Testing & CI

All pull requests and commits are verified against automated test suites running on Bun via GitHub Actions.

```bash
# Run unit, golden-file, and CLI tests
bun test

# Run TypeScript typechecks
bun run typecheck

# Validate Tenx SDLC health
tenx validate
```

---

## License

This project is licensed under the terms of the [MIT License](LICENSE).
