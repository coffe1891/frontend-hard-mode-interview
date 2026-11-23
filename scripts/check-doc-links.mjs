// Node 22+；扫描整本书的本地链接、远程链接、图片，不依赖第三方库。
import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, relative, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd(), IGNORE = new Set([".git", "node_modules", ".github", ".gitbook"]);
export function markdownFiles(dir = ROOT) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!IGNORE.has(e.name)) out.push(...markdownFiles(join(dir, e.name)));
    } else if (e.isFile() && e.name.toLowerCase().endsWith(".md")) out.push(join(dir, e.name));
  }
  return out;
}
function hideCode(s) {
  return s.replace(/^[ \t]*(\x60{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$/gm, m => m.replace(/[^\n]/g, " "))
          .replace(/\x60[^\x60\n]*\x60/g, m => " ".repeat(m.length));
}
function lineOf(s, at) { return s.slice(0, at).split("\n").length; }
function targetOf(s) {
  s = s.trim();
  if (s.startsWith("<") && s.includes(">")) s = s.slice(1, s.indexOf(">"));
  else s = s.replace(/\s+["'][^"']*["']\s*$/, "").trim();
  return s.replace(/\\([()])/g, "$1").replace(/&amp;/g, "&");
}
export function extractLinks(raw) {
  const s = hideCode(raw), out = [];
  for (let i = 0; i < s.length; i++) {
    const image = s[i] === "!" && s[i + 1] === "[";
    if (!image && s[i] !== "[") continue;
    const a = image ? i + 1 : i;
    let j = a + 1, nesting = 1;
    while (j < s.length && nesting) {
      if (s[j] === "\\" && j + 1 < s.length) { j += 2; continue; }
      if (s[j] === "[") nesting++;
      else if (s[j] === "]") nesting--;
      j++;
    }
    if (nesting || s[j] !== "(") continue;
    let k = j + 1, parens = 1, quoted = false;
    while (k < s.length && parens) {
      if (s[k] === "\\" && k + 1 < s.length) { k += 2; continue; }
      if (s[k] === '"') quoted = !quoted;
      if (!quoted && s[k] === "(") parens++;
      if (!quoted && s[k] === ")") parens--;
      k++;
    }
    if (parens) continue;
    const target = targetOf(s.slice(j + 1, k - 1));
    if (target) out.push({ target, image, line: lineOf(s, i), kind: "markdown" });
    i = k - 1;
  }
  for (const m of s.matchAll(/<(a|img|source)\b[^>]*?\b(href|src)\s*=\s*["']([^"']+)["'][^>]*>/gi))
    out.push({ target: targetOf(m[3]), image: m[1].toLowerCase() !== "a", line: lineOf(s, m.index), kind: "html" });
  for (const m of s.matchAll(/^\s{0,3}\[[^\]\n]+\]:\s*(<[^>]+>|\S+)/gm))
    out.push({ target: targetOf(m[1]), image: false, line: lineOf(s, m.index), kind: "reference" });
  return out;
}
export function normalizeTarget(file, target, root = ROOT) {
  if (/^https?:\/\//i.test(target)) return { type: "external", url: target };
  if (/^(mailto:|tel:|data:|javascript:|ftp:|#)/i.test(target)) return { type: "skip" };
  const part = target.split("#")[0].split("?")[0].trim();
  if (!part) return { type: "skip" };
  let decoded;
  try { decoded = decodeURIComponent(part); } catch { return { type: "invalid", reason: "URL 编码错误" }; }
  const name = decoded.startsWith("/") ? resolve(root, "." + decoded) : resolve(dirname(file), decoded);
  if (!(name === root || name.startsWith(root + sep))) return { type: "invalid", reason: "路径越过仓库" };
  return { type: "local", absolute: name, relative: relative(root, name).split(sep).join("/") };
}
export function audit(root = ROOT) {
  const broken = [], external = [], remoteImages = [], counts = { files: 0, links: 0 };
  for (const file of markdownFiles(root)) {
    const path = relative(root, file).split(sep).join("/");
    counts.files++;
    for (const item of extractLinks(readFileSync(file, "utf8"))) {
      counts.links++;
      const where = { file: path, line: item.line, target: item.target, image: item.image, kind: item.kind };
      const ref = normalizeTarget(file, item.target, root);
      if (ref.type === "external") {
        external.push({ ...where, url: ref.url });
        if (item.image) remoteImages.push(where);
      } else if (ref.type === "invalid" || (ref.type === "local" && !existsSync(ref.absolute))) {
        broken.push({ ...where, normalized: ref.relative || "", reason: ref.reason || "文件不存在" });
      }
    }
  }
  return { ...counts, broken, external, remoteImages };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = audit();
  console.log("Markdown：" + result.files + "；链接：" + result.links + "；本地失效：" + result.broken.length
    + "；外链：" + result.external.length + "；外链图片：" + result.remoteImages.length);
  for (const row of result.broken.slice(0, 100)) console.error("[失效] " + row.file + ":" + row.line + " => " + row.target);
  const arg = process.argv.indexOf("--json");
  if (arg >= 0) {
    const destination = resolve(ROOT, process.argv[arg + 1] || "reports/book-links.json");
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, JSON.stringify(result, null, 2) + "\n");
    console.log("完整报告：" + destination);
  }
  if (result.broken.length) process.exitCode = 1;
}
