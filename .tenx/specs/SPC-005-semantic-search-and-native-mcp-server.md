---
id: SPC-005
type: spec
title: Semantic Search and Native MCP Server
status: complete
epic: EPC-002
tags:
  - mcp
  - search
  - embeddings
  - agents
priority: P0
created: 2026-09-03
updated: 2026-09-03
tickets:
  - id: SPC-005-T1
    title: "[FR-001] Implement BM25 + trigram semantic search engine"
    status: done
  - id: SPC-005-T2
    title: "[FR-002] Implement native Model Context Protocol (MCP) stdio server"
    status: done
  - id: SPC-005-T3
    title: "[FR-003] Expose compiler, linter, and catalog search as MCP tools with JSON schemas"
    status: done
  - id: SPC-005-T4
    title: "[FR-004] Verify MCP server and semantic search with automated tests"
    status: done
---

## Summary

Provides a zero-dependency hybrid semantic search engine and a native Model Context Protocol (MCP) stdio server so AI agents in Claude, Cursor, Codex, OpenCode, and Pi can invoke Promptcraft tools directly via typed RPC rather than bash subshells.

## Context and scope

Subagents and agents in other projects face high failure rates when invoking CLI commands through bash due to shell escaping, quoting issues, and lack of typed function schemas. Native MCP stdio integration allows zero-friction agent tool calls.

## Goals / non-goals

Goals:
- Native MCP stdio JSON-RPC server adhering to the official Model Context Protocol.
- Expose tools: `compile_prompt`, `lint_prompt`, `search_catalog`, `suggest_recipe`, `resolve_references`.
- Hybrid search combining BM25 keyword scoring with character trigram semantic similarity.

Non-goals:
- Requiring Python or external vector database servers (runs purely in TypeScript/Bun).

## Requirements

- FR-001: The system MUST implement hybrid BM25 + n-gram similarity search across all preset fields.
- FR-002: The system MUST provide an MCP stdio server responding to `initialize`, `tools/list`, and `tools/call`.
- FR-003: The MCP server MUST export strict JSON schemas for all promptcraft tools.
- FR-004: All tools and search functions MUST be tested with automated unit tests.

## Success criteria

- SC-001: `promptcraft mcp` handles JSON-RPC 2.0 requests over stdin/stdout cleanly.
- SC-002: `tools/list` returns typed definitions for `compile_prompt`, `search_catalog`, `suggest_recipe`, and `lint_prompt`.
- SC-003: Subagents can directly discover and invoke tools without shell quoting errors.

## Design

1. `engine/src/search/hybrid.ts`: Pure TS BM25 + Jaccard/Trigram matcher over all 566 presets + 50 movements.
2. `engine/src/mcp/server.ts`: Lightweight, zero-dependency MCP stdio transport handling JSON-RPC 2.0 messages.
3. `engine/src/mcp/tools.ts`: Definitions and handlers for MCP tools with full JSON schemas.
4. CLI command `promptcraft mcp` starts the stdio server.

## Alternatives considered

- Heavy external vector database (Qdrant/Milvus): Ruled out due to dependency and installation burden for local CLI users.

## Cross-cutting concerns

- Zero external runtime dependencies.
- Sub-millisecond latency for MCP requests.

## Tickets

- SPC-005-T1: Implement BM25 + trigram semantic search engine
- SPC-005-T2: Implement native Model Context Protocol (MCP) stdio server
- SPC-005-T3: Expose compiler, linter, and catalog search as MCP tools with JSON schemas
- SPC-005-T4: Verify MCP server and semantic search with automated tests

## Validation

- FR-001: Given complex query "bleak rainy dystopian city", When running hybrid search, Then returns relevant presets with scores.
- FR-002: Given JSON-RPC `tools/list` message on stdin, Then MCP server returns valid tool schemas.
- FR-003: Given `tools/call` for `compile_prompt`, Then returns compiled prompt result.
- FR-004: `bun test` passes 100%.
