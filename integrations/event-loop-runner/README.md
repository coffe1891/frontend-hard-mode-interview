# Event Loop 文章内运行区（单题验收）

当前状态（2026-11-23）：私有集成已发布到 coffe1891 组织并安装到《前端内参》Space；真实 GitBook PR 预览的桌面与 390px 手机宽度交互验收已通过。合并后仍需核对正式文章、Pages 和 CI。

## 实现与范围

- `1/1.2.8.md` 仅把原面试题的 `javascript` 围栏改为 `js-run`，原代码、注释与讲解完全保留，不新增重复题目。
- manifest 的 `markdown.codeblock: js-run` 与 `body: content` 把原文传给 ContentKit 的 `eventloop-runner`。
- `webframe` 使用 GitBook 官方 `publicContentEndpoint`，通过集成 HTTP handler 提供 HTML、脚本和 Worker。构建时直接读取 `docs/labs/event-loop/` 的现有文件，不另维护第二份运行器。
- 因此可在合并 master 前测试完整候选版本，无需提前切换 Pages 发布分支。
- 运行器发送 `@webframe.ready` 与 `@webframe.resize`，按线上协议以 `action.size` 传递实际宽高（官方 Webframe 示例当前缺少这一层，直接照抄会导致 GitBook 页面异常）；默认比例为手机端预留高度。
- README 原版封面、其他章节与 Pages 发布设置不变。

## 本机与 CI 检查

Node.js 22 或更新版本，在本目录执行：

```powershell
npm ci --ignore-scripts
npm run check
npm test
```

`check` 先生成忽略提交的 `.build/assets.ts`，再运行 TypeScript 与官方 `gitbook integration check`。测试会实际编译、调用 ContentKit render，验证原题传参、默认输出、manifest 映射和资源响应。仓库 CI 同时运行这些检查。

## 发布与安装

组织 ID 已通过 GitBook 后台确认，manifest 只申请 `scopes: []`，私有安装。

使用 GitBook 官方开发者凭据在本机认证；不要将凭据发到聊天、提交到仓库或写进命令示例。浏览器 CLI 登录不能替代集成发布所需的个人凭据。

```powershell
# 在本机交互输入凭据
npx gitbook auth
npm run publish
```

安装入口：
https://app.gitbook.com/o/-LnmMrXLnmjAIoQY6UW2/settings/integrations/frontend-neican-code-runner

仅安装到《前端内参》Space。发布组件不代表原文章已上线；需要重新导入 PR 的 Git Sync 候选内容，再验证预览。

## 合并门槛

- [x] 确认安装到正确 Space，Git Sync 将 `js-run` 转为组件。
- [x] 在 GitBook 文章预览中只出现一份原题，其他原文保留。
- [x] 桌面与手机宽度下编辑器、运行按钮、输出区域完整显示。
- [x] 原题输出 `2、4、3、1`；修改后重跑输出变化；重置恢复 Markdown 原题。
- [ ] CI 与 GitBook 候选构建通过后才合并 master，再检查 Pages 和正式文章。
- [ ] 验收结束撤销临时发布凭据，并清理本机临时认证。

## 官方依据

- https://gitbook.com/docs/developers/integrations/guides/markdown
- https://gitbook.com/docs/developers/integrations/configurations
- https://gitbook.com/docs/developers/integrations/development/contentkit/component-reference/webframe
- https://gitbook.com/docs/developers/integrations/quickstart

基础 JS 在访客浏览器的 Web Worker 中执行，没有 DOM；支持 Promise、queueMicrotask 和 setTimeout。该教学运行器不能作为任意第三方代码的安全沙箱。
