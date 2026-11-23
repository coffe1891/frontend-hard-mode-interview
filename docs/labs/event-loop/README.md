# Event Loop 互动实验室

这不是视频，也不是一张只会动的 GIF。这是纯前端页面，读者能预测、点步骤、编辑 JS 并运行。

- **入口：** `docs/labs/event-loop/index.html`
- **页面逻辑：** `app.js`、`style.css`
- **内置题的教学模型：** `engine.mjs`（可用 Node.js 做单元测试）
- **真实执行：** `runner-worker.js`（本地 Web Worker，最长约2.5秒）
- **测试：** `tests/event-loop-lab.test.mjs`

## 发布到 GitHub Pages

一次性设置：仓库管理员打开 [Settings → Pages](https://github.com/coffe1891/frontend-hard-mode-interview/settings/pages)，在 **Build and deployment** 里选择 **Deploy from a branch**，Branch 选 `master`，Folder 选 `/docs`，保存。

成功后访问：

https://coffe1891.github.io/frontend-hard-mode-interview/labs/event-loop/

本项目已经放好 `docs/index.html` 和 `.nojekyll`，不需要 React、Vue、打包器、数据库，也不依赖第三方 CDN。此设置是 Pages 托管网站所必需的，**仅把静态文件提交到仓库，不代表 Pages 已经开启**。

## 本地预览

在仓库根目录执行：

```bash
python -m http.server 8000 --directory docs
```

然后打开 http://localhost:8000/labs/event-loop/ 。需要使用 HTTP server，因为浏览器对 `file://` 下 ES modules 和 Web Worker 有限制。

## 运行测试

```bash
npm run test:examples
npm run typecheck
node --check docs/labs/event-loop/app.js
node --check docs/labs/event-loop/runner-worker.js
```

## 知识边界

图形里的“Call Stack”是教学模型的状态显示，**不是** Chrome DevTools 的真实运行时采样。模型针对内置案例，模拟单脚本任务、Promise reaction / `queueMicrotask` 和零延迟定时器；没有模拟完整 HTML task source / event loop 调度 / rendering / nested timer clamping。

编辑器里的代码在 Web Worker 中运行，**没有 `document` / `window`**，所以适用于观察 JS 任务执行顺序，不适用于 DOM 与绘制行为；`console.log` 仅记录前200行和约1.2秒的回调。

如果以后扩展到浏览器真实调用栈追踪，应单独引入经过审查的插桩工具，不要误导读者把本图当作自动检测结果。
