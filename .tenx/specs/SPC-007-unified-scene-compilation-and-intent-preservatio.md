---
id: SPC-007
type: spec
title: Unified scene compilation and intent preservation
status: complete
epic: EPC-004
priority: P1
created: 2026-09-13
updated: 2026-09-13
tickets:
  - id: SPC-007-T1
    title: "[FR-001][FR-002] Shared schemas, preset resolution and mode normalization"
    status: done
  - id: SPC-007-T2
    title: "[FR-003][FR-004] Video semantics and Director inheritance/timing"
    status: done
  - id: SPC-007-T3
    title: "[FR-005][FR-006] Target renderers, capability accounting and automatic diagnostics"
    status: done
  - id: SPC-007-T4
    title: "[FR-007][FR-008] Interface parity, regression matrix, documentation and build verification"
    status: done
---

## Summary
Replace fragmented prompt assembly with shared normalized scene semantics and explicit accounting for user intent. This implements the September 13 review recommendations for every existing mode and target.

## Requirements
- FR-001: Resolve all 15 preset categories consistently by exact ID, label or unambiguous alias; diagnose unknown/ambiguous selections and preserve free text.
- FR-002: Render photo, anime/western/illustration, edit and video through shared scene normalization without silently dropping applicable optics, styles, references or guards.
- FR-003: Preserve every spatial, physics, kinematics, anchoring, action choreography and timeline field in video; distinguish continuous beats from cuts.
- FR-004: Director shots inherit global scene settings with per-shot overrides; a single normalizer validates durations, filters empty shots, diagnoses limits, and ensures emitted total equals emitted shot sum.
- FR-005: Every target retains its identity and explicit capability metadata; render supplied settings, emit parameters, or report unsupported settings.
- FR-006: Automatically lint compilation after preset expansion; diagnose contradictions, invalid input, dropped/truncated shots and budget risks without claiming unverified provider limits.
- FR-007: CLI commands/JSON, MCP discovery/calls and exports expose the same schema and capabilities, reject invalid payloads, and handle every mode safely.
- FR-008: Tests cover all catalogs, fields, modes, targets, inheritance, timing, diagnostics, determinism and interface parity; docs explain contracts and examples, standalone build works.

## Design
Use strict Zod scene schemas, a catalog resolver, shared semantic rendering and a timeline normalizer. Keep pure functions and embedded catalogs per CON-001. Legacy APIs remain callable but incorrect outputs intentionally change. Explicit unsupported diagnostics are preferable to silently losing intent; no automatic aesthetic preset selection. Target formats are prompt dialects, not verified provider API payloads.

## Validation
Run bun test, bun run typecheck, bun run build:cli, standalone JSON smoke tests, tenx converge SPC-007 and tenx validate (zero errors). Add parameterized field-preservation and every-preset tests plus CLI/MCP parity and timeline boundary cases. Record evidence per requirement before completion.

## Tickets
Tracked in frontmatter using tenx ticket.
