# 前端内参

[![&#x652F;&#x6301;&#x6211;](https://img.shields.io/github/stars/coffe1891/frontend-hard-mode-interview?style=social)](https://github.com/coffe1891/frontend-hard-mode-interview/)

> [!IMPORTANT]
> ### 📖 读《前端内参》，强烈推荐 GitBook 在线版
>
> **👉 [立即打开 GitBook，开始阅读《前端内参》](https://coffe1891.gitbook.io/frontend-hard-mode-interview/)**
>
> **GitHub 适合看源码，GitBook 才更适合读书。** 想从头到尾认真学一遍，建议直接去 GitBook，别在一长串 Markdown 文件里来回翻。
>
> - **找知识更方便：** 章节导航清清楚楚，想看哪一节直接点，不用翻半天目录。
> - **读起来更舒服：** 文字、配图、代码块排版更适合连续阅读，电脑和手机都能看。
> - **不只看，还能动手：** 部分章节配套互动实验。比如 [Event Loop](https://coffe1891.gitbook.io/frontend-hard-mode-interview/id-1/2.-he-xin-gai-nian/1.2.8)，可以先猜执行结果，再通过实验室观察流程、修改 JavaScript 并运行验证。
>
> **[📚 去 GitBook 读完整本书](https://coffe1891.gitbook.io/frontend-hard-mode-interview/) · [🧪 先看看 Event Loop 互动实验](https://coffe1891.gitbook.io/frontend-hard-mode-interview/id-1/2.-he-xin-gai-nian/1.2.8)**
>
> *说明：互动实验目前只覆盖部分内容，需要从相应章节打开配套实验室，并非所有示例都能在线调试。GitHub 继续用于查看源码、提问题和参与完善本书。*

> ### 🚀 2026 年《前端内参》重磅更新｜AI 时代，前端还值得干吗？
>
> **AI 一句话就能写页面，工作多年的前端工程师，以后靠什么吃饭？**
>
> **[新文章：《AI 时代，前端工程师还有出路吗？我给你五条能走的路》](10/10.3.md)**：不灌鸡汤，讲清五条转型路线、不同经验阶段怎么选，还有一份能照着做的 **90 天实战计划**。
>
> **[新展望：《2026 前端技术展望：走向 2027 年》](10/10.2.md)**：React、Vue、TypeScript、AI 编程，哪些值得学？哪些没必要跟风？
>
> 本书正在持续修订旧章节、补充原理配图、纠正技术错误。**更新日期：2026-11-23。**
>
> **[🧪 新功能：Event Loop 互动实验室](labs/event-loop.md)**：先预测，再看调用栈和任务队列一步一步变化，还可以直接修改 JavaScript 运行验证。

![《前端内参》原版月球横版封面](.gitbook/assets/cover20200619.jpg)

【📖 GitBook 在线阅读（推荐）】[打开《前端内参》交互阅读版](https://coffe1891.gitbook.io/frontend-hard-mode-interview/)  
【技术交流与建议】[GitHub Discussions](https://github.com/coffe1891/frontend-hard-mode-interview/discussions)  
【勘误与问题反馈】[GitHub Issues](https://github.com/coffe1891/frontend-hard-mode-interview/issues)

如果觉得有帮助请点右上角的**Star**支持我不断更新。

> 1. 本书较多着笔于深层理论上的论述，辅有代码示例，适合至少三年前端工作经验的朋友阅读。
> 2. 建议通过上方 GitBook 入口阅读：导航、配图和手机排版更适合连续学习；部分代码题另有配套互动实验，可跳转运行验证。
> 3. 如果图片显示不了，不必无意义地刷新几十遍。请附上文章地址、图片位置、浏览器信息，到 [GitHub Issues](https://github.com/coffe1891/frontend-hard-mode-interview/issues) 反馈。我会优先修复失效的图片引用。

前端技术日新月异，我也在不断学习，因此疏漏之处在所难免，欢迎朋友随时[@提建议](https://github.com/coffe1891/frontend-hard-mode-interview/discussions)，我将及时改进。

## 前言

如何在Hard模式下通过一线互联网公司的面试？相信很多程序员朋友都有过这个困扰。其实答案很简单：**首先应努力成为一个好程序员，然后入职一线互联网公司只是顺路的事**。

然后有前端朋友可能会吐槽：“前端知识已经爆炸，今天这个框架明天那个库的，天天有新玩意儿，我实在学不动了！”是的，前端知识早已大爆炸，新东西层出不穷，如果只是靠蛮力一样一样地去学习，那么连笔者我也学不动了。那怎么办呢？别慌，其实前端学习是有窍门的。本书归纳了前端的核心知识点，如果你能日拱一卒地坚持学习，系统地掌握这些知识点之后，相信很快也能和我一样可以做到以不变应万变，以小变应大变，并对新的前端知识很快地领悟吃透！

→ [更多前言 · 写给有缘人](0.0.1.md)

## 目录

### 零、准备Hard模式下的面试

1. 一线互联网公司面试前的准备
   * [一线互联网公司有什么不同？](0/0.1.1.md)
   * [该公司是做什么的、实力、前景、口碑怎样？](0/0.1.2.md)
   * [该岗位负责做什么、上升空间多大？](0/0.1.3.md)
   * [准备一份好的简历？](0/0.1.4.md)
   * [不卑不亢、不疾不徐地说话](0/0.1.5.md)
   * ["有什么问题要问我吗"、如何回答？](0/0.1.6.md)

### 壹、前端之灵：JavaScript/ECMAScript

1. 你需要知道的新东西
   * [新版 ECMAScript 特性分析？](1/1.1.1.md)
   * [JavaScript 的未来](1/1.1.2.md)
2. 核心概念
   * [函数](1/1.2.1.md)
   * [作用域、执行上下文、作用域链](1/1.2.2.md)
   * [彻底搞懂 this](1/1.2.3.md)
   * [深入理解 call、apply、bind](1/1.2.4.md)
   * [面试时高频问到的"闭包"](1/1.2.5.md)
   * [原型、原型链](1/1.2.6.md)
   * [同步、异步，阻塞、非阻塞](1/1.2.7.md)
   * [Event Loop](1/1.2.8.md)
   * [强大的数组](1/1.2.9.md)
   * [正则表达式](1/1.2.10.md)
   * [位操作符、进制转换](1/1.2.11.md)
   * [rest、spread操作符](1/1.2.12.md)
   * [实现异步非阻塞的任务](1/1.2.13.md)
   * [模块化开发](1/1.2.14.md)
3. 其他知识点
   * [深拷贝、浅拷贝](1/1.3.1.md)
   * [JavaScript函数柯里化](1/1.3.2.md)
   * [JavaScript元编程：Proxy、Reflect](1/1.3.3.md)
   * [JavaScript中的进程、线程、协程](1/1.3.4.md)
4. 浏览器、V8引擎
   * [网页被浏览器绘制出来的过程](1/1.4.1.md)
   * [页面重排（Reflow）、重绘（Repaint）](1/1.4.2.md)
   * [DOM、Shadow DOM、Virtual DOM](1/1.4.3.md)
   * [V8引擎是如何工作的？](1/1.4.4.md)
   * [V8引擎内存管理、垃圾回收机制](1/1.4.5.md)
5. 相关后端知识、通信协议、安全
   * [为什么需要服务器端 JavaScript：Node.js？](1/1.5.1.md)
   * [了解TCP、UDP、TLS](1/1.5.2.md)
   * [HTTP协议几个版本的区别？](1/1.5.3.md)
   * [HTTP、HTTPS的区别在哪里？](1/1.5.4.md)
   * [XSS、CSRF攻击](1/1.5.5.md)
   * [HTTP 缓存：强缓存与协商缓存](1/1.5.6.md)
6. 书籍推荐
   * [你读过哪些JavaScript书籍](https://www.zhihu.com/question/19562698/answer/89480175) _`外链`_

### 贰、[数据结构与算法](2/2.0.md)

1. 面试时高频率出现的算法
   * [十大排序算法](2/2.1.1.md)
   * [链表](2/2.1.2.md)
   * [单调栈](2/2.1.3.md)
   * [二叉树的遍历](2/2.1.4.md)
   * [实战：字节跳动前端面试2道算法题](2/2.1.5.md)
   * [分治法、动态规划、贪心算法的区别](2/2.1.6.md)
   * [实战：阿里巴巴前端面试算法题](2/2.1.7.md)
2. 其他经典算法
   * [尾递归：面试官问你斐波那契数列的时候不要太高兴](https://zhuanlan.zhihu.com/p/54378423) _`外链`_
3. 好书推荐
   * [《学习JavaScript数据结构与算法》](https://book.douban.com/subject/27129352/) _`外链`_

### 叁、主流框架/库

1. 综合比较
   * [jQuery过时了吗？](3/3.1.1.md)
   * [React、Vue、Angular对比](3/3.1.2.md)
2. React
   * [React Hooks究竟是什么？](3/3.2.1.md)
   * [React 的性能优化技巧](3/3.2.2.md)
3. Vue.js
   * [Vue.js 源码解读：数据响应式原理](3/3.3.1.md)
   * [Vue.js 带来的新问题与解决办法](3/3.3.2.md)
4. Angular
   * [你真的懂 Angular 吗？](3/3.4.1.md)
   * [Angular 性能优化要点](3/3.4.2.md)
5. Flutter
   * [Flutter 给前端研发带来的变化](3/3.5.1.md)
   * [Dart：为什么 Flutter 选择它？](3/3.5.2.md)
6. 好书推荐
   * [《深入浅出Vue.js》](https://book.douban.com/subject/32581281/) _`外链`_
   * [《深入React技术栈》](https://book.douban.com/subject/26918038/) _`外链`_

### 肆、必会的工具

1. Webpack——自动打包模块工具
   * [深入理解Webpack打包](4/si-.1.1-shen-ru-li-jie-webpack-da-bao.md)
   * [常用前端脚手架](4/4.1.2.md) 
2. API文档管理
   * [用 Swagger / OpenAPI 管理接口](4/4.2.1-swagger.md)
   * [Easydoc 等在线接口文档工具](4/4.2.2-easydoc.md)
3. IDE——工欲善其事必先利其器
   * [高效使用 VS Code 的十点建议](4/4.3.1.md)
   * [适用于前端开发者的 20 个 VS Code 插件](4/4.3.2.md)
   * [Sublime Text 还有必要学习吗？](4/4.3.3.md)

### 伍、编程范式

1. 面向对象编程（OOP）
   * [面向对象、面向过程有什么区别？](5/5.1.1.md)
   * [面向对象编程的弊端](5/5.1.2.md)
   * [重新认识JavaScript面向对象：继承](5/5.1.3.md) 
   * [彻底搞懂泛型](5/5.1.4.md)
   * [用JavaScript实现抽象类](5/5.1.5.md)
   * [用JavaScript实现接口](5/5.1.6.md)
2. 函数式编程
   * [什么是函数式编程？](5/5.2.1.md)
   * [JavaScript的函数式编程探索](5/5.2.2.md)
   * [Pointfree无参数风格编程](5/5.2.3.md)
3. 响应式编程
   * [什么是响应式编程？](5/5.3.1.md)
   * [RxJS](5/5.3.2.md)

### 陆、软件设计的原则

1. [导读：SOLID](6/6.1.0.md)
   * [单一职责原则](6/6.1.1.md)
   * [接口隔离原则](6/6.1.2.md)
   * [开放封闭原则](6/6.1.3.md)
   * [里氏替换原则](6/6.1.4.md)
   * [依赖倒置原则](6/6.1.5.md)
2. 好书推荐
   * [《重构》](https://book.douban.com/subject/4262627/) _`外链`_

### 柒、设计模式和软件工程

1. 十五种经典设计模式
   * [单例模式](7/7.1.1.md)
   * [策略模式](7/7.1.2.md)
   * [代理模式](7/7.1.3.md)
   * [迭代器模式](7/7.1.4.md)
   * [发布-订阅模式](7/7.1.5.md)
   * [命令模式](7/7.1.6.md)
   * [组合模式](7/7.1.7.md)
   * [模板方法模式](7/7.1.8.md)
   * [享元模式](7/7.1.9.md)
   * [职责链模式](7/7.1.10.md)
   * [中介者模式](7/7.1.11.md)
   * [装饰者模式](7/7.1.12.md)
   * [状态模式](7/7.1.13.md)
   * [适配器模式](7/7.1.14.md)
   * [门面模式（Facade）](7/7.1.15.md)
2. 浅谈软件工程：MVC、MVP、MVVM
   * [MVC的前世今生](7/7.2.1.md)
   * [MVP 又是什么？](7/7.2.2.md)
   * [为什么还要 MVVM？](7/7.2.3.md)

### 捌、TypeScript 实战与好网站

**新增 TypeScript 试读三篇：**

1. [TS.1 类型系统能替你挡住多少 Bug？](8/8.1.md)
2. [TS.2 别让五个布尔值把页面状态搞乱](8/8.2.md)
3. [TS.3 泛型：AI 写得快，你得知道哪里会出错](8/8.3.md)

**常用网站：**

1. [中文站-Mozilla大宝库](https://developer.mozilla.org/zh-CN/docs/Web) _`外链`_ 最全的Web相关参考文档，没有之一
2. [英文站-StackOverflow](https://stackoverflow.com/) _`外链`_ 掌握了四级英语就能向老外提问交流了，解决疑难杂症必上
3. [Vue.js 官方中文文档](https://cn.vuejs.org/guide/introduction.html) _`外链`_ 看 Vue 3 的用法，建议以官方文档为准
4. [英文-Vue资源大全](https://github.com/vuejs/awesome-vue) _`外链`_ 超级多的资源，总能找到你喜欢的那款

### 玖、前端团队与人物（历史资料）

1. [一线互联网公司官方前端公众号](9/9.1.md)
2. [知名前端人物](9/9.2.md)

### 拾、后记

1. [成为一个好的程序员远比找份好工作重要](10/10.1.md)
2. [2026 前端技术展望：走向 2027 年](10/10.2.md)
3. [AI 时代，前端工程师还有出路吗？五条路线与 90 天实战计划](10/10.3.md)

## 交流与合作

![](.gitbook/assets/makai_greatwall.png)

**技术讨论、读者提问：** 请到 [GitHub Discussions](https://github.com/coffe1891/frontend-hard-mode-interview/discussions) 公开交流。发现书中错误，请提交 [GitHub Issues](https://github.com/coffe1891/frontend-hard-mode-interview/issues)，这样其他读者也能看到解决过程。

**商务合作：** 可以通过微信 `GZKXS1891` 简单说明来意（请注明“前端内参·商务合作”）。

**原 QQ 交流群：** `308689488`（技术问题建议优先在 Discussions 提问，方便留档和检索）。

[作者 GitHub 主页](https://github.com/coffe1891)

## 版权许可

[![](.gitbook/assets/copyright.png)](http://creativecommons.org/licenses/by-nc/4.0/)

本作品采用[知识共享署名-非商业性使用 4.0 国际许可协议](http://creativecommons.org/licenses/by-nc/4.0/)进行许可，只要保持原作者署名、非商用，您可以自由地阅读、分享、修改本书。

## Star History
> 如果这个项目对你有帮助，⭐以表示支持 

[![Star History Chart](https://api.star-history.com/svg?repos=coffe1891/frontend-hard-mode-interview&type=Date)](https://star-history.com/#coffe1891/frontend-hard-mode-interview&Date)