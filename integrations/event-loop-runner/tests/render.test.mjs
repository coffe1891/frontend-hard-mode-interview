import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const manifest = yaml.load(readFileSync(new URL('gitbook-manifest.yaml', root), 'utf8'));
const result = await build({
  entryPoints: [fileURLToPath(new URL('src/index.tsx', root))],
  bundle: true, write: false, format: 'esm', platform: 'neutral',
  jsx: 'automatic', jsxImportSource: '@gitbook/runtime', define: { MODE: '"production"' }
});
const { eventLoopRunner, serveRunnerAsset } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
async function render(props, expanded = true) {
  const response = await eventLoopRunner.render({ componentId: manifest.blocks[0].id, props, state: { expanded }, context: {} }, { environment: { integration: { urls: { publicContentEndpoint: 'https://example.gitbook.io/integration' } } } });
  assert.equal(response.status, 200);
  const output = await response.json();
  assert.equal(output.element.type, 'block');
  const first = output.element.children[0];
  if (!expanded) return { output, codeblock: first };
  assert.equal(first.type, 'webframe');
  return { output, frame: first, url: new URL(first.source.url) };
}

test('many inline examples use native code blocks until a reader explicitly opens an editor', async () => {
  const { output, codeblock } = await render({ content: 'console.log(42);' }, false);
  assert.equal(codeblock.type, 'codeblock');
  assert.equal(codeblock.content, 'console.log(42);');
  assert.equal(output.element.children[1].type, 'button');
  assert.equal(output.element.children[1].onPress.action, 'open-runner');
  const open = await render({ content: 'console.log(42);' }, true);
  assert.equal(open.frame.type, 'webframe');
  assert.equal(open.output.element.children[1].onPress.action, 'close-runner');
});

test('lazy button actions are declared in the compiled ContentKit component', async () => {
  const source = readFileSync(new URL('src/index.tsx', root), 'utf8');
  assert.match(source, /initialState: \{ expanded: false \}/);
  assert.match(source, /action: 'open-runner'/);
  assert.match(source, /action: 'close-runner'/);
  assert.match(source, /expanded: true/);
  assert.match(source, /expanded: false/);
});

test('Git Sync manifest maps the original question exactly once while supporting other runnable blocks', async () => {
  assert.deepEqual(manifest.blocks[0].markdown, { codeblock: 'js-run', body: 'content' });
  assert.equal(manifest.visibility, 'private');
  assert.deepEqual(manifest.scopes, []);
  assert.equal(manifest.organization, '-LnmMrXLnmjAIoQY6UW2');
  const chapter = readFileSync(new URL('../../1/1.2.8.md', root), 'utf8').replace(/\r\n/g, '\n');
  const blocks = [...chapter.matchAll(/```js-run\n([\s\S]*?)```/g)];
  const originalBlocks = blocks.filter(match => match[1].includes('执行顺序问题'));
  assert.equal(originalBlocks.length, 1, '原面试题不能出现重复内容');
  const questionBlocks = [...chapter.matchAll(/```[^\n]*\n([\s\S]*?)```/g)]
    .filter(match => match[1].includes('console.log(4)'));
  assert.equal(questionBlocks.length, 1);
  assert.match(originalBlocks[0][1], /执行顺序问题/);
  assert.match(originalBlocks[0][1], /resolve, reject/);
  const { url } = await render({ content: originalBlocks[0][1] });
  assert.equal(url.searchParams.get('code'), originalBlocks[0][1]);
});

test('runtime serializes multiline Unicode and special characters without HTML interpretation', async () => {
  const content = 'console.log("中文 & # ? + </script>");\nconsole.log(42);';
  const { frame, url } = await render({ content });
  assert.equal(url.href.split('?')[0], 'https://example.gitbook.io/integration/inline/');
  assert.equal(url.searchParams.get('code'), content);
  assert.ok(frame.aspectRatio > 0 && frame.aspectRatio <= 0.6);
});

test('an inserted component has the same 2,4,3,1 default question', async () => {
  const { url } = await render({});
  const lines = [];
  new Function('console', 'setTimeout', url.searchParams.get('code'))({ log: n => lines.push(n) }, setTimeout);
  await new Promise(resolve => setTimeout(resolve, 25));
  assert.deepEqual(lines, [2, 4, 3, 1]);
});

test('published integration serves the same runner assets without waiting for master/Pages', async () => {
  for (const [path, type] of [['inline/', 'text/html'], ['inline/run.js', 'text/javascript'], ['runner-worker.js', 'text/javascript']]) {
    const response = serveRunnerAsset(new Request('https://example.gitbook.io/integration/' + path));
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('Content-Type').startsWith(type));
    assert.ok((await response.text()).length > 100);
  }
  assert.equal(serveRunnerAsset(new Request('https://example.gitbook.io/integration/private')).status, 404);
});
