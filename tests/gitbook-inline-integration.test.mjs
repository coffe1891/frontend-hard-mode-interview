import { test } from "node:test";
import { runInNewContext } from "node:vm";
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

test("embedded runner announces readiness and sends nested resize dimensions without a resize loop", () => {
  const messages = [];
  const listeners = {};
  const elements = Object.fromEntries(["editor", "run", "reset", "output", "status"].map(id => ["#" + id, {
    value: "default", addEventListener() {}, textContent: ""
  }]));
  const document = {
    querySelector: id => elements[id],
    documentElement: { clientWidth: 343 },
    body: { getBoundingClientRect: () => ({ height: 555 }) }
  };
  const window = {
    parent: { postMessage: message => messages.push(message) },
    location: { search: "?code=console.log(42)" },
    addEventListener: (event, handler) => { listeners[event] = handler; }
  };
  runInNewContext(runner, { window, document, URLSearchParams, clearTimeout,
    ResizeObserver: class { constructor(callback) { this.callback = callback; } observe() { this.callback(); } }
  });
  assert.equal(elements["#editor"].value, "console.log(42)");
  assert.equal(messages[0].action.action, "@webframe.ready");
  const resize = messages[1].action;
  assert.equal(resize.action, "@webframe.resize");
  assert.equal(resize.size.height, 555);
  assert.equal(resize.size.aspectRatio, 343 / 555);
  assert.equal(messages.length, 2);
  listeners.resize();
  assert.equal(messages.length, 2, "unchanged dimensions must not trigger a resize loop");
  document.documentElement.clientWidth = 375;
  listeners.resize();
  assert.equal(messages[2].action.size.aspectRatio, 375 / 555);
});
