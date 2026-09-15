---
id: SPC-004
type: spec
title: Prompt Intermediate Representation and Target Compilers
status: complete
epic: EPC-002
tags:
  - compiler
  - ir
  - midjourney
  - flux
  - kling
  - veo
  - linter
priority: P0
created: 2026-09-03
updated: 2026-09-03
tickets:
  - id: SPC-004-T1
    title: "[FR-001] Define PromptIR schema and optical/lighting validation rules"
    status: done
  - id: SPC-004-T2
    title: "[FR-002] Implement target compilers for Midjourney, Flux, Kling, and Veo"
    status: done
  - id: SPC-004-T3
    title: "[FR-003] Implement Prompt Linter and Token Budget Analyzer"
    status: done
  - id: SPC-004-T4
    title: "[FR-004] Wire target compilation and linting into CLI and write unit tests"
    status: done
---

## Summary

Introduces a structured Prompt Intermediate Representation (IR) and specialized target compilers for frontier generative models (Midjourney v6, Flux.1, Kling 2.0, and Google Veo 2), accompanied by a prompt linter that catches optical conflicts and token budget overflows.

## Context and scope

Frontier generative models have drastically different text encoder architectures (e.g. CLIP vs T5-XXL) and prompting syntax requirements. A single generic string cannot achieve optimal results across all models.

## Goals / non-goals

Goals:
- Define a strongly typed PromptIR capturing scene semantics, optics, lighting, style, and temporal beats.
- Compile PromptIR to model-specific syntax (e.g. Midjourney flags `--ar 16:9 --style raw`, Flux natural descriptive narrative, Kling time tags).
- Provide a diagnostic linter reporting token budgets and optical contradictions (e.g. fisheye + telephoto).

Non-goals:
- Direct cloud API submission to Midjourney/Flux (compiles prompt text only).

## Requirements

- FR-001: The system MUST define a typed `PromptIR` schema validated with Zod.
- FR-002: The system MUST support target compilers for `midjourney`, `flux`, `kling`, `veo`, and `generic`.
- FR-003: The system MUST analyze token budget and emit warnings on optical or stylistic contradictions.
- FR-004: All compilers and linter rules MUST be fully covered by automated tests.

## Success criteria

- SC-001: Compiling with `target: "midjourney"` produces valid Midjourney flags (`--ar`, `--style raw`, `--no text`).
- SC-002: Compiling with `target: "flux"` produces dense, natural scene description without booru tags.
- SC-003: Compiling with `target: "kling"` or `target: "veo"` formats temporal actions and movement recipes.
- SC-004: Linter detects and warns on optical conflicts (e.g. `8mm-fisheye` paired with `200mm-super-telephoto`).

## Design

Create `engine/src/compiler/`:
1. `ir.ts`: Type definitions and Zod schema for `PromptIR`.
2. `targets/midjourney.ts`: Emits parameters and Midjourney-optimized phrasing.
3. `targets/flux.ts`: Emits natural continuous prose optimized for T5-XXL.
4. `targets/video.ts`: Emits Kling and Veo optimized motion commands.
5. `linter.ts`: Checks optical rules and token limits.
6. `compile.ts`: Master compile function taking `PromptIR` and options.

## Alternatives considered

- Single string format with post-hoc regex patching: Fragile and fails to restructure sentences for T5-XXL vs CLIP.

## Cross-cutting concerns

- Zero external runtime dependencies.
- Full backwards compatibility with existing `assemble` command.

## Tickets

- SPC-004-T1: Define PromptIR schema and optical/lighting validation rules
- SPC-004-T2: Implement target compilers for Midjourney, Flux, Kling, and Veo
- SPC-004-T3: Implement Prompt Linter and Token Budget Analyzer
- SPC-004-T4: Wire target compilation and linting into CLI and write unit tests

## Validation

- FR-001: Given valid PromptIR JSON, When parsed with Zod schema, Then succeeds.
- FR-002: Given PromptIR targeting Midjourney, Then output ends with `--ar ... --style raw`.
- FR-003: Given conflicting lenses in PromptIR, Then linter returns diagnostics.
- FR-004: `bun test` passes 100%.
