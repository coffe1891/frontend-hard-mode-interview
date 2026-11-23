// 《前端内参》 Event Loop 教学模型：只模拟下面四道内置题。
// 这不是浏览器引擎的调试接口；任意编辑后的代码请用独立 Worker 实际运行。
// 为保证可讲解性，内置示例都假设单一任务源、setTimeout(fn, 0) 已在下一轮可执行。
const log = value => ({ type: "log", value });
const micro = (name, ops) => ({ type: "micro", name, ops });
const timer = (name, ops) => ({ type: "timer", name, ops });

export const lessons = Object.freeze([
  {
    id: "basic",
    tag: "01 · 入门",
    title: "0 毫秒定时器，为什么最后才执行？",
    intro: "先别急着按运行。给自己 30 秒，猜出四行日志的顺序。",
    hint: "同步代码先执行；当前任务结束后清空微任务；最后才轮到定时器任务。",
    code: [
      'console.log("A");',
      'setTimeout(() => console.log("D"), 0);',
      'Promise.resolve().then(() => console.log("C"));',
      'console.log("B");'
    ].join("\n"),
    ops: [log("A"), timer("setTimeout D", [log("D")]), micro("Promise.then C", [log("C")]), log("B")],
    expected: ["A", "B", "C", "D"]
  },
  {
    id: "nested",
    tag: "02 · 进阶",
    title: "微任务里面又加了一个微任务，会怎样？",
    intro: "这题开始有意思了。微任务队列不是执行一次就不管了。",
    hint: "执行微任务期间追加的新微任务，仍然会在下一个计时器任务之前完成。",
    code: [
      'console.log("1");',
      'setTimeout(() => console.log("5"), 0);',
      'queueMicrotask(() => {',
      '  console.log("3");',
      '  queueMicrotask(() => console.log("4"));',
      '});',
      'console.log("2");'
    ].join("\n"),
    ops: [
      log("1"),
      timer("setTimeout 5", [log("5")]),
      micro("queueMicrotask 3", [log("3"), micro("queueMicrotask 4", [log("4")])]),
      log("2")
    ],
    expected: ["1", "2", "3", "4", "5"]
  },
  {
    id: "original",
    tag: "03 · 书中原题",
    title: "原版面试题：Promise 的执行器是同步还是异步？",
    intro: "这是正文里的题，试着自己写出 2、4、3、1 的原因。",
    hint: "new Promise 的 executor 立即执行，then 回调是微任务。",
    code: [
      'setTimeout(function() {',
      '  console.log(1);',
      '}, 0);',
      'new Promise(function(resolve) {',
      '  console.log(2);',
      '  resolve(3);',
      '}).then(function(val) {',
      '  console.log(val);',
      '});',
      'console.log(4);'
    ].join("\n"),
    ops: [timer("setTimeout 1", [log("1")]), log("2"), micro("Promise.then 3", [log("3")]), log("4")],
    expected: ["2", "4", "3", "1"]
  },
  {
    id: "challenge",
    tag: "04 · 面试挑战",
    title: "定时器里又塞进 Promise，微任务会去哪里？",
    intro: "真实面试很爱考这种套娃。先预测，再一步一步拆解。",
    hint: "先清空脚本里的微任务；定时器回调开始后产生的新微任务，要在下一个任务前执行。",
    code: [
      'console.log("start");',
      'setTimeout(() => {',
      '  console.log("timer");',
      '  Promise.resolve().then(() => console.log("timer micro"));',
      '}, 0);',
      'Promise.resolve().then(() => {',
      '  console.log("micro A");',
      '  queueMicrotask(() => console.log("micro B"));',
      '});',
      'console.log("end");'
    ].join("\n"),
    ops: [
      log("start"),
      timer("setTimeout", [log("timer"), micro("Promise.then timer micro", [log("timer micro")])]),
      micro("Promise.then micro A", [log("micro A"), micro("queueMicrotask micro B", [log("micro B")])]),
      log("end")
    ],
    expected: ["start", "end", "micro A", "micro B", "timer", "timer micro"]
  }
]);

function snapshot(state, explanation, category) {
  state.frames.push({
    explanation, category,
    stack: state.stack.slice(),
    micro: state.micro.map(x => x.name),
    tasks: state.tasks.map(x => x.name),
    output: state.output.slice()
  });
}

export function simulate(lesson) {
  if (!lesson || !Array.isArray(lesson.ops)) throw new TypeError("需要内置实验题");
  const state = { frames: [], stack: ["<script>"], micro: [], tasks: [], output: [] };
  const MAX_STEPS = 300;
  const step = (description, category) => {
    if (state.frames.length >= MAX_STEPS) throw new Error("实验模型步骤超出限制");
    snapshot(state, description, category);
  };
  const execute = (op) => {
    if (op.type === "log") {
      state.stack.push("console.log");
      state.output.push(op.value);
      step("输出 " + JSON.stringify(op.value) + "：同步执行中的 console.log", "log");
      state.stack.pop();
    } else if (op.type === "micro") {
      state.micro.push({ name: op.name, ops: op.ops });
      step("加入微任务：" + op.name + "（当前不会马上执行）", "queue");
    } else if (op.type === "timer") {
      state.tasks.push({ name: op.name, ops: op.ops });
      step("注册定时器：" + op.name + "（模型将它列为下一轮候选任务）", "queue");
    } else throw new Error("未知操作：" + String(op.type));
  };
  const drainMicrotasks = () => {
    while (state.micro.length) {
      const item = state.micro.shift();
      state.stack = ["<microtask> " + item.name];
      step("开始执行微任务：" + item.name, "micro");
      for (const op of item.ops) execute(op);
      state.stack = [];
      step("微任务 " + item.name + " 执行结束；继续检查微任务队列", "micro");
    }
  };
  step("准备执行当前脚本任务。此时调用栈里是 <script>。", "start");
  for (const op of lesson.ops) execute(op);
  state.stack = [];
  step("当前脚本执行完毕，调用栈清空。先检查微任务，暂不执行定时器。", "checkpoint");
  while (state.micro.length || state.tasks.length) {
    drainMicrotasks();
    if (state.tasks.length) {
      const item = state.tasks.shift();
      state.stack = ["<task> " + item.name];
      step("微任务已清空，开始下一个定时器任务：" + item.name, "timer");
      for (const op of item.ops) execute(op);
      state.stack = [];
      step("定时器回调结束，再次检查微任务队列。", "checkpoint");
    }
  }
  state.stack = [];
  step("全部执行结束。浏览器此时可以继续安排后续任务与渲染。", "done");
  return state.frames;
}

export function normalizedLines(value) {
  return String(value).split(/[\n,，]+/).map(x => x.trim()).filter(Boolean);
}

export function checkPrediction(lesson, answer) {
  const actual = normalizedLines(answer);
  const expected = lesson.expected.map(String);
  return { correct: actual.length === expected.length && actual.every((x, i) => x === expected[i]),
    expected, actual };
}
