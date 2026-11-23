import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { extractLinks, normalizeTarget, audit } from "../scripts/check-doc-links.mjs";

test("中文路径、编码空格与括号不能被误判为坏链", () => {
  const root = mkdtempSync(join(tmpdir(), "book-links-"));
  try {
    mkdirSync(join(root, ".gitbook", "assets"), { recursive: true });
    mkdirSync(join(root, "1"), { recursive: true });
    writeFileSync(join(root, ".gitbook", "assets", "image (1).png"), "fixture");
    writeFileSync(join(root, "1", "page.md"),
      "[图片](../.gitbook/assets/image%20%281%29.png)\n"
      + "[坏链](missing.md)\n"
      + "![配图](../.gitbook/assets/image%20%281%29.png)\n");
    const found = audit(root);
    assert.equal(found.broken.length, 1);
    assert.equal(found.broken[0].target, "missing.md");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("嵌套括号、HTML、引用定义、代码块有不同的解析规则", () => {
  const backtick = String.fromCharCode(96);
  const raw = [
    "[a](a(b).md)",
    '<img src="images/hello.svg">',
    "[ref]: docs/start.md",
    backtick.repeat(3) + "markdown",
    "[fake](absent.md)",
    backtick.repeat(3),
    backtick + "[ignore](nope.md)" + backtick,
  ].join("\n");
  const targets = extractLinks(raw).map(x => x.target);
  assert.ok(targets.includes("a(b).md"));
  assert.ok(targets.includes("images/hello.svg"));
  assert.ok(targets.includes("docs/start.md"));
  assert.ok(!targets.includes("absent.md"));
  assert.ok(!targets.includes("nope.md"));
});

test("格式不合法的百分号编码必须报告而不是静默通过", () => {
  const result = normalizeTarget("/tmp/chapter.md", "img%FF.png", "/tmp");
  assert.equal(result.type, "invalid");
});
