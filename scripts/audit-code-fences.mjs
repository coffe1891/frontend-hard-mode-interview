#!/usr/bin/env node
// 《前端内参》章节代码块审计：仅编译 JS 检查语法，不执行代码。
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { Script } from "node:vm";

const root = resolve(import.meta.dirname, "..");
const files = ["0.0.1.md"];
function walk(dir) {
  for (const item of readdirSync(join(root, dir), { withFileTypes: true })) {
    const p = join(dir, item.name);
    if (item.isDirectory()) walk(p);
    else if (item.isFile() && p.endsWith(".md")) files.push(p.replaceAll("\\", "/"));
  }
}
for (const d of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]) walk(d);
files.sort();
const js = new Set(["js", "javascript", "mjs", "cjs", "js-run"]);
const ts = new Set(["ts", "typescript", "tsx"]);
const framework = new Set(["vue", "jsx", "react"]);
const web = new Set(["html", "htm", "css", "scss", "less"]);
const shells = new Set(["sh", "bash", "shell", "cmd", "bat", "powershell", "ps1", "zsh"]);
const config = new Set(["json", "jsonc", "yaml", "yml", "toml", "xml", "dockerfile", "nginx"]);
const chart = new Set(["mermaid", "dot", "graphviz"]);
const text = new Set(["", "text", "plaintext", "txt", "md", "markdown", "none"]);

function kindOf(lang) {
  if (js.has(lang)) return "JavaScript";
  if (ts.has(lang)) return "TypeScript";
  if (framework.has(lang)) return "框架/组件";
  if (web.has(lang)) return "HTML/CSS";
  if (shells.has(lang)) return "Shell/命令";
  if (config.has(lang)) return "JSON/配置";
  if (chart.has(lang)) return "图表";
  if (lang === "sql") return "SQL";
  if (text.has(lang)) return "文本/未标注";
  if (/^(python|py|java|go|rust|c|cpp|c\+\+|php|ruby|dart|swift|kotlin)$/.test(lang)) return "其他编程语言";
  return "其他/未知";
}
const checks = [
  ["DOM或浏览器UI", /\b(?:document|window|navigator|location|localStorage|sessionStorage|HTMLElement|NodeList|MutationObserver|alert|prompt|confirm|requestAnimationFrame|querySelector|getElementById)\b/],
  ["Node API/模块", /\b(?:require|module|process|Buffer|__dirname|__filename|global)\b|(?:^|\n)\s*(?:import|export)\b/m],
  ["框架/外部库", /\b(?:React|Vue|angular|jQuery|useState|useEffect|createApp|axios|lodash|rxjs|RxJS|useRouter)\b/],
  ["网络/文件/执行权限", /\b(?:fetch|XMLHttpRequest|WebSocket|importScripts|Worker|SharedWorker|eval)\s*\(|\b(?:WebAssembly|Function)\s*\(/],
  ["可能死循环", /\bwhile\s*\(\s*true\s*\)|\bfor\s*\(\s*;\s*;\s*\)/]
];
const records=[],problems=[];
for (const path of files) {
  const lines=readFileSync(join(root,path),"utf8").replace(/\r\n/g,"\n").split("\n");
  let current=null;
  for(let i=0;i<lines.length;i++){
    const match=lines[i].match(/^[ \t]{0,8}(\x60{3,}|~{3,})(.*)$/);
    if (!current) {
      if (match) current={path,line:i+1,open:match[1],language:match[2].trim().split(/\s+/)[0].toLowerCase(),body:[]};
      continue;
    }
    if(match&&match[1][0]===current.open[0]&&match[1].length>=current.open.length&&!match[2].trim()){
      const code=current.body.join("\n"),kind=kindOf(current.language);
      const risks=checks.filter(([,re])=>re.test(code)).map(([name])=>name);
      let syntax="not-applicable";
      if (kind==="JavaScript") {
        try {new Script(code,{filename:path});syntax="valid";}catch{syntax="invalid";}
      }
      const log=/\bconsole\.(?:log|info|warn|error|debug)\s*\(/.test(code);
      const candidate=kind==="JavaScript"&&current.language!=="js-run"&&syntax==="valid"&&code.length<=4000&&risks.length===0&&log;
      records.push({path,line:current.line,language:current.language,kind,length:code.length,syntax,risks,hasConsoleLog:log,candidate,firstLine:code.trim().split("\n")[0].slice(0,160)});
      current=null;
    } else current.body.push(lines[i]);
  }
  if(current)problems.push({path,line:current.line,problem:"代码围栏未关闭"});
}
const counts={byLanguage:{},byKind:{},byChapter:{},byReason:{}};
for(const r of records){
  const lang=r.language||"(none)",chapter=r.path.split("/")[0];
  counts.byLanguage[lang]=(counts.byLanguage[lang]||0)+1;
  counts.byKind[r.kind]=(counts.byKind[r.kind]||0)+1;
  counts.byChapter[chapter]=(counts.byChapter[chapter]||0)+1;
  if(r.kind==="JavaScript"&&!r.candidate&&r.language!=="js-run"){
    const reason=r.syntax==="invalid"?"语法不完整/伪代码":r.length>4000?"超过当前运行器限制":r.risks[0]||(!r.hasConsoleLog?"没有直接可观察的输出":"需要人工验证");
    counts.byReason[reason]=(counts.byReason[reason]||0)+1;
  }
}
const report={generatedAt:new Date().toISOString(),source:"章节 Markdown（不含 README 和工程文件）",files:files.length,
 total:records.length,candidates:records.filter(r=>r.candidate).length,alreadyInteractive:records.filter(r=>r.language==="js-run").length,counts,problems,records};
const option=process.argv.indexOf("--json");
const out=option>=0?process.argv[option+1]:"reports/code-fences.json";
mkdirSync(dirname(resolve(root,out)),{recursive:true});
writeFileSync(resolve(root,out),JSON.stringify(report,null,2)+"\n");
console.log("审计：",report.files,"篇章节，",report.total,"个代码块；纯 JS 候选",report.candidates,"，已交互",report.alreadyInteractive,"，围栏异常",problems.length);
for (const [kind,num] of Object.entries(counts.byKind).sort((a,b)=>b[1]-a[1]))console.log(kind,num);
