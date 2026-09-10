---
id: SPC-006
type: spec
title: Frontier Video Prompt Compilers and Kinematic Physics
status: complete
epic: EPC-003
priority: P1
created: 2026-09-10
updated: 2026-09-10
tickets:
  - id: SPC-006-T1
    title: "[FR-001][FR-002][FR-003] Extend PromptIR schema with physics, spatial blocking, kinematics, and action"
    status: done
  - id: SPC-006-T2
    title: "[FR-004] Wire existing preset catalogs and implement target compilers for Kling, Runway, Wan, Sora, and Veo"
    status: done
  - id: SPC-006-T3
    title: "[FR-005] Implement video kinematic & physics linter rules in linter.ts"
    status: done
  - id: SPC-006-T4
    title: "[FR-006] Update MCP server, CLI, and tests for frontier video prompt generation"
    status: done
---

# SPC-006 — Frontier Video Prompt Compilers and Kinematic Physics

## Summary
Add frontier video prompt compilation capabilities including physics mechanics, 3-plane spatial parallax blocking, camera rig kinematics, 3-beat action timelines, and target-specific dialects for Kling 3.0, Runway Gen-4/Gen-3, Wan 2.1, Sora 2, and Google Veo 3.1.

## Functional Requirements
- **FR-001 (Physics & Dynamics IR)**: `PromptIR` must support `physics` (forces, massAndInertia, causalChain, materialProperties, invariance).
- **FR-002 (3D Spatial Staging IR)**: `PromptIR` must support `spatial` (foreground, midground, background, rackFocus, trajectory).
- **FR-003 (Kinematics & Action IR)**: `PromptIR` must support `kinematics` (rig, primaryVector, secondaryDrift, shutterAngle, speedRamp) and `action` (anticipation, execution, settle, audioFoley).
- **FR-004 (Dialect Compilers)**:
  - `compileRunway`: Formats into `CAMERA`, `SUBJECT`, `SCENE`, `PHYSICS` prefix channels.
  - `compileKling`: Formats into Director multi-shot timelines with bracketed durations, camera movement recipes, and `AUDIO:` Foley lines.
  - `compileWan` & `compileSora`: Formats into unified causal prose with 3-plane depth parallax and negative physics invariants.
  - `compileVeo`: Formats into technical optical and environmental blocks.
  - All video compilers must leverage existing presets (`cameras`, `lenses`, `lighting`, `movieLooks`, `cinematic-movements`).
- **FR-005 (Video Linter Diagnostics)**: Optical linter must flag `MULTI_AXIS_CONFLICT` (≥3 conflicting camera moves) and `MISSING_INERTIA` on rapid action.
- **FR-006 (MCP & CLI Integration)**: Native MCP tool `compile_prompt` and CLI command `compile` accept and output full video dimensions.

## Tickets
- **SPC-006-T1**: [FR-001][FR-002][FR-003] Extend PromptIR schema with physics, spatial blocking, kinematics, and action.
- **SPC-006-T2**: [FR-004] Wire existing preset catalogs and implement target compilers for Kling, Runway, Wan, Sora, and Veo.
- **SPC-006-T3**: [FR-005] Implement video kinematic & physics linter rules in `linter.ts`.
- **SPC-006-T4**: [FR-006] Update MCP server, CLI, and comprehensive test suite for frontier video prompt generation.

## Validation
- Automated tests in `engine/src/compiler/compiler.test.ts` covering schema validation, dialect compilation, and linter diagnostics.
- `bun test` passing cleanly.
- `tenx validate` reporting zero errors.
