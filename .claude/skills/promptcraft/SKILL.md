---
name: promptcraft
description: Use when building, generating, optimizing, or editing AI prompts for text-to-image (Midjourney, Flux, Stable Diffusion) or video generation (Kling, Veo, Sora, Gen-3), especially when selecting camera optics, lighting, anime/styles, camera movements, multi-character consistency, or multi-shot director timelines.
---

# Promptcraft Skill

Deterministic, zero-hallucination prompt synthesis engine and CLI (`./bin/promptcraft`) for generative image and video models.

---

## Decision Flowchart: Selecting Mode & Strategy

```
                          User Request / Generation Task
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
  Image Generation              Image Modification             Video Generation
        │                              │                              │
  Is it anime/manga?             User supplied image?         Single or Multi-Shot?
  ┌─────┴─────┐                        │                        ┌─────┴─────┐
  ▼           ▼                        ▼                        ▼           ▼
[photo]    [anime]                  [edit]                   [video]    [director]
Mode       Mode                     Mode                     Mode       Timeline
```

---

## 1. Mode Selection Matrix

| Mode | When to Use | Key Flags / Fields | Target Models |
|---|---|---|---|
| **`photo`** | Realistic portraits, cinematic film stills, landscapes, architecture | `--subject`, `--shot`, `--lighting`, `--camera`, `--lens`, `--film`, `--movie-look`, `--photographer`, `--aspect` | Flux, Midjourney, SDXL, Imagen 3 |
| **`anime`** | 2D/3D anime, manga, western animation, stylized comics | `--subject`, `--anime-genre`, `--anime-show`, `--western-style`, `--lighting`, `--aspect` | Niji, Midjourney, NovelAI, SDXL Anime |
| **`edit`** | Modifying an existing image (in-painting, outfit swap, background change) | `--action` / `--subjectAction`, `references` (with global ref), `--lighting`, `--aspect` | Midjourney Inpaint, Flux Kontext, SD Inpaint |
| **`video`** | Single continuous video clip with camera motion and autofill | `--video-prompt`, `--movement`, `--env`, `--mood`, `references` | Kling 1.5/2.0, Veo 2, Sora, Gen-3, Luma |
| **`director`** | Multi-shot sequential scene cuts with per-shot durations | `shots: [{ note, durationHint }]` | Kling Director Mode, Veo multi-shot |

---

## 2. Handling User-Supplied Images & Multi-Character References

When a user provides reference images (characters, scenes, outfits, global visual anchors), follow this exact reference binding protocol:

### Reference Hierarchy (Category Priority)
1. `global (1)`: Source image / overall visual style anchor.
2. `face (2)`: Character facial identity.
3. `scene (3)`: Environment / background plate.
4. `outfit (4)`: Costume / clothing reference.
5. `object (5)`: Handheld prop or key vehicle/asset.
6. `anonymous (6)`: Generic unclassified reference image.

### Reference Slot Syntax
```bash
echo '{
  "action": "resolve_references",
  "slots": [
    { "type": "face", "characterIndex": 0, "image": "protagonist_face.png" },
    { "type": "outfit", "characterIndex": 0, "image": "cyber_jacket.png" },
    { "type": "face", "characterIndex": 1, "image": "antagonist_face.png" },
    { "type": "scene", "characterIndex": null, "image": "tokyo_alley.png" },
    { "type": "global", "characterIndex": null, "image": "master_palette.png" }
  ],
  "options": {
    "order": "generate",
    "maxReferenceImages": 4
  }
}' | ./bin/promptcraft
```
**Synthesized Output Sentence:**
```text
Create a new image by combining the provided elements: image_1 as Character1 face reference; image_2 as Character2 face reference; image_3 as scene style reference; image_4 as global visual reference. Keep character appearances consistent with the references.
```

---

## 3. Video Prompting Protocols

### Single Clip: Continuous Motion Beats
Use temporal transition words (`Initially -> then -> finally`) + a catalog camera movement:
```bash
./bin/promptcraft video \
  --video-prompt "Initially the cyber-samurai stands motionless in rain, then swiftly unsheathes a glowing katana, and finishes by slicing an incoming drone in slow motion" \
  --movement "Slow Motion" \
  --env "rainy neo-Tokyo alley" \
  --mood "high adrenaline" \
  --raw
```

### Multi-Shot: Kling-Compliant Director Timeline
For discrete scene transitions with timed shots (enforces 3–15s total clamp, $\le$ 6 shots, $\le$ 512 chars/shot):
```bash
echo '{
  "action": "director_timeline",
  "shots": [
    { "note": "Low angle tracking shot of android sprinting through neon alley", "durationHint": "4" },
    { "note": "Close up on optical sensors locking onto target", "durationHint": "3" },
    { "note": "Drone pull-back revealing surrounding security perimeter", "durationHint": "5" }
  ]
}' | ./bin/promptcraft
```

---

## 4. Preset Catalog Discovery (Zero-Hallucination)

Never fabricate camera, lens, or style names. Always discover or verify IDs from the catalog:

```bash
# 1. Discover capabilities & catalog summary counts
./bin/promptcraft capabilities

# 2. Search presets across 500+ items
./bin/promptcraft catalog search "blade runner"
./bin/promptcraft catalog search "anamorphic"
./bin/promptcraft catalog search "demon slayer"

# 3. List items in specific category
./bin/promptcraft catalog list cameras
./bin/promptcraft catalog list lighting
./bin/promptcraft catalog list movements
```

---

## 5. Live Fragment Synchronization (`sync`)

When refining a prompt based on user feedback (e.g. changing lighting from studio to neon), never re-prompt from scratch:
```bash
./bin/promptcraft sync \
  --prev "A photographic image of a warrior. The scene is illuminated by studio lighting. The image should be in a 16:9 format." \
  --next "A photographic image of a warrior. The scene is illuminated by dramatic neon backlight. The image should be in a 16:9 format." \
  --raw
```

---

## 6. CLI Quick Reference

```bash
# Flag-based Photo Mode
./bin/promptcraft photo --subject "<text>" --shot close-up --lighting neon-lit --movie-look blade-runner-2049 --aspect 21:9 --raw

# Flag-based Anime Mode
./bin/promptcraft anime --subject "<text>" --anime-genre cyberpunk --anime-show evangelion --aspect 16:9 --raw

# Flag-based Video Mode
./bin/promptcraft video --video-prompt "<text>" --movement "Orbit" --env "<text>" --raw

# JSON IPC over stdin (Recommended for subagents)
echo '{"action":"assemble","mode":"photo","subject":"astronaut on Mars","shotId":"wide-shot"}' | ./bin/promptcraft
```
