import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { lessons, simulate, checkPrediction, normalizedLines } from "../docs/labs/event-loop/engine.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const lab = name => readFileSync(join(here, "../docs/labs/event-loop", name), "utf8");

test("四道 Event Loop 题的教学模型有确定、正确的输出顺序", () => {
  assert.equal(lessons.length, 4);
  for (const lesson of lessons) {
    const frames = simulate(lesson);
    assert.ok(frames.length >= 8, lesson.id);
    assert.deepEqual(frames.at(-1).output, lesson.expected, lesson.id);
    assert.deepEqual(frames.at(-1).stack, []);
    assert.deepEqual(frames.at(-1).micro, []);
    assert.deepEqual(frames.at(-1).tasks, []);
    assert.equal(checkPrediction(lesson, lesson.expected.join("\n")).correct, true);
    assert.equal(checkPrediction(lesson, "错误答案").correct, false);
  }
});

test("真实 Node.js 运行顺序与四道题的教学模型一致（只验证本书特定示例）", async () => {
  for (const lesson of lessons) {
    const output = [];
    runInNewContext(lesson.code, {
      console: { log: (...args) => output.push(args.map(String).join(" ")) },
      setTimeout, queueMicrotask, Promise
    }, { timeout: 600, filename: "lesson-" + lesson.id + ".js" });
    await new Promise(resolve => setTimeout(resolve, 25));
    assert.deepEqual(output, lesson.expected, lesson.id);
  }
});

test("微任务中新增的微任务会先于下一次 timer 任务执行", () => {
  const frames = simulate(lessons.find(x => x.id === "nested"));
  const micro = frames.findIndex(x => x.explanation.includes("开始执行微任务"));
  const timer = frames.findIndex(x => x.explanation.includes("开始下一个定时器任务"));
  assert.ok(micro >= 0 && timer > micro);
  assert.deepEqual(frames.at(-1).output, ["1", "2", "3", "4", "5"]);
});

test("预测支持逗号、中文逗号及换行，但不能错位或少填", () => {
  assert.deepEqual(normalizedLines(" A, B，C\nD "), ["A", "B", "C", "D"]);
  assert.equal(checkPrediction(lessons[0], "A, B, C, D").correct, true);
  assert.equal(checkPrediction(lessons[0], "A, B, D, C").correct, false);
  assert.equal(checkPrediction(lessons[0], "A, B, C").correct, false);
});

test("完整的单页实验室包含预测、单步、修改代码与执行结果面板", () => {
  const html = lab("index.html");
  const app = lab("app.js");
  const worker = lab("runner-worker.js");
  for (const id of ["lesson-tabs", "code-editor", "prediction", "predict-btn",
    "trace-next", "trace-prev", "trace-play", "trace-reset", "run-btn", "run-output",
    "stack-view", "micro-view", "task-view"]) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
  assert.match(app, /new Worker\("\.\/runner-worker\.js"\)/);
  assert.match(worker, /new Function\("console"/);
  assert.match(app, /2500/);
  assert.match(html, /逐步动画按原题生成/);
});
