---
id: EPC-003
type: epic
title: Frontier Video Prompting Engine with Physics, Spatial Blocking, and Dialects
status: complete
priority: P1
created: 2026-09-10
updated: 2026-09-10
specs:
  - SPC-006
---

# EPC-003 — Frontier Video Prompting Engine with Physics, Spatial Blocking, and Dialects

## Vision
Transform Promptcraft into a frontier video prompt compiler supporting physical mechanics (mass, inertia, collision, aerodynamics, fluid dynamics), 3D spatial blocking (foreground, midground, background parallax, rack focus), frame 0 grounding & keyframe transitions, 3-beat action choreography, camera kinematics (rig simulations, single-axis dominance, shutter angle, speed ramps), and target-specific dialects for Kling 3.0, Runway Gen-4/Gen-3, Wan 2.1/2.2, Sora 2, and Google Veo 3.1.

## Scope
- Expand `PromptIR` in `engine/src/compiler/ir.ts` with typed schemas for `physics`, `spatial`, `kinematics`, `anchoring`, and `action`.
- Wire existing presets (`cameras`, `lenses`, `lighting`, `movieLooks`, `cinematic-movements`) into video prompt compilation.
- Implement model-specific compilers for Kling (director timeline + native audio), Runway (channel prefixes), Wan/Sora (causal prose with negative physics invariants), and Veo (cinematographic spec).
- Add video linter diagnostics for multi-axis conflicts, missing inertia, and contradictory speed cues.
- Expose new video dimensions over CLI and native MCP tools.
