---
id: SPC-002
type: spec
title: Cinematic Camera Movements Catalog Integration
status: complete
epic: EPC-001
tags:
  - movements
  - kinematics
  - video
priority: P1
created: 2026-09-02
updated: 2026-09-02
tickets:
  - id: SPC-002-T1
    title: "[FR-001][FR-002] Author cinematic movements library with full recipes and aliases"
    status: done
  - id: SPC-002-T2
    title: "[FR-001][FR-003] Integrate cinematic movements into video assembler and catalog search"
    status: done
  - id: SPC-002-T3
    title: "[FR-004] Add tests and verify zero regressions in video prompt composition"
    status: done
---

## Summary

Expands the Promptcraft video movement catalog from 26 baseline movements to 50 cinematic camera movements across 7 kinematic categories (Pan/Tilt, Zoom/Lens, Dolly/Track, Physical Moves, Human Camera, Drone/Crane, Specials/VFX) with full prompting recipes (`Movement`, `Speed`, `Framing`, `End`) and robust alias resolution.

## Requirements

- FR-001: The system MUST support 50 distinct cinematic camera movements across 7 categories with exact prompt keywords.
- FR-002: Each movement entry MUST provide structured kinematic descriptors (`Movement`, `Speed`, `Framing`, `End`) and common search aliases.
- FR-003: The CLI catalog search and video assembler MUST resolve movements by label, ID, or alias while maintaining 100% backward compatibility with baseline movement labels.
- FR-004: All changes MUST be accompanied by automated unit and integration tests passing in `bun test`.

## Success criteria

- SC-001: All 64 unit and integration tests pass in `bun test`.
- SC-002: `promptcraft catalog search` successfully finds entries by alias (e.g. `snorricam`, `vertigo`, `fpv`).
- SC-003: `promptcraft video --movement "<name>"` inserts the correct kinematic keywords into video prompts.
- SC-004: `tenx validate` passes with 0 errors and 0 warnings.

## Validation

- FR-001: Given any movement label in `CINEMATIC_CAMERA_MOVEMENTS`, When querying count, Then verify 50 entries across 7 categories.
- FR-002: Given a movement query, When inspecting fields, Then verify `movement`, `speed`, `framing`, and `end` are non-empty.
- FR-003: Given `--movement Snorricam` or `--movement "Pass-through objects"`, When assembling video prompt, Then inject corresponding keyword.
- FR-004: Given `bun test`, Then all 64 tests pass with zero failures.
