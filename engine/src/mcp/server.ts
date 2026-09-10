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
    description: 'Compile high-level scene semantics, optics, physics, and spatial blocking into model-optimized prompt syntax (Midjourney, Flux, Kling, Runway, Wan, Veo, Sora).',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'string', enum: ['midjourney', 'flux', 'kling', 'veo', 'sora', 'runway', 'wan', 'generic'], description: 'Target model architecture' },
        subject: { type: 'string', description: 'Subject or core entity' },
        action: { type: 'string', description: 'Subject action or dynamic interaction' },
        environment: { type: 'string', description: 'Scene setting or background' },
        optics: {
          type: 'object',
          properties: {
            camera: { type: 'string', description: 'Camera catalog ID or model' },
            lens: { type: 'string', description: 'Lens type' },
            focalLength: { type: 'string', description: 'Focal length (e.g. 35mm, 85mm)' },
            fStop: { type: 'string', description: 'Aperture (e.g. f/1.4)' },
            filmStock: { type: 'string', description: 'Film stock ID' },
            shotType: { type: 'string', description: 'Shot type or angle' },
          },
        },
        lighting: {
          type: 'object',
          properties: {
            setup: { type: 'string', description: 'Lighting key ID' },
            mood: { type: 'string', description: 'Atmospheric mood' },
          },
        },
        style: {
          type: 'object',
          properties: {
            movieLook: { type: 'string', description: 'Movie aesthetic ID' },
            animeShow: { type: 'string', description: 'Anime show style ID' },
          },
        },
        motion: {
          type: 'object',
          properties: {
            movement: { type: 'string', description: 'Camera movement ID or label' },
            speed: { type: 'string', enum: ['slow', 'normal', 'fast', 'freeze'] },
          },
        },
        physics: {
          type: 'object',
          properties: {
            forces: { type: 'array', items: { type: 'string' }, description: 'Physical forces (e.g. 40mph wind, heavy gravity)' },
            massAndInertia: { type: 'string', description: 'Mass and inertia specification' },
            causalChain: { type: 'string', description: 'Cause and effect sequence upon collision or impact' },
            invariance: { type: 'array', items: { type: 'string' }, description: 'Properties that must not warp or morph' },
          },
        },
        spatial: {
          type: 'object',
          properties: {
            foreground: { type: 'string', description: 'Near depth plane elements (high parallax)' },
            midground: { type: 'string', description: 'Action depth plane (focus subject)' },
            background: { type: 'string', description: 'Far depth plane (atmospheric anchor)' },
            rackFocus: { type: 'string', description: 'Dynamic focus pull transition' },
          },
        },
        kinematics: {
          type: 'object',
          properties: {
            rig: { type: 'string', enum: ['steadicam', 'tripod', 'technocrane', 'handheld', 'fpv-drone', 'dolly-track'] },
            primaryVector: { type: 'string', description: 'Primary dominant camera vector' },
            secondaryDrift: { type: 'string', description: 'Subtle secondary camera drift' },
            shutterAngle: { type: 'string', enum: ['180-degree', '90-degree', '360-degree'] },
          },
        },
        actionChoreography: {
          type: 'object',
          properties: {
            anticipation: { type: 'string', description: 'Beat 1 (0-1.2s): Storing energy or preparing motion' },
            execution: { type: 'string', description: 'Beat 2 (1.2-2.8s): Explosive kinetic execution' },
            settle: { type: 'string', description: 'Beat 3 (2.8-5.0s): Recoil, follow-through, or dissipation' },
            audioFoley: { type: 'string', description: 'Native audio Foley sound effects' },
          },
        },
        aspectRatio: { type: 'string', enum: ['16:9', '9:16', '1:1', '4:3', '21:9'], default: '16:9' },
      },
      required: ['subject'],
    },
  },
  {
    name: 'lint_prompt',
    description: 'Analyze prompt IR for optical contradictions, lens mismatches, and target token budget limits.',
    inputSchema: {
      type: 'object',
      properties: {
        promptIR: { type: 'object', description: 'PromptIR payload' },
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
      case 'compile_prompt': {
        const ir = PromptIRSchema.parse(args);
        return compilePrompt(ir, this.library);
      }
      case 'lint_prompt': {
        const ir = PromptIRSchema.parse(args.promptIR || args);
        return lintPromptIR(ir);
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
      try {
        const request = JSON.parse(line);
        const { id, method, params } = request;

        if (method === 'initialize') {
          process.stdout.write(
            JSON.stringify({
              jsonrpc: '2.0',
              id,
              result: {
                protocolVersion: '2024-11-05',
                capabilities: { tools: {} },
                serverInfo: { name: 'promptcraft-mcp', version: '2.0.0' },
              },
            }) + '\n',
          );
        } else if (method === 'tools/list') {
          process.stdout.write(
            JSON.stringify({
              jsonrpc: '2.0',
              id,
              result: { tools: MCP_TOOLS },
            }) + '\n',
          );
        } else if (method === 'tools/call') {
          const toolName = params?.name;
          const toolArgs = params?.arguments || {};
          const result = this.handleCall(toolName, toolArgs);
          process.stdout.write(
            JSON.stringify({
              jsonrpc: '2.0',
              id,
              result: {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
              },
            }) + '\n',
          );
        } else {
          process.stdout.write(
            JSON.stringify({
              jsonrpc: '2.0',
              id,
              error: { code: -32601, message: `Method not found: ${method}` },
            }) + '\n',
          );
        }
      } catch (err: unknown) {
        process.stdout.write(
          JSON.stringify({
            jsonrpc: '2.0',
            id: typeof line === 'string' && line.includes('"id"') ? (JSON.parse(line).id ?? null) : null,
            error: { code: -32603, message: err instanceof Error ? err.message : String(err) },
          }) + '\n',
        );
      }
    }
  }
}
