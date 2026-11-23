// Event Loop 单代码块原型；只负责读者修改代码并在 Worker 中真实运行。
(() => {
  "use strict";
  const editor = document.querySelector("#editor");
  const runButton = document.querySelector("#run");
  const resetButton = document.querySelector("#reset");
  const output = document.querySelector("#output");
  const status = document.querySelector("#status");
  // GitBook ContentKit 组件通过受控 URL 参数传入 Markdown 示例代码。
  // 用户实际编辑与运行仍然完全在本地，不会回写 GitBook 文档。
  const initialCode = new URLSearchParams(window.location.search).get("code");
  if (initialCode && initialCode.length <= 4000) editor.value = initialCode;
  const originalCode = editor.value;

  // ContentKit sizing is independent of code execution; standalone pages send no messages.
  if (window.parent !== window) {
    const sendAction = action => window.parent.postMessage({ action }, "*");
    let lastSize = "";
    const resizeFrame = () => {
      const width = document.documentElement.clientWidth;
      const height = Math.ceil(document.body.getBoundingClientRect().height);
      const size = `${width}:${height}`;
      if (!width || !height || size === lastSize) return;
      lastSize = size;
      sendAction({ action: "@webframe.resize", size: { aspectRatio: width / height, height } });
    };
    sendAction({ action: "@webframe.ready" });
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(resizeFrame).observe(document.body);
    }
    window.addEventListener("resize", resizeFrame);
    resizeFrame();
  }

  let activeWorker = null;
  let stopTimer = null;
  let nonce = 0;
  let lines = [];
  let failed = false;

  const setStatus = value => { status.textContent = value; };
  const clearWorker = () => {
    nonce++;
    if (stopTimer !== null) clearTimeout(stopTimer);
    stopTimer = null;
    if (activeWorker) activeWorker.terminate();
    activeWorker = null;
    runButton.disabled = false;
  };
  const addLine = value => {
    lines.push(String(value));
    output.textContent = lines.join("\n");
    output.scrollTop = output.scrollHeight;
  };
  const execute = () => {
    clearWorker();
    if (editor.value.length > 12000) {
      output.textContent = "代码太长（最多 12000 字符），请缩短后再运行。";
      setStatus("未执行");
      return;
    }
    const current = nonce;
    failed = false;
    lines = [];
    output.textContent = "运行中…";
    runButton.disabled = true;
    setStatus("正在加载运行环境");
    const armTimeout = (delay, message, state) => {
      if (stopTimer !== null) clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        if (nonce !== current) return;
        failed = true;
        addLine(message);
        setStatus(state);
        clearWorker();
      }, delay);
    };
    try {
      activeWorker = new Worker("../runner-worker.js");
      activeWorker.addEventListener("message", e => {
        if (nonce !== current) return;
        const data = e.data;
        if (!data || typeof data.type !== "string") return;
        if (data.type === "started") {
          setStatus("正在运行");
          armTimeout(2500, "代码执行超时，已强制停止。请检查死循环或长时间的异步操作。", "执行超时");
        }
        if (data.type === "log") addLine(data.text);
        if (data.type === "error") {
          failed = true;
          addLine("错误：" + String(data.text));
        }
        if (data.type === "done") {
          if (!lines.length) output.textContent = "没有 console.log 输出。";
          setStatus(failed || data.failed ? "执行出错" : "已执行");
          clearWorker();
        }
      });
      activeWorker.addEventListener("error", e => {
        if (nonce !== current) return;
        failed = true;
        addLine("Worker 错误：" + (e.message || "未知异常"));
        setStatus("执行出错");
        clearWorker();
      });
      activeWorker.postMessage({ type: "run", source: editor.value });
      armTimeout(10000, "运行环境加载超时，请检查网络后重试。", "加载超时");
    } catch (e) {
      output.textContent = "无法启动代码运行环境：" + String(e.message || e);
      setStatus("环境不支持");
      clearWorker();
    }
  };

  runButton.addEventListener("click", execute);
  resetButton.addEventListener("click", () => {
    clearWorker();
    editor.value = originalCode;
    output.textContent = "已恢复原题。先猜顺序，再点击「运行代码」。";
    setStatus("尚未执行");
  });
  editor.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") execute();
  });
  window.addEventListener("pagehide", clearWorker);
})();