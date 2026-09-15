---
id: EPC-004
type: epic
title: Reliable prompt assembly across modes and targets
status: complete
created: 2026-09-13
updated: 2026-09-13
---

## Objective
Give users reliable image, animation, edit, and video prompts that preserve selected presets, spatial composition, and temporal intent across every supported interface and target.

## Key results
- All supplied scene fields are rendered, returned as parameters, or diagnosed explicitly.
- Director shots inherit shared settings and emitted duration equals the emitted shot sum.
- Every catalog and mode has automated intent-preservation coverage; CLI, MCP and standalone builds agree.

## Scope
Shared scene resolution, all current modes/targets, Director/timelines, spatial and physics controls, references, diagnostics, interfaces, docs and regression tests.

## Non-goals
Cloud generation submission or guaranteed aesthetic quality from external models.

## Milestones
- M1: shared schemas and catalog resolution.
- M2: complete mode/target rendering and coherent timelines.
- M3: public interface parity and requirement-level verification.
