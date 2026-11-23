import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const location = resolve(root, "docs/labs/event-loop/inline");
const html = readFileSync(resolve(location, "index.html"), "utf8");
const runner = readFileSync(resolve(location, "run.js"), "utf8");
const worker = readFileSync(resolve(location, "../runner-worker.js"), "utf8");

test("文章内代码块有运行、重置按钮和输出窗口，使用已存在的 Worker", () => {
  for (const id of ["editor", "run", "reset", "output", "status"]) {
    assert.ok(html.includes('id="' + id + '"'), id);
  }
  assert.match(html, /<script defer src="\.\/run\.js"><\/script>/);
  assert.match(runner, /new Worker\("\.\.\/runner-worker\.js"\)/);
  assert.match(runner, /2500/);
  assert.match(worker, /new Function\("console"/);
  assert.match(html, /oembed\.json/);
  assert.equal(JSON.parse(readFileSync(resolve(location, "oembed.json"), "utf8")).type, "rich");
});

test("文章内默认代码实际输出 2、4、3、1（Node.js 事件循环验证）", async () => {
  const match = html.match(/<textarea\b[^>]*id="editor"[^>]*>([\s\S]*?)<\/textarea>/);
  assert.ok(match, "必须能从 HTML 提取默认示例");
  const output = [];
  runInNewContext(match[1], {
    setTimeout,
    console: { log: value => output.push(String(value)) },
    Promise
  }, { timeout: 500 });
  await new Promise(resolve => setTimeout(resolve, 25));
  assert.deepEqual(output, ["2", "4", "3", "1"]);
});

test("小样例脚本可被 Node 语法检查器解析", () => {
  execFileSync(process.execPath, ["--check", resolve(location, "run.js")], {timeout: 5000});
});
