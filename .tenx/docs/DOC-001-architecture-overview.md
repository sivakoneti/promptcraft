---
id: DOC-001
type: doc
title: Architecture overview
status: complete
created: 2026-09-01
updated: 2026-09-13
---

## Purpose

Deterministic TypeScript prompt compilation for image, animation, edit and video workflows. The reliability implementation is tracked by SPC-007 / EPC-004.

## Architecture

- `compiler/ir.ts`: strict runtime scene schemas, typed Director overrides, references and configurable timeline options.
- `compiler/adapter.ts`: validated legacy state normalization and conversion to PromptIR. All four assembly modes use this adapter.
- `compiler/catalog.ts`: category-aware preset resolution with explicit ambiguous/unknown diagnostics. `library-data.ts` validates and embeds the catalog.
- `compiler/scene.ts`: shared resolved semantic sections for subject, framing, lighting, optics, style, spatial staging, motion, physics, continuity, audio and references.
- `compiler/timeline.ts`: the single timeline normalizer. Drops empty/overflow shots with diagnostics, scales durations coherently, preserves long notes, and exposes source indices and timing boundaries.
- `compiler/render.ts`: target dialects and Director inheritance. It emits text and portable parameters, not provider API requests.
- `compiler/linter.ts`: semantic checks on effective shot settings and advisory size checks on the fully emitted text.
- `compiler/compilers.ts`: validated compilation with automatic diagnostics and typed target convenience wrappers.
- `assemble.ts`, `video.ts`, `fragments.ts`: compatibility APIs sharing the same scene pipeline. Detailed assembly exposes metadata; string APIs throw on error diagnostics.
- `compiler/discovery.ts`: JSON Schema generated from runtime Zod schemas; CLI and MCP share discovery.
- `compiler/capabilities.ts`: mode and field support contract. Unsupported fields produce explicit diagnostics.
- `references.ts`: deterministic category-priority pruning with retained overflow and mode-specific reference numbering.
- `sync.ts`: replaces the generated block for every mode; callers manage surrounding manual text.
- `cli.ts`, `mcp/server.ts`: public JSON/flag and MCP transports with structured error reporting.

## Contracts

There are 15 preset categories plus camera movement catalogs. Independent controls do not require a camera selection. Anime/western/illustration styling is preserved across targets. Continuous action beats do not imply cuts. Director shots inherit nested scene fields, and arrays in overrides replace inherited arrays.

Default timeline policy is six nonempty shots, 3–15 seconds total and an advisory 512-character shot budget. Durations are scaled proportionally when necessary and agree with emitted timestamps to microsecond precision. Long prompts remain intact. These defaults are configurable engine policy, not current provider limits.

See README.md for supported fields, target dialects, examples and intentional migration changes.

## Verification

`bun test`, `bun run typecheck`, `bun run build:cli`, `bun run build:bundle`, and standalone CLI/MCP smoke checks. The test suite includes every catalog preset in every assembly mode, field/target matrices, timeline inheritance and boundaries, deterministic behavior, and actual CLI/MCP processes.
