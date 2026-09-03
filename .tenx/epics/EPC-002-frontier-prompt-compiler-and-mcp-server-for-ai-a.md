---
id: EPC-002
type: epic
title: Frontier Prompt Compiler and MCP Server for AI Agents
status: complete
priority: P0
created: 2026-09-03
updated: 2026-09-03
tags:
  - compiler
  - mcp
  - agents
  - flux
  - midjourney
  - kling
  - veo
---

## Summary

Evolve Promptcraft from a deterministic string-concatenation CLI into a Google/Frontier-grade Prompt Compiler and native Model Context Protocol (MCP) tool server.

## Value proposition

Enables AI agents across any project to:
1. Target specific foundation models (Midjourney, Flux, Kling, Google Veo, SD3) through specialized target compilers compiling from an Intermediate Representation (IR).
2. Execute semantic hybrid search (BM25 + cosine similarity) over all presets without brittle hardcoded dictionaries.
3. Call Promptcraft natively through MCP stdio JSON-RPC without fragile shell quoting and bash forking.
4. Receive diagnostic feedback, token budget analysis, and optical conflict warnings before sending prompts to generation APIs.

- [SPC-004: Prompt Intermediate Representation and Target Compilers](../specs/SPC-004-prompt-intermediate-representation-and-target-co.md)
- [SPC-005: Semantic Search and Native MCP Server](../specs/SPC-005-semantic-search-and-native-mcp-server.md)
