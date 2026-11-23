# 《前端内参》怎么做自动质检？

写技术书，最怕的不是写慢了，而是读者照着书里一段代码敲，结果根本跑不通；或者点开链接，迎面一个404。

所以我给本书加了两种检查：**代码检查**和**链接检查**。它们不能替我判断所有技术观点是否正确，但至少能替我拦住一批很低级、又特别伤读者信任的问题。

## 01. 我到底检查什么？

1. **JavaScript 回归**：用 Node.js 运行重要章节的示例，看看实际输出是否与文章一致。
2. **TypeScript 检查**：用固定版本的 TypeScript 7.0.2 编译三篇实战样章的代码。改动导致类型报错，就不能装作什么都没发生。
3. **本地链接检查**：逐篇扫描 Markdown。文件已经不在了、路径写错了，直接报出来。特别处理中文、空格编码、括号文件名等情况。
4. **外部链接巡检**：检查引用的网站是否仍然能访问。注意，403、429和超时可能是反爬、限流或网络问题，**不能直接算成404**。

外链巡检不会直接删除任何链接；要不要改，必须先确认真的失效、有没有可信的新地址。

## 02. 怎么在电脑上手动运行？

在仓库根目录运行这些命令，要求 Node.js 22 或更新版本：

```bash
npm install --no-package-lock --ignore-scripts
npm run test:examples
npm run typecheck
npm run test:links -- --json reports/book-links.json
node scripts/check-external-links.mjs --json reports/external-links.json
```

看到什么结果意味着什么？

- **示例测试全绿**：已覆盖的那些示例通过了，不等于全书每行代码都验证过。
- **TypeScript 编译成功**：当前测试文件可通过 TypeScript 7.0.2，不能证明浏览器运行时数据一定正确。
- **本地失效路径为0**：书中扫描到的本地文件路径都能在仓库中找到。
- **外链结果 ok**：这次请求访问成功。
- **外链结果 broken**：GET核实仍返回404或410，应优先人工复核。
- **外链结果 unverified**：网站拒绝机器人或请求超时，暂时不能判断死活。别瞎删。

**扫描不等于验收一切。** 这套程序不验证 GitBook 页面实际排版、图片版权、网页内容是否仍然正确，也不能替读者判断一条技术解释有没有误导性。

## 03. GitHub Actions 为什么没有开始运行？

仓库目前已经有工作流文件：

- [前端内参内容检查](.github/workflows/p0-regressions.yml)，每次正常提交或 PR 后检查，也支持手动运行。
- [每周外链巡检](.github/workflows/external-links.yml)，计划每周一检查一次，也支持手动运行。

如果在 GitHub 的 Actions 页面看不到运行记录，**先别说“测试通过”，也别急着认定是代码写错了**。可能是仓库没有启用 Actions、某个工作流被禁用，或提交事件没有触发工作流。必须查看仓库设置和 Actions 页面才知道具体原因。

管理员可以按下面步骤确认：

1. 打开仓库 [Actions 页面](https://github.com/coffe1891/frontend-hard-mode-interview/actions)。如果提示工作流被禁用，按页面提示启用。
2. 如果整个 Actions 功能未开启，到仓库 **Settings → Actions → General** 检查是否允许执行 GitHub Actions，并确保允许使用 GitHub 官方的 checkout、setup-node、upload-artifact。
3. 回到 Actions，选择 **前端内参内容检查 → Run workflow → master → Run workflow**。等页面出现实际执行记录，检查三个主要步骤是否通过。
4. 再选择 **每周外链巡检 → Run workflow**。在运行完成后的 Artifacts 里取回报告，人工核实 broken 和 unverified。

> **注意：** 我们目前只能确认工作流文件已经提交，不能仅凭仓库没有执行记录就断言管理员关掉了什么设置。仓库管理员需要在 GitHub 上检查权限与开关。

## 04. 为什么旧图改成 Mermaid 了？

原书有16张教学配图放在知乎、第三方图床。这样做省事，但图床一旦清理文件，书里就会出现空白。

我把它们根据正文的讲解重新整理成 GitBook 支持的 **Mermaid 图表或可直接阅读的代码示例**。Mermaid 的优点是：图片随文章一起保存，流程变了，改几行字就能更新图。

**这不是声称把别人的图片原样下载备份。** 原图无法可靠获取或确认授权时，不应该随便把它复制进仓库。README 中显示 Star 数量的动态图标除外，那类图片本来就需要在线生成，不属于教学插图。

说明：[GitBook 官方 Mermaid 写作规范](https://github.com/GitbookIO/skills/blob/main/skills/gitbook-write/SKILL.md)。

## 05. 每次更新文章，究竟怎么做？

最省心的顺序就是：**先改正文 → 自己运行关键代码 → 看自动检查 → 检查 GitBook 排版 → 合并**。

看到红叉不要怕，能被自动发现的错误，总比几万读者看了才发现要便宜得多。
