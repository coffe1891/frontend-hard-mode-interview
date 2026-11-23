// 全书外部链接巡检；只报告，不盲目删链接或把403当404。
// Node 22+；用法：node scripts/check-external-links.mjs --json reports/external-links.json
import { audit } from "./check-doc-links.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(name);
  return i < 0 ? fallback : (args[i + 1] || fallback);
}
const timeout = Number(arg("--timeout-ms", "8000"));
const concurrency = Math.max(1, Math.min(12, Number(arg("--concurrency", "6"))));
const limit = Number(arg("--limit", "0"));
const reportFile = arg("--json", "reports/external-links.json");
const input = audit();
const grouped = new Map();
for (const ref of input.external) {
  let parsed;
  try { parsed = new URL(ref.url); } catch { continue; }
  if (!["http:", "https:"].includes(parsed.protocol)) continue;
  const key = parsed.toString();
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key).push({ file: ref.file, line: ref.line, image: ref.image });
}
const items = [...grouped.entries()].map(([url, refs]) => ({ url, refs }));
const targets = limit > 0 ? items.slice(0, limit) : items;
function isPrivate(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return host === "localhost" || host === "::1" || host.endsWith(".local")
    || /^(127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(host);
}
async function probe(url) {
  const host = new URL(url).hostname;
  if (isPrivate(host)) return { state: "unverified", why: "跳过本地或内网地址" };
  const opts = { redirect: "follow", signal: AbortSignal.timeout(timeout),
    headers: { "User-Agent": "FrontendNeicanBookLinkCheck/1.0 (+https://github.com/coffe1891/frontend-hard-mode-interview)",
      "Accept": "text/html,application/xhtml+xml,*/*;q=0.5" } };
  try {
    let response = await fetch(url, { ...opts, method: "HEAD" });
    // 站点可能拒绝 HEAD；404/410 也需要由 GET 再确认一次，降低误报。
    if ([403, 404, 405, 410, 501].includes(response.status)) {
      response.body?.cancel().catch(() => {});
      response = await fetch(url, { ...opts, method: "GET" });
    }
    response.body?.cancel().catch(() => {});
    const code = response.status, finalUrl = response.url;
    if (code >= 200 && code < 400) return { state: "ok", code, finalUrl, redirected: finalUrl !== url };
    if ([404, 410].includes(code)) return { state: "broken", code, finalUrl };
    return { state: "unverified", code, finalUrl, why: "可能是反爬、限流或临时故障" };
  } catch (err) {
    return { state: "unverified", why: String(err.message || err).slice(0, 180) };
  }
}
const checked = new Array(targets.length);
let cursor = 0;
async function worker() {
  while (true) {
    const i = cursor++;
    if (i >= targets.length) break;
    checked[i] = { ...targets[i], ...(await probe(targets[i].url)) };
  }
}
await Promise.all(Array.from({ length: concurrency }, () => worker()));
const counts = { ok: 0, broken: 0, unverified: 0 };
for (const item of checked) counts[item.state]++;
const result = { scannedAt: new Date().toISOString(), documents: input.files,
  externalReferences: input.external.length, uniqueExternalUrls: grouped.size,
  checkedUrls: checked.length, counts, checked };
const destination = resolve(process.cwd(), reportFile);
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, JSON.stringify(result, null, 2) + "\n");
console.log("外链检查：共 " + result.uniqueExternalUrls + " 个唯一URL，实际检查 " + checked.length
  + " 个；可访问 " + counts.ok + "；确认404/410 " + counts.broken
  + "；无法确定 " + counts.unverified + "。");
for (const item of checked.filter(x => x.state !== "ok").slice(0, 35))
  console.log("[" + item.state + "] " + (item.code || item.why || "") + " " + item.url + " @ " + item.refs[0].file);
console.log("完整结果：" + destination);
// 403 / 超时不是死链，自动检测不删除任何原始内容，人工核验后再修改。
if (args.includes("--fail-on-dead") && counts.broken) process.exitCode = 1;
