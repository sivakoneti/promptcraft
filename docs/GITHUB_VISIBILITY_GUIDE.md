# Promptcraft: GitHub On-Page Optimization & AI Agent Guide

This guide focuses purely on **GitHub-native organic discoverability**, SEO, and making Promptcraft the premier tool for **autonomous AI coding and prompt agents**—with zero social media, manual posting, or external marketing required.

---

## 1. GitHub Repository Configuration (On-Page SEO)

GitHub's internal search algorithm indexes repository titles, descriptions, README content, and repository topics. Set these directly in your GitHub repository settings:

### Repository Description (About Section)
```text
Deterministic AI prompt compiler & cinematic engine for Midjourney, Flux, Kling, Runway Gen-4, Veo 3.1, Sora, Wan 2.1. Built-in optical linter, 50+ camera moves, and native Model Context Protocol (MCP) server for Claude & Cursor.
```

### Repository Topics / Tags
Add these exact topics in GitHub settings (under the gear icon next to "About"):
- `prompt-compiler`
- `model-context-protocol`
- `mcp-server`
- `generative-ai`
- `ai-video`
- `text-to-video`
- `text-to-image`
- `midjourney`
- `flux`
- `kling-ai`
- `runway-gen4`
- `veo`
- `sora`
- `wan2-1`
- `cinematography`
- `typescript`

---

## 2. Why AI Agents Use Promptcraft Over Raw LLMs

When LLMs (Claude, GPT-4, Cursor, Codex) generate prompts for image or video generation from scratch, they face recurring failure modes:
1. **Target Dialect Hallucination**: LLMs mix syntax—putting Midjourney flags (`--ar 16:9`) into Flux or Kling, or failing to construct Runway's semantic bracket channels (`[Camera: ...] [Motion: ...]`).
2. **Optical Contradictions**: LLMs frequently output contradictory physics, like pairing an extreme fisheye lens with a 200mm telephoto focal length, or commanding impossible camera pans in 4 directions simultaneously.
3. **Video Physics & Incoherence**: Standard text prompts lack physical mass, momentum, causal action chains, and spatial plane separation (foreground / midground / background), resulting in video morphing and distortion.
4. **Token Budget Bleed**: Unchecked generation exceeds generation model token limits without warning.

**Promptcraft provides AI agents with a deterministic compiler and linter:**
- **Zero Hallucination**: Strict Zod schemas and runtime validation prevent unsupported flags or invalid options.
- **Pre-Flight Optical Linter**: Detects physical optical contradictions before cloud generation credits are spent.
- **Self-Correction Loop**: When an agent passes an invalid combination, Promptcraft returns structured JSON error diagnostics (`code`, `severity`, `field`, `message`) allowing the agent to immediately correct its own payload.

---

## 3. Native Agent Integration Surfaces

### Surface A: Native Model Context Protocol (MCP)
Agents running in Claude Desktop, Cursor, Windsurf, or pi can connect directly via MCP. In `claude_desktop_config.json` or Cursor Settings:

```json
{
  "mcpServers": {
    "promptcraft": {
      "command": "/path/to/promptcraft/bin/promptcraft",
      "args": ["mcp"]
    }
  }
}
```

Exposed MCP Tools:
- `compile_prompt`: Compiles structured scene IR into dialect-pure prompt text and parameters.
- `lint_prompt`: Pre-flight check returning diagnostics and token estimations.
- `search_catalog`: Fast hybrid BM25 + trigram search across 566 presets and 50 camera motions.
- `capabilities`: Dynamic schema introspection so agents know all valid fields at runtime.

### Surface B: Agent Stdio / CLI JSON IPC
For terminal-based agents (e.g. Aider, pi, OpenHands, custom agent loops), Promptcraft accepts structured JSON over standard input and emits structured JSON:

```bash
echo '{
  "action": "compile",
  "target": "kling",
  "subject": "courier running through neon alley",
  "motion": { "movement": "tracking-shot", "speed": "fast" },
  "spatial": { "foreground": "rain puddles", "midground": "courier", "background": "neon signs" }
}' | ./bin/promptcraft
```

Output:
```json
{
  "positivePrompt": "courier running through neon alley, tracking shot following subject movement at high speed, Rain puddles in immediate foreground. Courier positioned in main midground action. Neon signs visible in background.",
  "valid": true,
  "diagnostics": [],
  "warnings": [],
  "target": "kling"
}
```

---

## 4. GitHub Star & Adoption Flywheel (Product-Led)

Because Promptcraft provides standalone single-binary performance, instant test feedback, and native MCP support:
1. **GitHub Discovery via MCP**: Users searching GitHub for `mcp-server` or `model-context-protocol` find Promptcraft as a ready-to-run zero-dependency tool.
2. **Issue Templates & CI**: Clean `.github/` workflows and structured issue templates make it turnkey for contributors to propose new model targets (e.g. LTX-Video, HunyuanVideo).
3. **No Setup Friction**: The standalone binary (`./bin/promptcraft`) requires no Node or Bun runtime on Linux x86_64, giving instant utility to anyone cloning the repository.
