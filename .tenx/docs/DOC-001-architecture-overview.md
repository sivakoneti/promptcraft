---
id: DOC-001
type: doc
title: Architecture overview
status: complete
created: 2026-09-01
updated: 2026-09-01
---

## Purpose

Orientation for AI agents and developers working with `promptcraft` — a pure TypeScript deterministic prompt assembly engine and CLI for cinematic text-to-image and video generation.

## Components & Architecture

1. **Core Assembly Engine (`engine/src/assemble.ts`, `engine/src/fragments.ts`)**:
   - Deterministic prompt generation across `photo`, `anime`, `edit`, and `video` modes.
   - Exact fragment ordering and whitespace rules matching cinematic promptcraft specifications.
   - Built-in guardrails (`FACE_GUARD`, `NO_TEXT_GUARD`, aspect ratio format sentences).

2. **Catalog & Preset Library (`engine/src/library-data.ts`, `engine/library/presets.json`)**:
   - 16 distinct catalog dimensions (shots, lighting, cameras, lenses, film stocks, movie looks, photographers, anime styles, etc.) with over 500+ curated presets.
   - Embedded into binary builds for zero-dependency portability.

3. **Video & Director Multi-Shot Engine (`engine/src/video.ts`, `engine/library/video-movements.ts`)**:
   - 26 cinematic camera movement keywords (Orbit, Dolly In, Crash Zoom, Arc Shot, Whip Pan...).
   - Kling-compliant multi-shot timeline generation with prompt trimming (512-char clamp) and duration clamping (3-15s).

4. **Reference Resolution Engine (`engine/src/references.ts`)**:
   - Category-priority pruning (`global` > `face` > `scene` > `outfit` > `object` > `anonymous`).
   - Generation vs. Edit mode reference numbering and instruction synthesis.

5. **Live Fragment Synchronization (`engine/src/sync.ts`)**:
   - In-place prompt synchronization when parameters change.

6. **Unified CLI & Agent Interface (`engine/src/cli.ts`, `bin/promptcraft`)**:
   - Executable built with `bun build --compile`.
   - Dual interface: CLI flag commands and structured JSON IPC over `stdin`/`stdout`.
   - Self-documenting `capabilities` endpoint for AI agents.

## Build and Test

```bash
# Run unit & integration test suite with Bun
bun test

# Compile standalone native binary
bun run build:cli
# Output: ./bin/promptcraft

# Run CLI commands
./bin/promptcraft capabilities
./bin/promptcraft photo --subject "cyberpunk warrior" --movie-look blade-runner-2049
./bin/promptcraft video --video-prompt "car drift" --movement "Orbit"
```
