import { describe, test, expect } from 'bun:test';
import { executeAction, handleCatalog, handleCapabilities } from './cli.js';

describe('Promptcraft CLI Engine', () => {
  test('capabilities returns version, action schemas, movements, and catalog summaries', () => {
    const caps = handleCapabilities();
    expect(caps.status).toBe('ok');
    expect(caps.action).toBe('capabilities');
    const data = caps.data as {
      version: string;
      actions: Array<{ name: string }>;
      videoMovementsCount: number;
      videoMovements: Array<{ label: string; promptKeyword: string }>;
      catalogs: Record<string, { count: number }>;
    };
    expect(data.version).toBe('1.0.0');
    expect(data.videoMovementsCount).toBe(50);
    expect(data.videoMovements.length).toBe(50);
    expect(data.actions.map((a) => a.name)).toContain('assemble');
    expect(data.actions.map((a) => a.name)).toContain('assemble_video');
    expect(data.actions.map((a) => a.name)).toContain('director_timeline');
    expect(data.actions.map((a) => a.name)).toContain('resolve_references');
    expect(data.actions.map((a) => a.name)).toContain('sync');
    expect(data.actions.map((a) => a.name)).toContain('catalog');
    expect(data.catalogs.shots.count).toBe(24);
    expect(data.catalogs.lighting.count).toBe(29);
    expect(data.catalogs.cameras.count).toBe(49);
    expect(data.catalogs.movieLooks.count).toBe(110);
  });

  test('catalog categories lists all categories plus movements', () => {
    const res = handleCatalog(['categories'], {});
    expect(res.status).toBe('ok');
    const cats = res.data as string[];
    expect(cats).toContain('shots');
    expect(cats).toContain('lighting');
    expect(cats).toContain('cameras');
    expect(cats).toContain('movements');
  });

  test('catalog list returns items for category', () => {
    const res = handleCatalog(['list', 'shots'], {});
    expect(res.status).toBe('ok');
    const items = res.data as Array<{ id: string }>;
    expect(items.length).toBe(24);
    expect(items.some((i) => i.id === 'bird-s-eye-view')).toBe(true);
  });
  test('catalog search finds matches across extended cinematic movements', () => {
    const res = handleCatalog(['search', 'snorricam'], {});
    expect(res.status).toBe('ok');
    const data = res.data as { count: number; results: Array<{ id: string; category: string }> };
    expect(data.count).toBeGreaterThan(0);
    expect(data.results.some((r) => r.id === 'snorricam')).toBe(true);
  });

  test('executeAction video works with newly added cinematic movements like Snorricam and FPV', () => {
    const snorri = executeAction('assemble_video', {
      videoPrompt: 'panicking protagonist running through subway tunnel',
      movementLabel: 'Snorricam',
    });
    expect(snorri.status).toBe('ok');
    expect(snorri.prompt).toContain('body-mounted Snorricam locked to subject torso');

    const fpv = executeAction('assemble_video', {
      videoPrompt: 'parkour runner leaping between rooftops',
      movementLabel: 'First-person view',
    });
    expect(fpv.status).toBe('ok');
    expect(fpv.prompt).toContain('first-person POV view with hands visible');
  });


  test('catalog search finds matches in catalogs and movements', () => {
    const res = handleCatalog(['search', 'blade runner'], {});
    expect(res.status).toBe('ok');
    const data = res.data as { count: number; results: Array<{ id: string; category: string }> };
    expect(data.count).toBeGreaterThan(0);
    expect(data.results.some((r) => r.id === 'blade-runner-2049')).toBe(true);
  });

  test('executeAction assemble photo produces correct prompt structure', () => {
    const res = executeAction('assemble', {
      mode: 'photo',
      subject: 'a neon cybernetic samurai',
      shotId: 'close-up',
      lightingId: 'blue-hour',
      movieLookId: 'blade-runner-2049',
    });
    expect(res.status).toBe('ok');
    expect(res.prompt).toContain('A photographic image of a Close up shot of');
    expect(res.prompt).toContain('a neon cybernetic samurai');
    expect(res.prompt).toContain('blue-hour ambient lighting');
    expect(res.prompt).toContain('Blade Runner 2049');
    expect(res.prompt).toContain("Don't blur faces randomly.");
    expect(res.prompt).toContain('The image should be in a 16:9 format.');
  });

  test('executeAction anime produces anime-specific wrapped prompt', () => {
    const res = executeAction('anime', {
      subject: 'magical warrior girl with glowing staff',
      animeGenreId: 'cyberpunk',
      animeShowStyleId: 'dan-da-boom',
    });
    expect(res.status).toBe('ok');
    expect(res.prompt).toContain('magical warrior girl with glowing staff');
    expect(res.prompt).toContain('The image should be in a 16:9 format.');
  });

  test('executeAction video produces prompt with camera movement', () => {
    const res = executeAction('assemble_video', {
      videoPrompt: 'hypercar accelerating down highway',
      movementLabel: 'Orbit',
      environment: 'rainy Tokyo neon reflection',
    });
    expect(res.status).toBe('ok');
    expect(res.prompt).toContain('hypercar accelerating down highway orbit 360 rotation around subject');
    expect(res.prompt).toContain('rainy Tokyo neon reflection');
  });

  test('executeAction director_timeline builds Kling multi-shot payload and prompt', () => {
    const res = executeAction('director_timeline', {
      shots: [
        { note: 'Hero enters foggy room', durationHint: '4' },
        { note: 'Villain turns around menacingly', durationHint: '6' },
      ],
    });
    expect(res.status).toBe('ok');
    const data = res.data as {
      shots: Array<{ index: number; prompt: string; duration: string }>;
      totalDuration: number;
      clampedDuration: number;
      timelinePrompt: string;
    };
    expect(data.shots.length).toBe(2);
    expect(data.shots[0].prompt).toBe('Hero enters foggy room');
    expect(data.shots[0].duration).toBe('4');
    expect(data.shots[1].prompt).toBe('Villain turns around menacingly');
    expect(data.shots[1].duration).toBe('6');
    expect(data.totalDuration).toBe(10);
    expect(data.clampedDuration).toBe(10);
    expect(data.timelinePrompt).toBe('Shot 1: Hero enters foggy room (4s) Shot 2: Villain turns around menacingly (6s)');
  });

  test('executeAction resolve_references assigns numbers and applies priority pruning', () => {
    const res = executeAction('resolve_references', {
      slots: [
        { type: 'face', characterIndex: 0, image: 'img_face' },
        { type: 'scene', characterIndex: null, image: 'img_scene' },
        { type: 'outfit', characterIndex: 0, image: 'img_outfit' },
      ],
      options: { maxReferenceImages: 2 },
    });
    expect(res.status).toBe('ok');
    const data = res.data as {
      active: Array<{ category: string; number: number }>;
      overflow: Array<{ category: string }>;
      instruction: { display: string };
    };
    expect(data.active.length).toBe(2);
    expect(data.overflow.length).toBe(1);
    expect(data.instruction.display).toContain('image_1 as Character1 face reference');
    expect(data.instruction.display).toContain('image_2 as scene style reference');
  });

  test('executeAction sync replaces fragments in place', () => {
    const prev = 'A photographic image of a subject. The scene is illuminated by studio lighting. The image should be in a 16:9 format.';
    const next = 'A photographic image of a subject. The scene is illuminated by dramatic neon. The image should be in a 16:9 format.';
    const res = executeAction('sync', { prevText: prev, nextText: next });
    expect(res.status).toBe('ok');
    expect(res.prompt).toBe(next);
  });
});
