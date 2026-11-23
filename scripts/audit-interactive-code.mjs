/**
 * 《前端内参》全书代码块可运行性审计。
 *
 * 默认只报告，不修改正文。--apply 才将经静态验证、数量受控的 JS 代码围栏
 * 从 javascript/js 改为 js-run。绝不修改围栏内部的代码与文章其他正文。
 *
 * 注意：静态检查不是浏览器验收。每类代码仍需手工点击运行、检查输出。
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, relative } from 'node:path';
import { Script } from 'node:vm';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const apply = process.argv.includes('--apply');
const maxArg = process.argv.find(x => x.startsWith('--max-per-file='));
const maxPerFile = maxArg ? Number(maxArg.split('=')[1]) : 3;
if (!Number.isInteger(maxPerFile) || maxPerFile < 1 || maxPerFile > 20) {
  throw new Error('--max-per-file 必须是 1~20 之间的整数');
}
const targetRoot = process.argv.find(x => x.startsWith('--root='))?.slice(7);
const base = targetRoot ? resolve(targetRoot) : root;
const chapters = [...Array.from({ length: 11 }, (_, i) => String(i))];
const files = [];
for (const chapter of chapters) {
  let list;
  try { list = readdirSync(join(base, chapter), { withFileTypes: true }); }
  catch { continue; }
  for (const ent of list) if (ent.isFile() && ent.name.endsWith('.md')) {
    files.push(join(base, chapter, ent.name));
  }
}
files.sort();

// Only standalone, browser-independent JS snippets are candidates.
// This is a *conservative* whitelist-based classroom migration, not a JS sandbox validator.
const forbidden = /\b(?:document|window|navigator|location|localStorage|sessionStorage|XMLHttpRequest|fetch|WebSocket|Worker|SharedArrayBuffer|Atomics|require|process|global|globalThis|self|module|exports|__dirname|__filename|Buffer|alert|prompt|confirm|MutationObserver|IntersectionObserver|requestAnimationFrame|requestIdleCallback|setInterval|Image|FileReader|WebAssembly|indexedDB|customElements|HTMLElement|HTMLCanvasElement|history|performance|BroadcastChannel|postMessage|importScripts|MessageChannel|EventSource)\b/;
const forbiddenCall = /\b(?:eval|Function)\s*\(|\b(?:import|export)\s*(?:\(|\{|["'*]|[A-Za-z0-9_$])/;
const requiresOutput = /\bconsole\.(?:log|info|warn|error|debug)\s*\(/;
const fences = /^([ \t]{0,3})(\x60{3,})([^\r\n]*)\r?\n([\s\S]*?)^\1\2[ \t]*(?:\r?\n|$)/gm;
const all = [];
const texts = new Map();
let i = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  texts.set(file, text);
  let n = 0;
  for (const m of text.matchAll(fences)) {
    n++;
    const head = m[3].trim();
    const lang = head.split(/\s/)[0].toLowerCase() || '(none)';
    const source = m[4];
    const line = text.slice(0, m.index).split('\n').length;
    const entry = { path: relative(base, file).replaceAll('\\', '/'), file, number: n, line,
      lang, chars: source.length, lines: source.split('\n').length,
      reason: '', eligible: false, selected: false, syntaxChecked: false,
      start: m.index, end: m.index + m[0].length, raw: m[0], indent: m[1], marker: m[2],
      header: m[3], source };
    if (!['javascript', 'js'].includes(lang)) {
      entry.reason = lang === 'js-run' ? '已升级' : '暂不支持此语言或它不是独立 JS 程序';
    } else if (head.toLowerCase() !== lang) {
      entry.reason = '围栏含额外参数，需人工检查';
    } else if (!source.trim()) {
      entry.reason = '空代码';
    } else if (source.length > 2500 || entry.lines > 70) {
      entry.reason = '代码较长或不适合文章内嵌（默认不转换）';
    } else if (!requiresOutput.test(source)) {
      entry.reason = '没有可观察的 console 输出，可能是只展示 API 或函数片段';
    } else if (forbidden.test(source) || forbiddenCall.test(source)) {
      entry.reason = '依赖 DOM/Node/网络/模块/特殊宿主环境，或包含动态代码';
    } else if (/for\s*\(\s*;\s*;|while\s*\(\s*true\s*\)|while\s*\(\s*1\s*\)/.test(source)) {
      entry.reason = '可能无限循环或不适合运行器';
    } else {
      try {
        new Script(source, { filename: entry.path + '#' + n });
        entry.syntaxChecked = true;
      } catch (err) {
        entry.reason = '不是可独立解析的脚本：' + String(err.message).split('\n').at(-1);
      }
    }
    all.push(entry);
  }
}

// Analyze free identifiers in one TypeScript program, rather than pretending syntax-valid
// snippets are necessarily self-contained. Type diagnostics are only an exclusion signal.
const possible = all.filter(x => x.syntaxChecked);
const tmp = mkdtempSync(join(tmpdir(), 'neican-interactive-'));
const sourceFiles = new Map();
try {
  for (let k = 0; k < possible.length; k++) {
    const name = join(tmp, 'snippet-' + k + '.js');
    writeFileSync(name, possible[k].source);
    sourceFiles.set(resolve(name), possible[k]);
  }
  if (sourceFiles.size) {
    // TypeScript 7 no longer exposes the classic compiler API from the main
    // "typescript" package. Use the supported CLI for a single checkJs pass.
    const tsc = resolve(base, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
    const args = ['--ignoreConfig', '--allowJs', '--checkJs', '--noEmit', '--skipLibCheck',
      '--target', 'ES2022', '--module', 'commonjs', '--moduleDetection', 'force',
      ...sourceFiles.keys()];
    const result = spawnSync(tsc, args, {
      cwd: base, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, timeout: 120000
    });
    if (result.error) throw result.error;
    // A nonzero exit status is expected when selected snippets have missing names.
    const diagnosticLines = (result.stdout + '\n' + result.stderr).split(/\r?\n/);
    const relevant = new Set([2304, 2552, 2580, 2584, 2307, 2451, 1375, 1378]);
    let seen = 0;
    for (const line of diagnosticLines) {
      const match = line.match(/^(.+?)\(\d+,\d+\): error TS(\d+): (.*)$/);
      if (!match) continue;
      seen++;
      const entry = sourceFiles.get(resolve(match[1]));
      const code = Number(match[2]);
      if (entry && relevant.has(code) && !entry.reason) {
        entry.reason = '缺少上下文/外部变量：TS' + code + ' ' + match[3].slice(0, 130);
      }
    }
    if (result.status !== 0 && !seen) {
      throw new Error('TypeScript CLI 检查异常，无法解析诊断信息：' +
        (result.stdout + result.stderr).slice(0, 500));
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

const perFile = new Map();
for (const entry of all) {
  entry.eligible = entry.syntaxChecked && !entry.reason;
  if (!entry.eligible) continue;
  const used = perFile.get(entry.file) || 0;
  if (used >= maxPerFile) {
    entry.reason = '本批次每篇上限 ' + maxPerFile + '，其余等待性能验收';
    continue;
  }
  entry.selected = true;
  perFile.set(entry.file, used + 1);
}

const byLanguage = Object.fromEntries(
  [...new Set(all.map(x => x.lang))].sort().map(lang =>
    [lang, all.filter(x => x.lang === lang).length])
);
const byReason = Object.fromEntries(
  [...new Set(all.map(x => x.reason).filter(Boolean))].map(reason =>
    [reason, all.filter(x => x.reason === reason).length])
);
const summary = {
  markdownFiles: files.length, codeBlocks: all.length, byLanguage,
  existingInteractive: all.filter(x => x.lang === 'js-run').length,
  eligibleStandaloneJS: all.filter(x => x.eligible).length,
  selectedForPilot: all.filter(x => x.selected).length,
  selectedPages: perFile.size,
  skipped: all.filter(x => !x.selected && x.lang !== 'js-run').length,
  sampleLimits: { maxPerFile, maxChars: 2500, maxLines: 70 },
  byReason
};
const report = {
  warning: '静态审计不等于在真实 GitBook 中验收。本脚本只改代码围栏语言，不改变代码文本。',
  summary,
  entries: all.map(({ path, number, line, lang, chars, lines, reason, eligible, selected }) =>
    ({ path, number, line, lang, chars, lines, reason, eligible, selected }))
};
mkdirSync(join(base, 'reports'), { recursive: true });
writeFileSync(join(base, 'reports/interactive-code-audit.json'), JSON.stringify(report, null, 2) + '\n');
if (apply) {
  for (const [file] of perFile) {
    let text = texts.get(file);
    const changes = all.filter(x => x.file === file && x.selected).sort((a, b) => b.start - a.start);
    for (const x of changes) {
      // Change the tag only. Source lines, closing fence and surrounding prose are byte-for-byte intact.
      const original = x.raw;
      const changed = original.replace(/^([ \t]{0,3})(\x60{3,})(javascript|js)(?=\r?\n)/i, '$1$2js-run');
      if (original === changed) throw new Error('无法转换：' + x.path + ':' + x.line);
      text = text.slice(0, x.start) + changed + text.slice(x.end);
    }
    writeFileSync(file, text);
  }
}
console.log(JSON.stringify({ mode: apply ? 'apply' : 'report', ...summary }, null, 2));
