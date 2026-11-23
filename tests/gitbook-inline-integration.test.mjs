import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = path => readFileSync(join(root, path), "utf8").replace(/\r\n/g, "\n");
const manifest = read("integrations/event-loop-runner/gitbook-manifest.yaml");
const source = read("integrations/event-loop-runner/src/index.tsx");
const chapter = read("1/1.2.8.md");
const runner = read("docs/labs/event-loop/inline/run.js");

test("ContentKit 代码块与 Git Sync Markdown 语法命名一致", () => {
  assert.match(manifest, /- id: eventloop-runner\b/);
  assert.match(manifest, /codeblock: js-run/);
  assert.match(manifest, /body: content/);
  assert.match(source, /componentId: 'eventloop-runner'/);
  assert.match(source, /<webframe/);
  assert.match(source, /source=\{\{ url: url\.toString\(\) \}\}/);
  assert.ok(chapter.includes("\u0060\u0060\u0060js-run\n"), "文章应当仅插入一个 js-run 围栏");
  assert.equal(chapter.split("\u0060\u0060\u0060js-run\n").length - 1, 1);
});

test("ContentKit 传入 Markdown 源码而非始终使用硬编码的原题", () => {
  assert.match(source, /element\.props\.content/);
  assert.match(source, /url\.searchParams\.set\('code', code\)/);
  assert.match(runner, /new URLSearchParams\(window\.location\.search\)\.get\("code"\)/);
  assert.match(runner, /editor\.value = initialCode/);
  assert.match(runner, /const originalCode = editor\.value/);
});

test("集成仅声明必要权限，不公开或存储账户密钥", () => {
  assert.match(manifest, /visibility: private/);
  assert.match(manifest, /scopes: \[\]/);
  assert.doesNotMatch(manifest, /site:script:inject/);
  assert.match(manifest, /organization: -LnmMrXLnmjAIoQY6UW2/);
});
