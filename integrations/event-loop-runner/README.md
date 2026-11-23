# 《前端内参》GitBook 原生可运行代码块：单题试验

当前状态：**源码已准备，尚未在 GitBook 组织发布和安装**。这和此前普通 Markdown 的 \`{% embed %}\` 完全不同。官方文档明确指出不支持的网址会回退成普通链接；这次使用 GitBook ContentKit 的 \`webframe\` 注册一个正式区块。

官方资料：
- [Custom blocks + ContentKit](https://gitbook.com/docs/developers/integrations/development/contentkit)
- [Git Sync Markdown codeblock 映射](https://gitbook.com/docs/developers/integrations/guides/markdown)
- [GitBook CLI 新建/认证/发布](https://gitbook.com/docs/developers/integrations/quickstart)

## 先进行一次安装配置（管理员操作）

你需要在 GitBook 账号拥有《前端内参》Space 的管理权限，并能发布组织自己的 integration。

1. 打开 https://app.gitbook.com/account/developer 在个人账号里创建 GitBook Developer Token。**不要发送 token 到聊天窗口，也不要写进 GitHub。**
2. 打开 GitBook 组织的 Settings，找到组织 ID 或 subdomain。编辑本目录的 \`gitbook-manifest.yaml\`，将 \`organization: REPLACE_WITH_GITBOOK_ORGANIZATION\` 改为真实值。
3. 在本目录使用 Node.js 18+ 执行命令：

\`\`\`bash
npm install @gitbook/cli -g
npm install
gitbook auth
gitbook integration check
gitbook integration publish
\`\`\`

CLI 会给出安装链接。通过它把 integration 安装进《前端内参》使用的那个 Space。只用私人安装范围 \`visibility: private\`，不需要上架公开 Marketplace。

> 只有 **发布并安装 integration** 后，GitBook 才会认识下面这种代码围栏。单纯提交本目录的源码不会让 GitBook 自动启用组件。

## 单题预览（安装后）

在原文章 \`1/1.2.8.md\` 的面试题后加入下面的 Markdown：

\`\`\`\`markdown
\`\`\`js-run
setTimeout(function() {
  console.log(1);
}, 0);
new Promise(function(resolve) {
  console.log(2);
  resolve(3);
}).then(function(val) {
  console.log(val);
});
console.log(4);
\`\`\`
\`\`\`\`

Git Sync 导入后，GitBook 会将 \`js-run\` 围栏映射为本 integration 的 \`eventloop-runner\` 区块。区块的代码传入同一个已部署的 Web Worker 运行器。读者在文章内点击「运行代码」，不必跳页。

**注意：** 这是由 GitBook integration 提供的 iframe 承载的编辑器，和把任意 \`<iframe>\` 直接塞到 Markdown 完全不同。

## 验收清单

- [ ] GitBook 发布并安装成功，编辑器中能找到「JavaScript · 运行代码」组件。
- [ ] \`js-run\` 在 Git Sync 预览中成为可编辑代码框，而不是普通代码或外链卡片。
- [ ] 点击运行输出依次为 \`2 / 4 / 3 / 1\`。
- [ ] 修改 \`console.log(4)\` 后再次运行，结果变化。
- [ ] 重置恢复 Markdown 给出的原题。
- [ ] 手机端能看到完整按钮和输出，不发生明显裁切。

只有通过上述手动验收，才将单题试验合并，其他章节先不铺开。

## 技术边界

GitBook 自定义 block 由官方运行时渲染，网页只负责承载编辑器；运行 JS 的是浏览器的独立 Web Worker。**不能当作任意第三方 JS 的安全沙箱**，也无法运行 \`document\`、\`window\`、页面绘制等浏览器 UI 代码。该实验只用于访客手动编辑的基础 JS Event Loop 题。
