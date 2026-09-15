/** Run after both builds. Check packaged entrypoints and embedded catalogs outside the repo. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../../', import.meta.url));
const commands = [
  ['standalone', [resolve(root, 'bin/promptcraft')]],
  ['node bundle', [process.execPath, resolve(root, 'dist/cli.js')]],
];
function run(command, args, input) {
  const result = spawnSync(command[0], [...command.slice(1), ...args], {
    cwd: tmpdir(), input: input === undefined ? '' : JSON.stringify(input) + '\n', encoding: 'utf8', timeout: 10000,
  });
  assert.equal(result.status, 0, `${command.join(' ')} ${args.join(' ')}: ${result.error || ''}\n${result.stdout}\n${result.stderr}`);
  return JSON.parse(result.stdout);
}
for (const [label, command] of commands) {
  for (const mode of ['photo', 'anime', 'edit', 'video']) {
    const r = run(command, [mode, '--subject', 'fox', '--camera', 'arri-alexa-65', '--no-text']);
    assert.match(r.prompt, /ARRI ALEXA 65/);
    assert.match(r.prompt, /no subtitles/);
  }
  for (const target of ['midjourney', 'flux', 'sdxl', 'imagen-3', 'kling', 'veo', 'sora', 'runway', 'wan', 'generic']) {
    const r = run(command, ['compile'], { target, subject: 'fox', action: 'looks toward the camera' });
    assert.equal(r.data.target, target);
    assert.match(r.prompt, /looks toward the camera/);
  }
  const ir = { target: 'kling', subject: 'courier', spatial: { foreground: 'reeds' }, motion: { directorShots: Array.from({ length: 7 }, (_, i) => ({ note: `action ${i}`, duration: 5 })) } };
  const r = run(command, ['compile'], ir);
  assert.equal(r.data.parameters.duration, 15);
  assert.equal(r.data.timeline.shots.length, 6);
  assert.equal(r.data.timeline.shots.reduce((n, s) => n + s.duration, 0), 15);
  assert.equal(r.data.timeline.droppedShots.length, 1);
  assert.match(r.data.timeline.shots[0].prompt, /reeds/);
  const request = { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'compile_prompt', arguments: ir } };
  const mcp = run(command, ['mcp'], request);
  assert.equal(mcp.result.isError, false);
  assert.deepEqual(JSON.parse(mcp.result.content[0].text), r.data);
  console.log(`${label}: all modes, targets, Director timing and MCP passed outside the repository`);
}
