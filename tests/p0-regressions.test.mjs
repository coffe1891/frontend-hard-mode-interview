// P0 技术勘误的可执行回归测试。直接从书中提取代码，防止以后改回老错误。
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext, createContext, runInContext } from "node:vm";
import { performance } from "node:perf_hooks";

function block(file, marker) {
  const source = readFileSync(file, "utf8");
  const blocks = [...source.matchAll(/```javascript\s*\n([\s\S]*?)\n```/g)].map(m => m[1]);
  const result = blocks.find(code => code.includes(marker));
  assert.ok(result, `${file}: 找不到代码块标识 ${marker}`);
  return result;
}

function sandbox(logs) {
  return {
    console: { log: (...args) => logs.push(args) },
    setTimeout,
    performance,
    structuredClone,
  };
}

test("AUD-001: Object.assign 是浅拷贝，structuredClone 可保留循环引用", () => {
  const logs1 = [];
  runInNewContext(block("1/1.3.1.md", "Object.assign({}, a)"), sandbox(logs1), { timeout: 3000 });
  assert.deepEqual(logs1.map(row => row[0]), ["张三", "上海", true]);

  const logs2 = [];
  runInNewContext(block("1/1.3.1.md", "const b = structuredClone(a);"), sandbox(logs2), { timeout: 3000 });
  assert.deepEqual(logs2.map(row => row[0]), ["长沙", true, false]);
});

test("AUD-002: 主线程同步忙循环先于 setTimeout 回调", async () => {
  const logs = [];
  runInNewContext(block("1/1.2.8.md", "performance.now() - start < 150"), sandbox(logs), { timeout: 3000 });
  await new Promise(resolve => setTimeout(resolve, 50));
  assert.deepEqual(logs.map(row => row[0]), ["1：开始", "2：同步代码结束", "3：定时器回调"]);
});

test("AUD-003: forEach 的 thisArg 对普通函数生效，但不改变箭头函数 this", () => {
  const first = [];
  runInNewContext(block("1/1.2.9.md", "this 由 thisArg 指定为 b"), sandbox(first), { timeout: 3000 });
  assert.deepEqual(first.map(row => row[0]), ["1891", "1891", "1891"]);

  const second = [];
  runInNewContext(block("1/1.2.9.md", "demo.call({ a: \"coffe\" })"), sandbox(second), { timeout: 3000 });
  assert.deepEqual(second.map(row => row[0]), ["coffe", "coffe", "coffe"]);
});

test("AUD-004: Promise executor 同步执行，then 回调稍后执行", async () => {
  const logs = [];
  runInNewContext(block("1/1.2.13.md", 'console.log("1：executor 同步执行")'), sandbox(logs), { timeout: 3000 });
  await new Promise(resolve => setTimeout(resolve, 50));
  assert.deepEqual(logs.map(row => row[0]), [
    "1：executor 同步执行",
    "2：后面的同步代码",
    "3：then 回调在微任务中执行",
  ]);
});

test("AUD-006: 可实例化父类被重写仍可满足 LSP，违约时应报错", () => {
  const logs = [];
  const context = createContext(sandbox(logs));
  runInContext(block("6/6.1.4.md", "class Shape"), context, { timeout: 3000 });
  assert.equal(logs[0][0], 6);
  assert.throws(() => runInContext(block("6/6.1.4.md", "class BrokenShape"), context, { timeout: 3000 }), /图形面积必须是有限的非负数/);
});

test("AUD-007: 匿名递归示例不抛 ReferenceError，且输出1、2、3", () => {
  const logs = [];
  const source = readFileSync("code/1.2.1-4.js", "utf8");
  runInNewContext(source, sandbox(logs), { timeout: 3000 });
  assert.deepEqual(logs.slice(0, 3).map(row => row[0]), [
    "匿名函数，第1次调用",
    "匿名函数，第2次调用",
    "匿名函数，第3次调用",
  ]);
  assert.deepEqual(logs.slice(3, 6).map(row => row[0]), [
    "具名函数，第1次调用",
    "具名函数，第2次调用",
    "具名函数，第3次调用",
  ]);
});
