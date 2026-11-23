import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../docs/labs/event-loop/inline/run.js', import.meta.url), 'utf8');
function setup() {
  let now = 0, timerId = 0, worker;
  const timers = new Map();
  const nodes = Object.fromEntries(['editor', 'run', 'reset', 'output', 'status'].map(id => [id, {
    value: 'console.log(42)', textContent: '', listeners: {},
    addEventListener(name, listener) { this.listeners[name] = listener; }
  }]));
  const window = { location: { search: '' }, addEventListener() {} };
  window.parent = window;
  runInNewContext(source, {
    window, URLSearchParams,
    document: { querySelector: selector => nodes[selector.slice(1)] },
    setTimeout(callback, delay) { const id = ++timerId; timers.set(id, { callback, at: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    Worker: class {
      constructor() { worker = this; this.listeners = {}; this.terminated = false; }
      addEventListener(name, callback) { this.listeners[name] = callback; }
      postMessage() {}
      terminate() { this.terminated = true; }
      emit(data) { this.listeners.message({ data }); }
    }
  });
  function tick(duration) {
    const until = now + duration;
    for (;;) {
      const next = [...timers.entries()].filter(([, t]) => t.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      timers.delete(next[0]); now = next[1].at; next[1].callback();
    }
    now = until;
  }
  nodes.run.listeners.click();
  return { nodes, get worker() { return worker; }, tick };
}

test('slow Worker download is not counted as user-code execution time', () => {
  const app = setup();
  app.tick(5000);
  assert.equal(app.nodes.status.textContent, '正在加载运行环境');
  assert.equal(app.worker.terminated, false);
  app.worker.emit({ type: 'started' });
  app.worker.emit({ type: 'log', text: '42' });
  app.tick(1200);
  app.worker.emit({ type: 'done', failed: false });
  app.tick(10000);
  assert.equal(app.nodes.output.textContent, '42');
  assert.equal(app.nodes.status.textContent, '已执行');
});

test('user code still has a hard execution deadline after Worker starts', () => {
  const app = setup();
  app.worker.emit({ type: 'started' });
  app.tick(2501);
  assert.equal(app.nodes.status.textContent, '执行超时');
  assert.equal(app.worker.terminated, true);
});

test('a Worker that never loads reports a loading timeout and restores the run button', () => {
  const app = setup();
  app.tick(10001);
  assert.equal(app.nodes.status.textContent, '加载超时');
  assert.match(app.nodes.output.textContent, /运行环境加载超时/);
  assert.equal(app.nodes.run.disabled, false);
});
