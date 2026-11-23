# 单题浏览器验收记录

日期：2026-11-23。组件版本：3。安装目标：coffe1891 / 前端内参，Space `-LnlixiOMXyluGpXDGGs`。仅安装到该 Space，集成权限为空。

## 真实 GitBook 预览

https://coffe1891.gitbook.io/frontend-hard-mode-interview/~/revisions/C9s97jiXtls4hqhmD26E/id-1/2.-he-xin-gai-nian/1.2.8#yi-.2.8.6-mian-shi-ti-jie-xi

- 原静态题目已由交互组件取代，仅一份题目；原注释及后续讲解保留。
- 桌面 Chrome：原题输出 2 / 4 / 3 / 1；将 4 改为 40 后输出 2 / 40 / 3 / 1；重置后编辑器内容与 Markdown 原题逐字一致。
- Chrome 响应式视口 390 × 844（手机宽度模拟，未使用实体手机）：原题输出 2 / 4 / 3 / 1；将 4 改为 41 后输出 2 / 41 / 3 / 1；重置内容与原题一致，重跑恢复原顺序。
- 手机宽度下 iframe 为 343 × 555，按钮、输出和说明完整显示。编辑器保留自身垂直滚动以显示长题目。
- `@webframe.resize` 必须使用 `{ action: { action: '@webframe.resize', size: { aspectRatio, height } } }`。已依据真实 GitBook 线上渲染器验证并加入执行脚本的回归测试；直接使用当前 Webframe 文档中的扁平尺寸示例会触发 `aspectRatio` 异常。

## 自动检查

- 仓库 27 项示例/回归测试通过。
- 集成 4 项真实构建、render、manifest 和资源响应测试通过。
- TypeScript 与 GitBook 官方 `integration check` 通过。
- 全书站内链接检查通过（124 个 Markdown，0 个本地失效路径）。
- 首次修复提交 `50b0750` 的 Actions 与两个 GitBook 状态均成功；最终修复提交须再次通过 CI 后才合并。

原书内容与 master 相比仅修改 `1/1.2.8.md` 一处围栏语言，README 封面和其他章节未改动。组件从现有 Pages 源码生成并提供同版本运行资源，因此可先验收、后合并，不需要提前改变 Pages 发布来源。
