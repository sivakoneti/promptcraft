import { SCENE_CAPABILITIES } from '../compiler/capabilities.js';
import { promptIRJsonSchema, promptStateJsonSchema } from '../compiler/discovery.js';
import { normalizeState } from '../compiler/adapter.js';
import { assembleDetailed } from '../assemble.js';
import { TARGET_CAPABILITIES } from '../compiler/render.js';
import { createInterface } from 'node:readline';
import type { PresetLibrary } from '../state.js';
import { PromptIRSchema } from '../compiler/ir.js';
import { compilePrompt } from '../compiler/compilers.js';
import { lintPromptIR } from '../compiler/linter.js';
import { HybridSearchEngine } from '../search/hybrid.js';
export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export const MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'compile_prompt',
    description: 'Compile high-level scene semantics, optics, physics, and spatial blocking into target prompt dialects with automatic validation.',
    inputSchema: promptIRJsonSchema,
  },
  {
    name: 'assemble_prompt',
    description: 'Assemble photo, anime, edit or video state with full preset, spatial and Director support. Returns diagnostics and normalized timeline.',
    inputSchema: promptStateJsonSchema,
  },
  {
    name: 'capabilities',
    description: 'Describe target dialects and complete runtime schemas.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'lint_prompt',
    description: 'Analyze prompt IR for optical contradictions, lens mismatches, and configured advisory text budgets.',
    inputSchema: {
      type: 'object',
      properties: {
        promptIR: promptIRJsonSchema,
      },
      required: ['promptIR'],
    },
  },
  {
    name: 'search_catalog',
    description: 'Hybrid semantic BM25 + n-gram search across 560+ cinematic presets and camera movements.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Natural language search query' },
        category: { type: 'string', description: 'Optional category filter' },
        limit: { type: 'number', description: 'Max results to return' },
      },
      required: ['query'],
    },
  },
];

export class McpStdioServer {
  private library: PresetLibrary;
  private searchEngine: HybridSearchEngine;

  constructor(library: PresetLibrary) {
    this.library = library;
    this.searchEngine = new HybridSearchEngine(library);
  }

  public handleCall(toolName: string, args: Record<string, unknown>): unknown {
    switch (toolName) {
      case 'assemble_prompt': return assembleDetailed(normalizeState(args), this.library);
      case 'capabilities': return { targets: TARGET_CAPABILITIES, sceneCapabilities: SCENE_CAPABILITIES, promptIR: promptIRJsonSchema, state: promptStateJsonSchema };
      case 'compile_prompt': {
        const ir = PromptIRSchema.parse(args);
        return compilePrompt(ir, this.library);
      }
      case 'lint_prompt': {
        const ir = PromptIRSchema.parse(args.promptIR || args);
        return lintPromptIR(ir, this.library);
      }
      case 'search_catalog': {
        const query = String(args.query || '');
        const category = args.category as string | undefined;
        const limit = typeof args.limit === 'number' ? args.limit : 15;
        return this.searchEngine.search(query, { category, limit });
      }
      default:
        throw new Error(`Unknown MCP tool: ${toolName}`);
    }
  }

  public async start(): Promise<void> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    for await (const line of rl) {
      if (!line.trim()) continue;
      let id: string | number | null = null;
      let parsed = false;
      try {
        const request = JSON.parse(line);
        parsed = true;
        if (!request || typeof request !== 'object' || Array.isArray(request) || request.jsonrpc !== '2.0' || typeof request.method !== 'string') {
          process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid JSON-RPC request' } }) + '\n');
          continue;
        }
        if (request.id === undefined) continue; // Notifications never receive a response.
        if (typeof request.id !== 'string' && typeof request.id !== 'number') throw new Error('Request id must be a string or number');
        id = request.id;
        const { method, params } = request;
        let result: unknown;
        if (method === 'initialize') {
          result = { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'promptcraft-mcp', version: '2.0.0' } };
        } else if (method === 'ping') result = {};
        else if (method === 'tools/list') result = { tools: MCP_TOOLS };
        else if (method === 'tools/call') {
          try {
            const value = this.handleCall(params?.name, params?.arguments || {});
            const invalid = !!value && typeof value === 'object' && 'valid' in value && value.valid === false;
            result = { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }], isError: invalid };
          } catch (err) {
            result = { content: [{ type: 'text', text: err instanceof Error ? err.message : String(err) }], isError: true };
          }
        } else {
          process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } }) + '\n');
          continue;
        }
        process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
      } catch (err) {
        process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code: parsed ? -32600 : -32700, message: err instanceof Error ? err.message : String(err) } }) + '\n');
      }
    }
  }
}
