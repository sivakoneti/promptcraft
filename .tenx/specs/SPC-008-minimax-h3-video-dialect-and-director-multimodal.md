---
id: SPC-008
type: spec
title: MiniMax H3 video dialect and Director multimodal compiler
status: complete
epic: EPC-005
created: 2026-09-18
updated: 2026-09-18
tickets:
  - id: SPC-008-T1
    title: "[FR-001] Extend PromptIR schema and target capabilities with minimax-h3"
    status: done
  - id: SPC-008-T2
    title: "[FR-002][FR-003][FR-004][FR-005] Implement MiniMax H3 dialect compiler with multimodal and Director multi-shot formatting"
    status: done
  - id: SPC-008-T3
    title: "[FR-006][FR-007] Add comprehensive tests and update CLI/MCP discovery and docs"
    status: done
---

## Summary

Add `minimax-h3` as a first-class video target in Promptcraft. This produces prompt text structured in the official MiniMax H3 multimodal format (`integrated_multimodal_description`, `overall_soundscape`, `non_diegetic_music`) with precise shot cuts (`[Shot 1]`, `[Shot 2] At 00:04.000, ...`) and sound separation.

## Context and scope

MiniMax H3 (Hailuo 3.0) generates synchronized stereo audio and video from prompt specifications. Standard continuous video prompts (like Veo or Kling) cause mushy simultaneous actions or garbled audio because H3 expects:
1. An `integrated_multimodal_description` starting with `[Shot 1]` outlining visual style, composition, action development, and diegetic sound/dialogue.
2. Cuts sequenced with sequential shot headers and cut timestamps (`[Shot 2] At 00:03.500, the camera cuts to ...`).
3. Dedicated soundscape (`overall_soundscape`) for environmental, physical impact, and ambient audio.
4. Dedicated score description (`non_diegetic_music`) describing instrumentation, tempo, and rhythm (or `N/A`).

## Goals / non-goals

Goals:
- Add `minimax-h3` to `ModelTargetSchema` and compiler exports (`compileMinimaxH3`).
- Support single-shot video compilation and Director multi-shot compilation with timestamps and shot headers.
- Map audio, foley, and physics to `overall_soundscape` and score/soundtrack to `non_diegetic_music`.
- Maintain 100% backward compatibility and test coverage.

Non-goals:
- Calling the external MiniMax API or uploading assets.
- Modifying any existing model dialect.

## Requirements

- FR-001: The system MUST add `minimax-h3` to `ModelTargetSchema` with video medium capability.
- FR-002: The system MUST render `minimax-h3` prompts using the 3 core sections: `integrated_multimodal_description:`, `overall_soundscape:`, and `non_diegetic_music:`.
- FR-003: In single-shot video mode, the system MUST format `integrated_multimodal_description` starting with `[Shot 1]` and including visual, optical, spatial, action, and camera motion.
- FR-004: In Director mode (`motion.directorShots`), the system MUST format sequential shots with timestamps (`[Shot 2] At 00:MM.SSS, the camera cuts to ...`), inheriting global scene settings and respecting duration hints.
- FR-005: The system MUST populate `overall_soundscape` from `actionChoreography.audioFoley` and physical audio, and `non_diegetic_music` (defaulting to `N/A` if no background music is specified).
- FR-006: The system MUST expose `minimax-h3` across CLI, MCP `compile_prompt`, and discovery schemas.
- FR-007: All tests MUST pass in `bun test` and typecheck MUST pass.

## Success criteria

- SC-001: `compilePrompt({ target: 'minimax-h3', subject: 'cyberpunk detective' })` produces valid 3-part MiniMax H3 format.
- SC-002: Director mode produces formatted timestamped cuts conforming to H3 specifications.
- SC-003: `bun test` passes with 0 failures and 0 typecheck errors.

## Design

1. **Schema & Capabilities**: Update `ir.ts` with `'minimax-h3'` in `ModelTargetSchema`. Add to `VIDEO_TARGETS` in `scene.ts`. Add capability entry in `render.ts` with format description.
2. **Dialect Rendering**: In `render.ts`, if `ir.target === 'minimax-h3'`, partition sections into multimodal description, soundscape, and non-diegetic music. In Director mode, format timeline shots with `[Shot N]` and `At 00:SS.000, the camera cuts to...`.
3. **Export and MCP**: Export `compileMinimaxH3` in `compilers.ts` and update `compileVideo` union type.

## Alternatives considered

- Treating MiniMax H3 as generic video prose: Ruled out because MiniMax H3's dual video/audio transformer degrades or produces audio glitches when not given separate soundscape and shot sections.

## Cross-cutting concerns

- Backward compatibility: All existing 10 targets are unchanged.
- Testing: Automated unit and integration tests added to `compiler.test.ts` and `reliability.test.ts`.

## Tickets

- SPC-008-T1: Extend PromptIR schema and target capabilities with minimax-h3
- SPC-008-T2: Implement MiniMax H3 dialect compiler with multimodal and Director multi-shot formatting
- SPC-008-T3: Add comprehensive tests and update CLI/MCP discovery and docs

## Validation

- `bun test` passes all tests.
- `bun run typecheck` passes with 0 errors.
- `tenx validate` passes with 0 errors.

## Open questions

- None.
