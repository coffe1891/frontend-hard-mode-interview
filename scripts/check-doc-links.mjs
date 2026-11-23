// 检查本书 Markdown 站内相对路径，历史坏链仍会报告，不隐瞒。
// 用法：node scripts/check-doc-links.mjs [--strict]
// 默认：正式目录、README、TypeScript新章节、历史索引必须正确；其他旧稿仅报告。
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, relative, extname, join, sep } from "node:path";

const root = process.cwd();
const all = [];
const skipDirs = new Set([".git", "node_modules", ".github"]);
function walk(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    if (item.isDirectory()) {
      if (!skipDirs.has(item.name) && item.name !== ".gitbook") walk(join(dir, item.name));
    } else if (item.name.endsWith(".md")) {
      all.push(join(dir, item.name));
    }
  }
}
walk(root);

const broken = [];
const externalImages = [];
for (const file of all) {
  const rel = relative(root, file).split(sep).join("/");
  const content = readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "");
  for (const match of content.matchAll(/(!?)\[[^\]]*\]\(([^\n)]*)\)/g)) {
    const image = match[1] === "!";
    let link = match[2].trim();
    if (/^https?:\/\//i.test(link)) {
      if (image) externalImages.push({ file: rel, url: link });
      continue;
    }
    if (/^(mailto:|tel:|#|data:|javascript:)/i.test(link) || !link) continue;
    // Markdown 可以携带标题；这套脚本只检查常规相对链接形式
    link = link.replace(/\\([()])/g, "$1").replace(/\s+"[^"]*"$/, "");
    const bare = link.split("#")[0].split("?")[0];
    if (!bare) continue;
    let name;
    try { name = decodeURIComponent(bare); }
    catch { broken.push({ file: rel, target: link, why: "URL编码错误" }); continue; }
    const target = resolve(dirname(file), name);
    if (!target.startsWith(root + sep) && target !== root) {
      broken.push({ file: rel, target: link, why: "越过仓库根目录" });
      continue;
    }
    if (!existsSync(target)) broken.push({ file: rel, target: link, why: "目标不存在" });
  }
}
const keyFiles = new Set(["README.md", "SUMMARY.md", "8/8.1.md", "8/8.2.md", "8/8.3.md", "archive/README.md"]);
const critical = broken.filter(item => keyFiles.has(item.file));
console.log(`扫描 Markdown ${all.length} 个；本地失效路径 ${broken.length} 个；外链图片 ${externalImages.length} 张。`);
for (const row of broken.slice(0, 80)) console.log(`[失效] ${row.file} => ${row.target}（${row.why}）`);
for (const row of externalImages.slice(0, 20)) console.log(`[外链图片待迁移] ${row.file} => ${row.url}`);
if (broken.length > 80) console.log("失效链接超过80条，输出已截断，请分批修订。");
const strict = process.argv.includes("--strict");
if ((strict && broken.length) || critical.length) {
  console.error(strict ? "严格模式：存在失效路径。" : "核心入口或新章节存在失效路径。");
  process.exitCode = 1;
}
