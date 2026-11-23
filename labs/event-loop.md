# Event Loop 互动实验室：别背答案，动手跑一遍

学 Event Loop 最怕什么？不是记不住“宏任务、微任务”两个词，而是觉得自己会了，换一道题又猜错。

我在《前端内参》里加了一个动手实验室。你不需要安装 Node.js，不用注册账号，打开网页就能做四道题。

**[打开 Event Loop 互动实验室（GitHub Pages）](https://coffe1891.github.io/frontend-hard-mode-interview/labs/event-loop/)**

> 如果上面的在线页面打不开，可能是本仓库尚未启用 GitHub Pages。这个实验室的所有源代码都在 [docs/labs/event-loop](https://github.com/coffe1891/frontend-hard-mode-interview/tree/master/docs/labs/event-loop)。管理员只需在 [Settings → Pages](https://github.com/coffe1891/frontend-hard-mode-interview/settings/pages) 选择 **Deploy from a branch → master → /docs → Save**，即可发布。具体步骤见项目目录下的 README。

## 你要做的四件事

1. **先预测。** 读一下代码，把 `console.log` 的输出顺序填进去。别一上来就点运行，先逼自己想一遍。
2. **再看动画。** 点击“下一步”，看当前代码的调用栈、微任务队列、定时器任务队列如何变化。也可以自动播放、暂停、后退。
3. **自己改代码。** 在编辑器里新增、删除或调整 `Promise.then`、`queueMicrotask`、`setTimeout`，点击“运行当前代码”，比较新的实际输出。
4. **挑战面试题。** 第四题让微任务与定时器互相嵌套，别看答案，先猜再验。

## 三句话，避免学歪

**第一，动画不是浏览器内部的录屏。** 它是为了教学而做的简化 Event Loop 模型，只对应四道内置题。你改了编辑器里的代码，动画不会自动重新分析任意 JavaScript；改动的效果请看实际运行输出。

**第二，真实代码在你浏览器里的 Web Worker 执行。** 不上传服务器，不会访问文章的 DOM，也不会修改 GitBook 页面。程序只收集一小段时间里的 `console.log`，执行太久会被终止；因此不适合调试 DOM 操作、网络请求或长时间定时器。

**第三，`setTimeout(fn, 0)` 不是马上执行。** 这个实验把零延迟定时器当作“下一轮可执行的计时器任务”来演示，不能据此推断浏览器所有任务源之间的调度顺序和实际渲染时机。

参考：[WHATWG HTML Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)、[MDN Microtask guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)。

原理文章：[《壹.2.8 Event Loop》](../1/1.2.8.md)。
