---
id: CON-001
type: convention
title: General project conventions
status: complete
created: 2026-09-01
updated: 2026-09-01
---

## Scope

Codebase architecture, testing standards, CLI contracts, and AI agent integration conventions for `promptcraft`.

## Core Conventions

1. **Pure TypeScript Engine**: Core prompt generators in `engine/src/` must remain pure functions without browser DOM dependencies or global side-effects.
2. **Deterministic Output**: Given identical state inputs, prompt generation must produce byte-exact repeatable strings.
3. **Agent First IPC**: The CLI must support structured JSON in/out via stdin and stdout as first-class citizens alongside terminal flags.
4. **Standalone Portability**: Standalone binaries built via Bun must embed preset catalogs so no external filesystem dependencies are required at runtime.
5. **Testing**: All actions and features must have automated tests run with `bun test`.
