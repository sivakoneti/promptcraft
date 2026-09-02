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
### 1. 16 Curated Catalog Dimensions
- **Shots & Angles** (24): `bird-s-eye-view`, `close-up`, `cutaway-shot`, `dutch-angle`, `entire-body`, `establishing-shot`, `extreme-close-up`, `worm-s-eye-view`...
- **Cameras** (49): `arri-alexa-65`, `red-v-raptor-8k`, `imax-70mm`, `hasselblad-500c`, `leica-m6`, `sony-fx9`...
- **Lenses** (12): `anamorphic-cinema-lens`, `helios-44-2-swirly-bokeh`, `catadioptric-mirror-lens`, `fisheye-lens`...
- **Focal Lengths** (9): `8mm-fisheye`, `14mm-ultra-wide`, `24mm-wide-angle`, `35mm-wide`, `50mm-standard`, `85mm-portrait`...
- **Film Stocks** (30): `kodak-vision3-500t`, `kodak-portra-400`, `cinestill-800t`, `fujifilm-eterna`, `agfa-vista`...
- **Lighting & Mood** (29): `backlighting-rim-lighting`, `blue-hour`, `chiaroscuro-lighting`, `golden-hour`, `neon-lit`...
- **Movie Aesthetics** (110): `blade-runner-2049`, `the-matrix`, `dune`, `alien`, `2001-a-space-odyssey`, `interstellar`...
- **Photographer Styles** (99): `annie-leibovitz`, `gregory-crewdson`, `alec-soth`, `sebastiao-salgado`...
- **Anime & Show Styles** (97): `cyberpunk`, `battle-shonen-anime`, `demon-slayer`, `evangelion`, `studio-ghibli`, `spider-verse`...

### 2. Video Camera Movements (50 Cinematic Movements Across 7 Categories)
Verbatim keyword insertions & full prompting recipes at precise character offsets:
- **Pan / Tilt**: `Static shot`, `Pan right/left`, `Whip pan right/left`, `Tilt up/down`
- **Zoom / Lens**: `Slow zoom in/out`, `Fast zoom in/out`, `Crash zoom in/out`, `Dolly zoom` (Vertigo), `Pull focus` (Rack focus)
- **Physical Moves**: `Truck right/left`, `Pedestal up/down`, `Slider right/left`, `Push past / pass-by`, `Arc right/left`, `Orbit clockwise/counterclockwise`
- **Dolly & Tracking**: `Dolly in/out`, `Tracking shot`, `Follow shot` (OTS), `Reverse tracking` (walk-and-talk), `Side tracking`, `Low tracking`, `Vehicle tracking`, `Chase shot`
- **Human Camera**: `Handheld shot` (natural shake), `Body-mounted camera / Snorricam` (torso locked)
- **Drone / Crane**: `Crane up/down`, `Drone push in`, `Drone pull back`, `Helicopter shot`
- **VFX Specials**: `First-person view` (FPV), `Tilt-shift` (miniature), `Infinite zoom`, `Earth zoom out`, `Pass-through objects` (portal/keyhole), `Time-lapse`, `Shot Switch`, `Slow Motion`

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
