---
id: SPC-001
type: spec
title: Promptcraft CLI Engine and Agent Interface
status: complete
epic: EPC-001
tags:
  - cli
  - bun
  - agents
priority: P0
created: 2026-09-01
updated: 2026-09-01
tickets:
  - id: SPC-001-T1
    title: "[FR-005][FR-006] Initialize tenx harness and agent hooks"
    status: done
  - id: SPC-001-T2
    title: "[FR-001][FR-002][FR-003][FR-004][FR-005] Implement unified CLI engine with action dispatcher"
    status: done
  - id: SPC-001-T3
    title: "[FR-005][FR-006] Embed catalog data for standalone Bun compilation"
    status: done
  - id: SPC-001-T4
    title: "[FR-001][FR-002][FR-003][FR-004][FR-005][FR-006] Add CLI automated test suite"
    status: done
---

## Summary

Provides a deterministic promptcraft engine and native binary CLI for AI agents to discover cinematic presets, compose multi-mode prompts, generate multi-shot timelines, resolve image references, and synchronize text modifications.

## Requirements

- FR-001: The system MUST support prompt assembly across photo, anime, edit, and video modes.
- FR-002: The system MUST provide multi-shot director timeline compilation with duration clamping (3-15s) and prompt character slicing (512 chars).
- FR-003: The system MUST resolve and prune reference image slots by category priority order.
- FR-004: The system MUST support live prompt fragment re-synchronization.
- FR-005: The system MUST provide machine-readable catalog search, listing, and self-documenting capabilities for AI agents.
- FR-006: The CLI MUST compile into a standalone zero-dependency executable with Bun.

## Success criteria

- SC-001: All 62 unit and integration tests in `bun test` pass cleanly.
- SC-002: Compiled binary `bin/promptcraft` executes all commands and JSON stdin/stdout requests without runtime errors.
- SC-003: `tenx validate` passes with 0 errors and 0 warnings.

## Validation

- FR-001: Given prompt flags or state JSON, When running `promptcraft assemble/photo/anime/edit/video`, Then output prompt matching exact format and rules.
- FR-002: Given director shot notes and durations, When running `promptcraft director`, Then output clamped and formatted timeline prompt.
- FR-003: Given reference slot inputs, When running `promptcraft references`, Then output prioritized and numbered instruction sentence.
- FR-004: Given old and new prompt texts, When running `promptcraft sync`, Then update fragments in place.
- FR-005: Given `promptcraft capabilities` or `promptcraft catalog`, Then return structured JSON catalog metadata and action definitions.
- FR-006: Given `bun run build:cli`, Then produce standalone native binary `./bin/promptcraft` executable on target system.
