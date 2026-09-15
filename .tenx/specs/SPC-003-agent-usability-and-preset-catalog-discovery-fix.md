---
id: SPC-003
type: spec
title: Agent Usability and Preset Catalog Discovery Fixes
status: complete
epic: EPC-001
tags:
  - cli
  - agents
  - catalog
  - skills
priority: P0
created: 2026-09-03
updated: 2026-09-03
tickets:
  - id: SPC-003-T1
    title: "[FR-001] Complete assembleAnime in engine/src/assemble.ts to format anime styles"
    status: done
  - id: SPC-003-T2
    title: "[FR-002][FR-003] Add catalog JSON IPC action and enhance catalog search to index pre/post in cli.ts"
    status: done
  - id: SPC-003-T3
    title: "[FR-004] Update automated tests and recompile binary"
    status: done
  - id: SPC-003-T4
    title: "[FR-005] Update SKILL.md in repo and global agent skills directories"
    status: done
---

## Summary

Fixes agent usability issues preventing AI agents in other projects from reliably invoking promptcraft. Completes anime mode prompt assembly with catalog styling, enables JSON IPC `catalog` action, indexes `pre`/`post` metadata in catalog search, and updates `SKILL.md` to reference the global `promptcraft` command and valid catalog identifiers.

## Context and scope

AI agents running in external project repositories failed when using promptcraft due to relative `./bin/promptcraft` execution paths, hallucinated style IDs in documentation, incomplete anime assembly logic that always generated `"A photographic image of"`, and an inability to search presets by franchise or stylistic description (`pre`/`post` texts).

## Goals / non-goals

Goals:
- Enable agents anywhere to inspect all catalogs (movie looks, cameras, lighting, anime, etc.) via CLI flags and JSON IPC stdin.
- Index preset descriptive fields (`pre`, `post`, aliases) in `catalog search`.
- Assemble complete anime prompts using `pre` and `post` wrapping fragments.
- Update `SKILL.md` across repository and user agent skill stores (`~/.claude/skills` and `~/.agents/skills`).

Non-goals:
- Adding external network dependencies or web APIs.
- Altering photo mode deterministic fragment ordering.

## Requirements

- FR-001: The system MUST assemble anime prompts using selected preset `pre` (as prefix) and `post` (as stylistic suffix) fragments instead of `"A photographic image of"`.
- FR-002: The system MUST support the `catalog` action in structured JSON IPC over stdin/executeAction.
- FR-003: The system MUST search across `pre` and `post` attributes in catalog presets during `catalog search`.
- FR-004: All test suites MUST pass cleanly and the standalone Bun executable MUST be updated.
- FR-005: The `promptcraft` skill guide MUST use the PATH-accessible `promptcraft` command and verified catalog preset IDs.

## Success criteria

- SC-001: `echo '{"action":"catalog","category":"movieLooks"}' | promptcraft` returns the movie looks catalog.
- SC-002: `promptcraft catalog search "evangelion"` finds `neon-revelation` by matching its `pre`/`post` content.
- SC-003: `promptcraft anime --subject "warrior" --anime-show neon-revelation` produces anime-styled prompt with `pre` and `post` fragments.
- SC-004: `bun test` passes 100% and `bun run build:cli` succeeds.
- SC-005: `tenx validate` passes with 0 errors.

## Design

1. In `engine/src/assemble.ts`, retrieve the matched anime/western preset (`animeShowStyles`, `animeGenres`, or `westernAnimationStyles`). If a style is selected, assemble:
   `${style.pre} An animation style image of ${shotClause}${subject}${envSuffix}. ${lightingMood} ${style.post} ${aspectRatio} ${noText}`
   If no style is selected, retain the fallback behavior with `An animation style image of`.
2. In `engine/src/cli.ts`:
   - Route `case 'catalog':` in `executeAction()` to `handleCatalog()`.
   - In `handleCatalog`'s `search` branch, also inspect `item.pre` and `item.post` when present on presets.
3. Update `SKILL.md` files: replace `./bin/promptcraft` with `promptcraft`, correct catalog example IDs, and document catalog inspection via CLI and JSON IPC.

## Alternatives considered

- Retain relative `./bin/promptcraft` path: Ruled out because subagents in external projects run from their project root, causing immediate command not found errors.

## Cross-cutting concerns

- Backward compatibility: Existing `photo`, `edit`, and `video` modes remain byte-identical.
- Zero dependencies: No runtime libraries added.

## Tickets

- SPC-003-T1: Complete assembleAnime in engine/src/assemble.ts to format anime styles
- SPC-003-T2: Add catalog JSON IPC action and enhance catalog search to index pre/post in cli.ts
- SPC-003-T3: Update automated tests and recompile binary
- SPC-003-T4: Update SKILL.md in repo and global agent skills directories

## Validation

- FR-001: Given anime state with `animeShowStyleId: "neon-revelation"`, When running `promptcraft anime`, Then output contains Evangelion anime style prompt fragments.
- FR-002: Given JSON payload `{"action":"catalog","category":"cameras"}`, When passed via stdin, Then returns camera catalog.
- FR-003: Given query "evangelion", When searching catalog, Then returns "neon-revelation".
- FR-004: Given `bun test`, Then all tests pass.
- FR-005: Given `~/.claude/skills/promptcraft/SKILL.md` and `~/.agents/skills/promptcraft/SKILL.md`, Then both match updated repository version.