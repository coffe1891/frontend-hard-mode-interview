import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { Script } from "node:vm";

const whitelist = JSON.parse(readFileSync("reports/interactive-js-vetted.json", "utf8")).verifiedBlocks;
const migrationDigest = "71b5c411ddd6782003fbe494939cbc2de30f1f3f3ef18b09b672fe22090b7295";

function selectedCode(path, number) {
  const lines=readFileSync(path,"utf8").replace(/\r\n/g,"\n").split("\n");
  const opening=lines[number-1];
  assert.match(opening,/^[ \t]{0,8}(\x60{3,}|~{3,})js-run[ \t]*$/,path+":"+number+" 必须保持 js-run");
  const tick=opening.match(/(\x60{3,}|~{3,})/)[0];
  const closing=new RegExp("^[ \\t]*"+tick+"[ \\t]*$");
  let end=number;
  while(end<lines.length&&!closing.test(lines[end]))end++;
  assert.ok(end<lines.length,path+":"+number+" 找不到结束标记");
  return lines.slice(number,end).join("\n");
}

test("199 处经过隔离验证的 JS 示例只替换围栏标识，代码字节完全保留",()=>{
  const hash=createHash("sha256");
  let total=0;
  for(const [path,positions] of Object.entries(whitelist).sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0)) {
    for(const line of positions) {
      const code=selectedCode(path,line);
      assert.ok(code.length>0&&code.length<=4000,path+":"+line+" 源码大小异常");
      assert.doesNotThrow(()=>new Script(code,{filename:path}),path+":"+line+" JS语法错误");
      hash.update(path).update("\0").update(String(line)).update("\0").update(code).update("\0");
      total++;
    }
  }
  assert.equal(total,199);
  assert.equal(hash.digest("hex"),migrationDigest,"正文源码发生变化，应重新审核，而不是静默覆盖");
});

test("已升级 JS 不含 DOM/Node 专属 API，也未超过运行器容量",()=>{
  for(const [path,positions] of Object.entries(whitelist))for(const n of positions){
    const code=selectedCode(path,n);
    assert.doesNotMatch(code,/\b(?:document|window|navigator|localStorage|querySelector|require|process|module|Buffer)\b/,
      path+":"+n+" 不适合当前无 DOM 的 Worker");
    assert.ok(code.length<=4000,path+":"+n+" 当前 GitBook runner 的传参限制是4000字符");
  }
});
