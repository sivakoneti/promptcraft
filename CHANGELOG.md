# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Add MiniMax H3 (Hailuo 3.0) video target and Director multimodal compiler support (SPC-008)

## [1.2.0] - 2026-09-13

### Added
- Unified prompt assembly across modes (`photo`, `anime`, `edit`, `video`) and targets using a shared normalized scene representation (SPC-007, EPC-004).
- Complete resolution of all 15 preset catalog categories with exact ID, label, and unambiguous alias matching.
- Full video spatial depth (`foreground`, `midground`, `background`, `trajectory`, `rackFocus`), physics, kinematics, anchoring, and 3-beat action timeline preservation across all supported video targets (Kling, Veo, Sora, Runway, Wan, generic).
- Director mode timeline inheritance with per-shot overrides, coherent timeline math (`duration = sum(shots)`), and explicit dropped shot diagnostics.
- Target identity preservation and dialect compiler routing without silent substitutions.
- Automatic post-expansion linting and capability diagnostics.
- Multi-shot reference resolution and tracking (`referenceResolution` and `shotReferences`).
- Strict JSON Schema parity across CLI flags, stdin IPC, and native MCP server tools.
- Build verification test suite (`engine/scripts/verify-builds.mjs`) for standalone executable and Node bundles outside the repository.
- Expanded automated test suite to 364 tests and 12,472 assertions.
- Shipped Frontier Prompt Compiler with model-specific target compilers (Midjourney, Flux, Kling, Veo), PromptIR schema, diagnostic optical linter, BM25 hybrid search, and native Model Context Protocol (MCP) stdio server (EPC-002).
- Added frontier video prompt compilers with physics, spatial 3D blocking, camera kinematics, and target dialects (Kling 3.0, Runway Gen-4, Wan 2.1, Sora 2, Veo 3.1) (SPC-006).
- Enhanced preset discovery with natural language suggest engine, full-text catalog indexing, complete anime mode formatting, and agent skill guide updates (SPC-003).

## [1.1.0] - 2026-09-02

### Added
- Expanded cinematic camera movement catalog from 26 baseline movements to 50 movements across 7 kinematic categories (`engine/library/cinematic-movements.ts`).
- Added kinematic recipes (`Movement`, `Speed`, `Framing`, `End`) and alias resolution for all camera movements.
- Added catalog search and CLI video assembly support for extended movements (e.g. `Snorricam`, `First-person view`, `Pass-through objects`, `Earth zoom out`, `Tilt-shift`).
- Added automated tests in `engine/src/cli.test.ts` bringing total test suite to 64 passing tests.
- Authored Tenx specification `SPC-002: Cinematic Camera Movements Catalog Integration`.

## [1.0.0] - 2026-09-01

### Added
- Initialized tenx harness, conventions (`CON-001`), architecture documentation (`DOC-001`), and multi-agent hooks.
- Implemented comprehensive Promptcraft CLI engine (`engine/src/cli.ts`) supporting `photo`, `anime`, `edit`, `video`, `director`, `references`, `sync`, `catalog`, and `capabilities` actions.
- Embedded 16 preset catalogs (shots, lighting, cameras, lenses, movie looks, film stocks, anime styles) and 26 camera movements directly into standalone Bun builds (`engine/src/library-data.ts`).
- Added Bun build scripts (`bun run build:cli`) compiling standalone binary `./bin/promptcraft`.
- Added automated CLI test suite (`engine/src/cli.test.ts`) with 100% passing tests across 62 test cases.
