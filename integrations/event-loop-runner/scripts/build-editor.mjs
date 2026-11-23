import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const result = await build({
  entryPoints: ['editor/index.ts'], bundle: true, minify: true, target: 'es2020',
  legalComments: 'eof', metafile: true,
  outfile: '../../docs/labs/event-loop/inline/editor.bundle.js'
});
const packages = new Set();
for (const input of Object.keys(result.metafile.inputs)) {
  const match = input.replaceAll('\\', '/').match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/);
  if (match) packages.add(match[1]);
}
const notices = [...packages].sort().map(name => {
  const license = readFileSync(resolve('node_modules', name, 'LICENSE'), 'utf8').replace(/\r\n/g, '\n').trim();
  return name + '\n' + '='.repeat(name.length) + '\n' + license;
}).join('\n\n');
writeFileSync('../../docs/labs/event-loop/inline/editor.LICENSE.txt', notices + '\n');
