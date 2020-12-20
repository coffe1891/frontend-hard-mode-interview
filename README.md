# 前端内参

[![&#x652F;&#x6301;&#x6211;](https://img.shields.io/github/stars/coffe1891/frontend-hard-mode-interview?style=social)](https://github.com/coffe1891/frontend-hard-mode-interview/)

![&#x5C01;&#x9762;](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfyj8fmwm1j30zk0hs770.jpg)

【阅 读 本 书】[https://coffe1891.gitbook.io/frontend-hard-mode-interview](https://coffe1891.gitbook.io/frontend-hard-mode-interview/)  
【讨论本书】[https://github.com/coffe1891/frontend-hard-mode-interview/discussions](https://github.com/coffe1891/frontend-hard-mode-interview/discussions)  
【作者微信】coffe1891-mk（请注明 “前端内参”）  
【QQ交流群】308689488（也可以扫上图二维码）

如果觉得有帮助请点右上角的**Star**支持我不断更新。

> 1. 本书较多着笔于深层理论上的论述，辅有代码示例，适合至少三年前端工作经验的朋友阅读。
> 2. 尽量访问上面的gitbook地址，导航更清晰，图片也不会出现显示错位，并且支持手机模式；
> 3. 如果书里文章的图片显示不了，开科学上网工具、或者多刷几遍就好。

前端技术日新月异，我也在不断学习，因此疏漏之处在所难免，欢迎朋友随时[@提建议](https://github.com/coffe1891/frontend-hard-mode-interview/discussions)，我将及时改进；

## 前言

如何在Hard模式下通过一线互联网公司的面试？相信很多程序员朋友都有过这个困扰。其实答案很简单：**首先应努力成为一个好程序员，然后入职一线互联网公司只是顺路的事**。

然后有前端朋友可能会吐槽：“前端知识已经爆炸，今天这个框架明天那个库的，天天有新玩意儿，我实在学不动了！”是的，前端知识早已大爆炸，新东西层出不穷，如果只是靠蛮力一样一样地去学习，那么连笔者我也学不动了 。那怎么办呢？别慌，其实前端学习是有窍门的。本书归纳了前端的核心知识点，如果你能日拱一卒地坚持学习，系统地掌握这些知识点之后，相信很快也能和我一样可以做到以不变应万变，以小变应大变，并对新的前端知识很快地领悟吃透！

→ [更多前言 · 写给有缘人](0.0.1.md)

## 目录

### 零、准备Hard模式下的面试

1. 一线互联网公司面试前的准备
   * [一线互联网公司有什么不同？](0/0.1.1.md)
   * [该公司是做什么的，实力、前景、口碑怎样？](0/0.1.2.md)
   * 该岗位负责做什么的，岗位所属部门在什么位置，上升空间多大？
   * [准备一份好的简历](0/0.1.4.md)
   * [不卑不亢、不疾不徐地说话](0/0.1.5.md)
   * [“有什么问题要问我吗”，如何回答？](0/0.1.6.md)

### 壹、前端之灵：JavaScript/ECMAScript

1. 你需要知道的新东西 
   * [新版 ECMAScript 特性分析](1/1.1.1.md)
   * JavaScript的未来
2. 核心概念
   * [函数](1/1.2.1.md)
   * [作用域、执行上下文、作用域链](1/1.2.2.md)
   * [彻底搞懂 this](1/1.2.3.md)
   * [深入理解 call、apply、bind ](1/1.2.4.md)
   * [面试时高频问到的“闭包” ](1/1.2.5.md)
   * [原型和原型链](1/1.2.6.md)
   * [同步和异步，阻塞和非阻塞](1/1.2.7.md)
   * [Event Loop](1/1.2.8.md)
   * [强大的数组](1/1.2.9.md)
   * [正则表达式](1/1.2.10.md)
   * [位操作符与进制转换](1/1.2.11.md)
   * [rest和spread操作符](1/1.2.12.md)
   * [实现异步非阻塞的任务](1/1.2.13.md)
   * [模块化开发](1/1.2.14.md)
3. 其他知识点
   * [深拷贝与浅拷贝](1/1.3.1.md)
   * [JavaScript函数柯里化](1/1.3.2.md)
   * [JavaScript元编程：Proxy与Reflect](1/1.3.3.md)
   * JavaScript中的进程、线程、协程
4. 浏览器、V8引擎
   * 网页被浏览器绘出来过程是怎样的？
   * 页面重排（Reflow）与重绘（Repaint\) 
   * [DOM、Shadow DOM、Virtual DOM](1/1.4.3.md)
   * V8引擎是如何工作的
   * V8引擎内存管理和垃圾回收机制
5. 相关后端知识、通信协议、安全
   * 为什么要创造服务器端的javascript—Node.js？
   * [了解TCP、UDP、TLS ](1/1.5.2.md)
   * [Http协议几个版本的区别](1/1.5.3.md)
   * Http和Https的区别在哪里
   * [XSS与CSRF攻击](1/1.5.5.md)
6. 书籍推荐
   * [你读过哪些Javscript书籍](https://www.zhihu.com/question/19562698/answer/89480175) _`外链`_

### 贰、[数据结构与算法](2/2.0.md)

1. 面试时高频率出现的算法
   * [十大排序算法](2/2.1.1.md)_`未完`_
   * [链表](2/2.1.2.md)
   * [单调栈](2/2.1.3.md)
   * [二叉树的遍历](2/2.1.4.md)
   * [实战：字节跳动前端面试2道算法题](2/2.1.5.md)
   * [分治法、动态规划与贪心算法的区别](2/2.1.6.md)
   * [实战：阿里巴巴前端面试算法题](2/2.1.7.md) _`未完`_
2. 其他经典算法
   * [尾递归:面试官问你斐波那契数列的时候不要太高兴](https://zhuanlan.zhihu.com/p/54378423) _`外链`_
3. 好书推荐
   * [《学习JavaScript数据结构与算法》](https://book.douban.com/subject/27129352/)_`外链`_

### 叁、主流框架/库

1. 综合比较
   * [jQuery过时了吗？](3/3.1.1.md)
   * [React、Vue和Angular对比](3/3.1.2.md)
2. React
   * [React Hooks究竟是什么？](3/3.2.1.md)
   * React的性能优化技巧
3. Vue.js
   * Vue.js源码解读：Vue数据响应式原理
   * Vue.js带来的一些新问题以及解决办法探索
4. Angular.js
   * 你真的懂Angular.js吗？
   * Angular.js性能优化要点
5. Flutter
   * 浅谈Flutter给前端研发带来的变化
   * Dart
6. 好书推荐
   * [《深入浅出Vue.js》](https://book.douban.com/subject/32581281/)_`外链`_
   * [《深入React技术栈》](https://book.douban.com/subject/26918038/)_`外链`_

### 肆、必会的工具

1. Webpack-自动打包模块工具
   * [深入理解Webpack打包](4/si-.1.1-shen-ru-li-jie-webpack-da-bao.md)
   * 常用的脚手架 
2. API文档管理
   * 用Swagger解决前后端沟通不畅与API调试强依赖的问题
   * Easydoc.xyz
3. IDE-工欲善其事必先利其器
   * 高效使用VSCode的10点建议
   * 适用于前端开发者的优秀VSCode插件
   * Sublime Text

### 伍、编程范式

1. 面向对象编程（OOP）
   * [面向对象与面向过程有什么区别？](5/5.1.1.md)
   * 面向对象编程的弊端是什么？
   * [重新认识JavaScript面向对象:继承](5/5.1.3.md) 
   * [彻底搞懂泛型](5/5.1.4.md)
   * [用JavaScript实现抽象类](5/5.1.5.md)
   * [用JavaScript实现接口](5/5.1.6.md)
2. 函数式编程
   * [什么是函数式编程？](5/5.2.1.md)
   * [JavaScript的函数式编程探索](5/5.2.2.md)
   * [Pointfree无参数风格编程](5/5.2.3.md) _`未完`_
3. 响应式编程
   * [什么是响应式编程？](5/5.3.1.md)_`更新中`_
   * [RxJS](5/5.3.2.md)_`未完`_

### 陆、软件设计的原则

1. [导读：SOLID](6/6.1.0.md)
   * [单一职责原则](6/6.1.1.md)
   * [接口隔离原则](6/6.1.2.md)
   * [开放封闭原则](6/6.1.3.md)
   * [里氏替换原则](6/6.1.4.md)
   * [依赖倒置原则](6/6.1.5.md)
2. 好书推荐
   * [《重构》](https://book.douban.com/subject/4262627/)_`外链`_

### 柒、设计模式和软件工程

1. 十四种经典设计模式
   * 单例模式
   * 策略模式
   * 代理模式
   * 迭代器模式
   * [发布-订阅模式](7/7.1.5.md)
   * 命令模式
   * 组合模式
   * 模板方法模式
   * 享元模式
   * 职责链模式
   * 中介者模式
   * 装饰者模式
   * 状态模式
   * [适配器模式](7/7.1.14.md)
2. 浅谈软件工程：MVC、MVP、MVVM
   * [MVC的前世今生](7/7.2.1.md) _`未完`_
   * MVP又是什么？
   * 有了MVC和MVP，为什么还要MVVM？

### 捌、很有用的网站

1. [中文站-Mozilla大宝库](https://developer.mozilla.org/zh-CN/docs/Web) _`外链`_ 最全的Web相关参考文档,没有之一
2. [英文站-StackOverflow](https://stackoverflow.com/) _`外链`_ 掌握了四级英语就能向老外提问交流了,解决疑难杂症必上
3. [中文站-Vue.js手册](https://vuejs.bootcss.com/guide/) _`外链`_ 手册在手,玩转Vue不愁
4. [英文-Vue资源大全](https://github.com/vuejs/awesome-vue) _`外链`_ 超级多的资源,总能找到你喜欢的那款

### 玖、公众号&博客推荐

1. [一线互联网公司官方前端公众号](9/9.1.md)
2. [知名前端人物](9/9.2.md)

### 拾、后记

1. [成为一个好的程序员远比找份好工作重要](10/10.1.md)
2. [2020年前端技术展望](10/10.2.md)

## 贡献者

[thales-jiang](https://github.com/thales-jiang)

## 联系我

![](.gitbook/assets/makai_greatwall.png)

![](https://img.shields.io/badge/%E5%BE%AE%E4%BF%A1-%40kenny2019-brightgreen) [![contact me via gmail](https://img.shields.io/badge/Gmail-kai521%40gmail.com-red)](mailto:kai521@gmail.com)  
[https://github.com/coffe1891](https://github.com/coffe1891)

对本书有任何疑问，欢迎联系我。

## 版权许可

[![](.gitbook/assets/copyright.png)](http://creativecommons.org/licenses/by-nc/4.0/)

本作品采用[知识共享署名-非商业性使用 4.0 国际许可协议](http://creativecommons.org/licenses/by-nc/4.0/)进行许可，只要保持原作者署名和非商用，您可以自由地阅读、分享、修改本书。

