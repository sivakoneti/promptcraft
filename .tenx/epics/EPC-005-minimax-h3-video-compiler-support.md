---
id: EPC-005
type: epic
title: MiniMax H3 Video Compiler Support
status: complete
priority: P1
created: 2026-09-18
updated: 2026-09-18
evidence: "bun test (397 tests pass), bun run typecheck (passes with 0 errors)"
---

## Objective

Enable AI agents and human creators to compile optimal video and Director mode multi-shot prompts for MiniMax H3 (Hailuo 3.0). MiniMax H3 requires a specialized multimodal prompt structure (`integrated_multimodal_description`, `overall_soundscape`, `non_diegetic_music`, shot markers, and keyframe alignment) that fails when fed standard Veo or Kling prompts.

## Key results

- KR1 — `minimax-h3` target available in `ModelTargetSchema` and compiler registry with 100% typecheck and deterministic outputs.
- KR2 — Emits official MiniMax H3 multimodal prompt structure (`integrated_multimodal_description: [Shot 1] ...`, `overall_soundscape: ...`, `non_diegetic_music: ...`) across single-shot and multi-shot Director mode.
- KR3 — Full suite of unit and integration tests covering single-shot video, Director mode multi-shot inheritance, audio separation, and CLI/MCP parity.

## Scope

- Add `minimax-h3` target to `ir.ts`, `render.ts`, `compilers.ts`, `scene.ts`.
- Implement dialect rendering for MiniMax H3 following the official `VIDEO_PROMPT_WRITING_GUIDE_base_en.md` specification.
- Director mode multi-shot timeline integration for MiniMax H3 (`[Shot 1] ... [Shot 2] At 00:04.000, ...`).
- Soundscape and non-diegetic music generation mapped from audio, foley, and physics fields.
- Expose via CLI, MCP `compile_prompt`, and library exports.

## Non-goals

- Direct execution/calling of the MiniMax HTTP API (Promptcraft compiles prompt strings and portable parameters, not API payloads).
- Deprecating or changing the syntax of existing video targets (`kling`, `runway`, `wan`, `sora`, `veo`).

## Milestones

- [ ] M1 — Implement schema and compiler support for `minimax-h3` video dialect.
- [ ] M2 — Director multi-shot formatting and comprehensive test verification.
