import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const output = new URL('../.build/', import.meta.url);
mkdirSync(output, { recursive: true });
const base = new URL('../../../docs/labs/event-loop/', import.meta.url);
const assets = Object.fromEntries(['inline/index.html', 'inline/run.js', 'inline/editor.bundle.js', 'inline/editor.LICENSE.txt', 'runner-worker.js'].map(path => [path, readFileSync(new URL(path, base), 'utf8')]));
writeFileSync(new URL('assets.ts', output), 'export const assets: Record<string, string> = ' + JSON.stringify(assets) + ';\n');
