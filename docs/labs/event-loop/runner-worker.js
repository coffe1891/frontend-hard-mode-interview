// 只运行读者亲手编辑的 JavaScript。隔离在 Worker，不能操作 GitBook 页面的 DOM。
// 运行时间与日志条数都有限制；不支持依赖 document/window 的代码。
let logCount = 0;
let hasFailed = false;
const MAX_LOGS = 200;
function formatValue(value) {
  if (typeof value === "string") return value;
  if (typeof value === "undefined") return "undefined";
  if (typeof value === "bigint") return String(value) + "n";
  if (typeof value === "function") return "[Function " + (value.name || "anonymous") + "]";
  try { return JSON.stringify(value) ?? String(value); }
  catch { return String(value); }
}
function sendLine(type, args) {
  if (logCount >= MAX_LOGS) return;
  logCount++;
  self.postMessage({ type, text: Array.from(args).map(formatValue).join(" ") });
  if (logCount === MAX_LOGS) self.postMessage({ type: "log", text: "日志超过 200 行，已停止记录。" });
}
const capturedConsole = Object.freeze({
  log: (...args) => sendLine("log", args),
  info: (...args) => sendLine("log", args),
  warn: (...args) => sendLine("log", ["[warn]", ...args]),
  error: (...args) => sendLine("log", ["[error]", ...args]),
  debug: (...args) => sendLine("log", args)
});
self.addEventListener("unhandledrejection", event => {
  hasFailed = true;
  sendLine("error", [event.reason]);
  event.preventDefault();
});
self.addEventListener("error", event => {
  hasFailed = true;
  sendLine("error", [event.message || "未知异常"]);
  event.preventDefault();
});
self.addEventListener("message", event => {
  if (!event.data || event.data.type !== "run" || typeof event.data.source !== "string") return;
  logCount = 0;
  try {
    // 有意允许读者输入 JS：仅执行本地编辑器里的代码，不从 URL 读取或执行远程脚本。
    // 无 DOM 的 Worker 与 UI 分离；父页面会在 2.5 秒后强制 terminate。
    const fn = new Function("console", event.data.source);
    fn(capturedConsole);
  } catch (error) {
    hasFailed = true;
    sendLine("error", [error.name + ": " + error.message]);
  }
  // 给 Promise / setTimeout 等异步任务一段执行窗口；此演示不收集长时异步结果。
  setTimeout(() => {
    self.postMessage({ type: "done", failed: hasFailed });
    self.close();
  }, 1200);
});