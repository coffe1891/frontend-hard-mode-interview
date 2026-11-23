import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const examples = [
  {doc: "8/8.1.md", file: "examples/typescript/01-validate-api.ts", marker: "function isUser(value: unknown)"},
  {doc: "8/8.2.md", file: "examples/typescript/02-search-state.ts", marker: "type SearchState ="},
  {doc: "8/8.3.md", file: "examples/typescript/03-generics.ts", marker: "type WithId ="},
];

for (const {doc, file, marker} of examples) {
  test(`TypeScript 正文章节和编译示例一致：${doc}`, () => {
    const markdown = readFileSync(doc, "utf8");
    const snippets = [...markdown.matchAll(/```typescript\s*\n([\s\S]*?)\n```/g)].map(match => match[1]);
    const snippet = snippets.find(code => code.includes(marker));
    assert.ok(snippet, `${doc} 没有找到要验证的教学代码块`);
    const fixture = readFileSync(file, "utf8");
    assert.ok(fixture.trimEnd().endsWith(snippet.trimEnd()), `${file} 已经与书中示例不一致`);
  });
}

test("P1 文章不会再把 ES11 草案当成当前版本", () => {
  const text = readFileSync("1/1.1.1.md", "utf8");
  assert.match(text, /ECMAScript 2026 已正式发布/);
  assert.doesNotMatch(text, /截止本书编写时，ES 11的提案已经定稿了/);
});

test("P1 HTTP 章节引用当前三份关键规范", () => {
  const text = readFileSync("1/1.5.3.md", "utf8");
  for (const name of ["RFC 9113", "RFC 9218", "RFC 9114"]) {
    assert.ok(text.includes(name), `${name} 不见了`);
  }
});
