import { lessons, simulate, checkPrediction } from "./engine.mjs";

const get = id => document.getElementById(id);
const els = {
  tabs: get("lesson-tabs"), fill: get("progress-fill"), tag: get("lesson-tag"),
  title: get("lesson-title"), intro: get("lesson-intro"), code: get("code-editor"),
  note: get("trace-note"), restore: get("restore-code"),
  prediction: get("prediction"), predict: get("predict-btn"),
  feedback: get("prediction-feedback"), hintBtn: get("hint-btn"), hint: get("hint-text"),
  next: get("trace-next"), prev: get("trace-prev"), play: get("trace-play"),
  reset: get("trace-reset"), index: get("trace-index"), explanation: get("step-explanation"),
  stack: get("stack-view"), micro: get("micro-view"), task: get("task-view"),
  output: get("output-view"), run: get("run-btn"), runStatus: get("run-status"),
  runOutput: get("run-output")
};
let active = 0, frames = [], frameIndex = -1, playTimer = null;
let liveWorker = null, liveTimeout = null, liveLogs = [], hasEdited = false;
let runGeneration = 0;

function stopPlayback() {
  if (playTimer !== null) clearInterval(playTimer);
  playTimer = null;
  els.play.textContent = "▶ 自动播放";
}

function stopWorker() {
  runGeneration++;
  if (liveWorker) liveWorker.terminate();
  if (liveTimeout) clearTimeout(liveTimeout);
  liveWorker = null;
  liveTimeout = null;
  els.run.disabled = false;
}

function setRunStatus(label, state) {
  els.runStatus.textContent = label;
  els.runStatus.className = "status" + (state ? " " + state : "");
}

function showQueue(element, values) {
  element.replaceChildren();
  if (!values.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "空";
    element.append(li);
    return;
  }
  for (const value of values) {
    const li = document.createElement("li");
    li.textContent = value;
    element.append(li);
  }
}

function showOutput(values) {
  els.output.replaceChildren();
  if (!values.length) {
    const item = document.createElement("span");
    item.className = "empty";
    item.textContent = "暂无输出";
    els.output.append(item);
    return;
  }
  for (const value of values) {
    const span = document.createElement("span");
    span.textContent = String(value);
    els.output.append(span);
  }
}

function renderFrame() {
  els.prev.disabled = frameIndex < 0;
  els.next.disabled = frameIndex >= frames.length - 1;
  els.index.textContent = frameIndex < 0 ? "等待开始" : (frameIndex + 1) + " / " + frames.length;
  if (frameIndex < 0) {
    els.explanation.textContent = "按“下一步”，观察代码如何从调用栈走到微任务，再到定时器任务。";
    showQueue(els.stack, []); showQueue(els.micro, []); showQueue(els.task, []);
    showOutput([]);
  } else {
    const frame = frames[frameIndex];
    els.explanation.textContent = frame.explanation;
    showQueue(els.stack, frame.stack.slice().reverse());
    showQueue(els.micro, frame.micro);
    showQueue(els.task, frame.tasks);
    showOutput(frame.output);
  }
  if (frameIndex >= frames.length - 1) stopPlayback();
}

function nextFrame() {
  if (frameIndex < frames.length - 1) frameIndex++;
  renderFrame();
}
function prevFrame() {
  stopPlayback();
  if (frameIndex >= 0) frameIndex--;
  renderFrame();
}
function resetFrame() {
  stopPlayback();
  frameIndex = -1;
  renderFrame();
}

function updateEditNotice() {
  hasEdited = els.code.value !== lessons[active].code;
  els.note.textContent = hasEdited
    ? "你改过代码了。上面的逐步动画只对应原题；改动后的真实输出请点左侧“运行当前代码”查看。"
    : "逐步展示只模拟内置题：当前脚本 → 微任务检查点 → 定时器任务。定时器达到可运行时间和浏览器绘制并非这里的实际测量结果。";
}

function selectLesson(index) {
  if (index < 0 || index >= lessons.length) return;
  stopPlayback(); stopWorker();
  active = index;
  const lesson = lessons[index];
  frames = simulate(lesson);
  frameIndex = -1;
  els.tag.textContent = lesson.tag;
  els.title.textContent = lesson.title;
  els.intro.textContent = lesson.intro;
  els.code.value = lesson.code;
  els.prediction.value = "";
  els.feedback.textContent = "";
  els.feedback.className = "feedback";
  els.hint.textContent = lesson.hint;
  els.hint.hidden = true;
  els.runOutput.textContent = "点击“运行当前代码”，在独立线程里试一试。";
  setRunStatus("尚未运行", "");
  els.fill.style.width = Math.round((index + 1) / lessons.length * 100) + "%";
  [...els.tabs.children].forEach((node, i) => node.setAttribute("aria-selected", String(i === index)));
  updateEditNotice();
  renderFrame();
}

function renderTabs() {
  lessons.forEach((lesson, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lesson-tab";
    button.textContent = lesson.tag + " · " + (i === lessons.length - 1 ? "挑战题" : lesson.title);
    button.setAttribute("aria-selected", "false");
    button.addEventListener("click", () => selectLesson(i));
    els.tabs.append(button);
  });
}

function validatePrediction() {
  const answer = els.prediction.value;
  if (!answer.trim()) {
    els.feedback.textContent = "先写出你的答案。不会也没关系，试着推一遍。";
    els.feedback.className = "feedback";
    return;
  }
  const result = checkPrediction(lessons[active], answer);
  els.feedback.className = "feedback" + (result.correct ? " good" : "");
  if (result.correct) els.feedback.textContent = "答对了！顺序是 " + result.expected.join(" → ") + "。现在点右侧“下一步”验证原因。";
  else els.feedback.textContent = "还差一点。你的预测是 " + result.actual.join(" → ") + "。想想：微任务在什么时候执行？可以先看提示，再按右侧步骤验证。";
}

function appendLiveLog(line) {
  liveLogs.push(line);
  els.runOutput.textContent = liveLogs.join("\n");
  els.runOutput.scrollTop = els.runOutput.scrollHeight;
}

function runCode() {
  stopWorker();
  const generation = runGeneration;
  const source = els.code.value;
  liveLogs = [];
  els.runOutput.textContent = "正在本地执行…";
  els.run.disabled = true;
  setRunStatus("运行中", "busy");
  try {
    liveWorker = new Worker("./runner-worker.js");
    liveWorker.onmessage = event => {
      if (generation !== runGeneration) return;
      const message = event.data;
      if (!message || typeof message.type !== "string") return;
      if (message.type === "log") appendLiveLog(String(message.text));
      if (message.type === "error") {
        appendLiveLog("错误：" + String(message.text));
        setRunStatus("执行出错", "error");
      }
      if (message.type === "done") {
        if (liveLogs.length === 0) els.runOutput.textContent = "没有 console.log 输出。";
        if (!els.runStatus.classList.contains("error")) setRunStatus("完成", "ok");
        stopWorker();
      }
    };
    liveWorker.onerror = event => {
      if (generation !== runGeneration) return;
      appendLiveLog("Worker 错误：" + (event.message || "未知错误"));
      setRunStatus("执行出错", "error");
      stopWorker();
    };
    liveWorker.postMessage({ type: "run", source });
    liveTimeout = setTimeout(() => {
      if (generation !== runGeneration) return;
      appendLiveLog("执行时间超过 2.5 秒，已终止。请检查是否存在死循环或过长的异步任务。");
      setRunStatus("已超时终止", "error");
      stopWorker();
    }, 2500);
  } catch (error) {
    els.runOutput.textContent = "无法启动 Web Worker：" + String(error.message || error);
    setRunStatus("无法运行", "error");
    stopWorker();
  }
}

renderTabs();
selectLesson(0);
els.next.addEventListener("click", nextFrame);
els.prev.addEventListener("click", prevFrame);
els.reset.addEventListener("click", resetFrame);
els.play.addEventListener("click", () => {
  if (playTimer !== null) { stopPlayback(); return; }
  if (frameIndex >= frames.length - 1) frameIndex = -1;
  els.play.textContent = "⏸ 暂停播放";
  nextFrame();
  playTimer = setInterval(nextFrame, 800);
});
els.predict.addEventListener("click", validatePrediction);
els.prediction.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") validatePrediction();
});
els.hintBtn.addEventListener("click", () => { els.hint.hidden = !els.hint.hidden; });
els.code.addEventListener("input", updateEditNotice);
els.restore.addEventListener("click", () => { els.code.value = lessons[active].code; updateEditNotice(); });
els.run.addEventListener("click", runCode);
window.addEventListener("pagehide", () => { stopPlayback(); stopWorker(); });
document.addEventListener("visibilitychange", () => { if (document.hidden) stopPlayback(); });