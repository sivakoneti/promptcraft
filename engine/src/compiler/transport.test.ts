import { describe, test, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cli = fileURLToPath(new URL('../cli.ts', import.meta.url));
const run = (args: string[], input = '') => spawnSync('bun', [cli, ...args], { input, encoding: 'utf8' });
describe('SPC-007 FR-007: actual CLI and MCP transports', () => {
  test('video flags preserve shared presets, focal length and genre', () => {
    const r = run(['video', '--subject', 'fox', '--camera', 'arri-alexa-65', '--focal-length', '85mm-portrait', '--lighting', 'neon-lighting', '--no-text']);
    expect(r.status).toBe(0); const data = JSON.parse(r.stdout);
    for (const value of ['ARRI ALEXA 65', '85mm Portrait', 'Neon Lighting', 'no subtitles']) expect(data.prompt).toContain(value);
  });
  test('compile command respects scene action instead of dispatching it as a command', () => {
    const r = run(['compile'], JSON.stringify({ target: 'sora', subject: 'fox', action: 'leaps over a log' }));
    expect(r.status).toBe(0); const data = JSON.parse(r.stdout);
    expect(data.data.target).toBe('sora'); expect(data.prompt).toContain('leaps over a log');
  });
  test('compile flags construct IR and invalid flags produce errors', () => {
    const r = run(['compile', '--target', 'kling', '--subject', 'fox', '--movement', 'Orbit']);
    expect(r.status).toBe(0); expect(JSON.parse(r.stdout).data.target).toBe('kling');
    const bad = run(['video', '--mode', 'oops', '--camera', 'arri-alexa-65']);
    // The explicit video command selects video; invalid compile targets must still reject.
    const invalid = run(['compile', '--target', 'typo', '--subject', 'fox']);
    expect(invalid.status).not.toBe(0); expect(JSON.parse(invalid.stdout).status).toBe('error');
  });
  test('raw output retains warnings on stderr', () => {
    const r = run(['photo', '--subject', 'fox', '--camera', 'sony', '--raw']);
    expect(r.status).toBe(0); expect(r.stdout).toContain('fox'); expect(r.stderr).toContain('AMBIGUOUS_PRESET');
  });
  test('MCP survives malformed JSON, honors notification silence, and returns tool errors', () => {
    const input = ['{"id": broken',
      JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
      JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
      JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'compile_prompt', arguments: { subject: 'fox', spatial: { typo: 'oops' } } } }),
      JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'compile_prompt', arguments: { subject: 'fox', target: 'sora' } } }),
    ].join('\n') + '\n';
    const r = run(['mcp'], input); expect(r.status).toBe(0);
    const messages = r.stdout.trim().split('\n').map(line => JSON.parse(line));
    expect(messages).toHaveLength(4); expect(messages[0].error.code).toBe(-32700);
    expect(messages[1].result.tools.some((t: { name: string }) => t.name === 'assemble_prompt')).toBe(true);
    expect(messages[2].result.isError).toBe(true);
    expect(JSON.parse(messages[3].result.content[0].text).target).toBe('sora');
  });
});

test('CLI validates unknown options, missing values and explicit boolean false', () => {
  for (const args of [['photo', '--camra', 'x'], ['video', '--camera']]) {
    const r = run(args); expect(r.status).not.toBe(0); expect(JSON.parse(r.stdout).status).toBe('error');
  }
  const r = run(['photo', '--subject', 'fox', '--no-text', 'false']);
  expect(r.status).toBe(0); expect(JSON.parse(r.stdout).prompt).not.toContain('no subtitles');
});

test('Director CLI reports per-shot validation failures', () => {
  const r = run(['director'], JSON.stringify({ shots: [{ note: 'fox', overrides: { optics: { lens: 'fisheye-lens', focalLength: '200mm-super-telephoto' } } }] }));
  expect(r.status).not.toBe(0); expect(JSON.parse(r.stdout).status).toBe('error');
});
