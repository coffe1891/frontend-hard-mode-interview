---
description: 挑战Hard模式下的前端面试之旅
---

# 前端内参

## 前言

如何在Hard模式下通过一线互联网公司的面试？

我，38岁的听障程序员，没错，属于听力残疾人士，2003年出版个人第一本互联网技术书籍，后来在360和百度工作，再后来创业3次，运气好成功了1次，酷爱挑战逆境。

在南方休息2年后，现在回到了北京，有了新的挑战：计划入职一线互联网公司做感兴趣的前端\(Front-End\)工作。因为听力差、年龄大，很多互联网公司的领导似乎不太接受这样的，屡屡被拒，面试之旅已然进入Hard模式。面对如此逆境，我决定勤学苦练，用优秀的面试表现打动雇主以达成目标。

因此做了这个内参，把前端知识和前端面试要点梳理一遍，作为自己求职的复习/进阶内参。现在分享出来，用心写上点评，希望对你有用。

欢迎给我[@提建议](https://github.com/coffe1891/FERD/issues/new)，[@Twitter](https://twitter.com/coffe1891)。

## 零、搞定Hard模式下的面试

1. 一线互联网公司面试前的准备
   * [一线互联网公司有什么不同？](0-1-1.md)
   * [该公司是做什么的，实力怎么样，前景如何，口碑怎样？](0-1-2.md)
   * 该岗位负责做什么的，岗位所属部门在什么位置，上升空间多大？
   * 面试官会是什么样的人呢？
   * 面试官可能问到哪些笔试、面试题？
   * 如何在面试前就给人留下深刻印象？
   * 面试应该怎样穿着打扮？
   * 不要迟到！不要迟到！不要迟到！
2. 面试中的技巧
   * 请停止抖你的腿，挺直你的背
   * 不卑不亢、不疾不徐地说话
   * 注意倾听，回答问题适可而止
   * 直觉地感到面试官对你不友好时，如何应对？
   * 谦虚的人总是受人尊敬的
   * 诚实诚恳，扬长避短
   * 如何回答职业规划？
   * 如何回答离职原因？
   * 被问答到薪资待遇时如何应对？
   * 当面试官问你“有什么问题要问我吗”，如何应对？
   * 一线互联网公司面试中有哪些暗语？
3. 面试后的积极应对
   * 面试完离开后如何给HR和面试官打招呼？
   * 如何礼貌又得体的询问结果？
   * 如果被拒，如何再次寻求面试机会？
   * 面完及时总结--&gt;提升--&gt;准备下轮面试

## 一、前端之灵：JavaScript/ECMAScript

1. 最新特性
   * [2019年的JavaScript性能变化](https://juejin.im/post/5d1f27285188252f275fdbb6)
   * 2020年的Javascript新变化
2. 核心概念
   * [函数](./) 函数是JavaScript世界的第一等公民
   * [作用域、作用域链、执行上下文](https://zhuanlan.zhihu.com/p/59321690) 其实我觉得，执行上下文，也就是执行时产生的对象（Activetion Object）。
   * [彻底搞懂this](https://www.cnblogs.com/kaima/p/javascript_this.html) 按照作者提供的窍门再也不怕搞错this指向了
   * [面试官想知道你有多理解call,apply,bind](https://mp.weixin.qq.com/s/DlUJq0JJzHjnPwCI_SAI5Q) 写得详实易懂,看完可以举一反三、对答如流
   * [面试时高频问到的“闭包”](https://www.cnblogs.com/wangfupeng1988/p/3994065.html) “闭包”这个词的概念的文字描述，确实不好解释，我看过很多遍，但是现在还是记不住。但是你只需要知道应用的两种情况即可——函数作为返回值，函数作为参数传递。
   * [原型和原型链](./) 忘掉“类”和“继承”的概念，拥抱原型
   * [模块化](./) 模块化是大势所趋，一线互联网公司大规模应用都是采用模块化的方式开发
   * [如何形象地解释数组的map、foreach、reduce、filter 间的区别？](https://www.zhihu.com/question/24927450/answer/29478982) Vue.js作者给的解释，简单干脆
   * [RegExp新增改动，rest/spread属性，异步迭代和Promise.prototype.finally](https://zhuanlan.zhihu.com/p/55416553) 每个JavaScript开发者都该了解的ES新特性
3. 浏览器、引擎
   * [页面重排与重绘（Reflow & Repaint\)](https://zhuanlan.zhihu.com/p/35184404) 把浏览器的工作原理也讲到了，reflow和repaint是两个很重要的概念,一定要搞明白
   * [V8引擎是如何工作的](https://zhuanlan.zhihu.com/p/73768338) 对V8引擎需要有充分了解才能知道为什么快，怎么样写代码会跑的更快
   * [V8内存管理和垃圾回收机制总结](https://www.jianshu.com/p/455d0b9ef0a8) V8采用分代回收+复制回收的垃圾回收算法,这个知识点要弄明白,是通用的
4. 了解一些服务器端核心概念
   * 为什么要创造服务器端的javascript—Node.js？
   * 了解TCP/IP、UDP、TLS
   * Http协议的三个版本
   * Http和Https的区别在哪里
5. 面试时高频问到的小技巧
   * [JavaScript函数柯里化](https://zhuanlan.zhihu.com/p/31271179) 性能不佳,但是面试时高频出现
   * [用 Reduce 实现 Promise 串行执行](https://zhuanlan.zhihu.com/p/47896370) 确实很妙
   * [ES6之Proxy的巧用](https://zhuanlan.zhihu.com/p/75407419) Proxy可以拦截/控制任何目标Object的行为,十分强大。嗯，灵活性几乎总是意味着性能损失
   * [用JavaScript实现类、继承、多态](./) 有好几种办法实现继承，但有点类似于茴香豆有几种写法，无用之用
6. 书籍推荐
   * [面试官问你读过哪些Javscript书籍](https://www.zhihu.com/question/19562698/answer/89480175) 绝对都是好书,我都读过,但我不是此文作者

## 二、数据结构与算法

1. 面试时高频率出现的算法
   * [十大经典排序算法](https://www.runoob.com/w3cnote/ten-sorting-algorithm.html)  很严谨的文档,论文风格,对阅读能力有较高要求,适合深度阅读
   * [二叉树中的最大路径和](https://zhuanlan.zhihu.com/p/77213607) 递归用来解决二叉树问题就是简洁
   * [前端笔试&面试常见算法](https://juejin.im/post/5b72f0caf265da282809f3b5#heading-17) 写得都通俗易懂,算是一份前端面试小抄
   * [字节跳动前端面试2道算法题](https://www.cnblogs.com/kaima/p/bytedance_interview.html) 二叉树算法题我当时答得不算好,没有进入第二面,正在寻求再次面试的机会
2. 其他算法理论
   * [面试官问你斐波那契数列的时候不要高兴得太早](https://zhuanlan.zhihu.com/p/54378423)  把递归/尾递归、迭代讲明白了,C语言版本,不妨碍阅读
   * [尾递归究竟是好是坏](https://www.zhihu.com/question/49368021/answer/115631284)  确定编译器能优化尾递归,就可以写尾递归
3. 好书推荐
   * [《学习JavaScript数据结构与算法》](https://book.douban.com/subject/27129352/) 这是第2版,加入了ES6的一些新内容,建议先看一遍书目录,高级点的数据结构还需要专门看其他文章,但是目前市面上也没有比这本写得更好的

## 三、主流框架

1. 综合比较
   * [开发跨平台app推荐React Native还是flutter？](https://www.zhihu.com/question/307298908/answer/569471390) 讲清楚了为什么flutter更快
   * [Angular和Vue.js深度对比](https://www.cnblogs.com/scode2/p/8820613.html)
2. Vue.js
   * [Vue问得最多的面试题](https://zhuanlan.zhihu.com/p/53703176) 面试小抄,细节很多,但我觉得没必要死记硬背,搞清楚原理更重要
   * [Vue源码解读：Vue数据响应式原理](https://www.jianshu.com/p/1032ecd62b3a) 分析比较透彻,适合深度阅读
3. Angular.js
   * 先有Angular.js再有Vue.js
   * Angular.js的优缺点
4. React Native
   * 面试官高频问到的一些实现原理
5. flutter
   * [Flutter 开发体验初探](https://zhuanlan.zhihu.com/p/78344178) 基于Android Studio,对Android猿会更友好
6. 好书推荐
   * 《Vue.js》《Angular.js》 

## 四、必会的工具

1. Webpack-自动打包模块工具
   * [带你走进webpack世界，成为webpack头号玩家](https://juejin.im/post/5ac9dc9af265da23884d5543)
   * [webpack入门指南](https://webpack.docschina.org/guides/) 花1~2天看完这个指南就算入门了
2. Swagger-API文档管理
   * [Swagger介绍及使用](https://www.jianshu.com/p/349e130e40d5) 再也不愁文档更新不及时了
3. IDE-工欲善其事必先利其器
   * [高效使用VSCode的9点建议](https://zhuanlan.zhihu.com/p/60394607) 这9插件中 Live Share 最逆天,多行编辑也十分好用
   * [这就是我想要的VSCode插件！](https://zhuanlan.zhihu.com/p/36020180) Quokka.js,Bracket Pair Colorizer,Import Cost这三个插件惊艳了我
   * [适用于前端开发者的12款VSCode扩展工具](https://zhuanlan.zhihu.com/p/37090453) VSCode没有它们会非常单调
   * Sublime

## 五、编程思想

1. 设计原则——先有美的设计，才有美的实现
   * 单一职责原则
   * 最少知识原则
   * 开放-封闭原则
   * 接口和面向接口编程
   * 代码重构
2. 面向对象编程
   * [如何通俗易懂地举例说明「面向对象」和「面向过程」有什么区别](https://www.zhihu.com/question/27468564/answer/103253765)
   * [面向对象编程\(OOP\)的弊端是什么](https://www.zhihu.com/question/20275578/answer/26577791) 作者意思是面向对象只是一种编程范式，真正美的设计不局限于面向对象这个范式，首先要明白什么是美的设计，再考虑面向对象的实现，而不是倒着来为了OOP而OOP；同时，很多人把“封装、继承、多态”当成面向对象三要素，这是错的，面向对象只有2个要点“封装”和“归一化”；最后作者阐述了什么是“封装”：“真正的封装是，经过深入的思考，做出良好的抽象，给出“完整且最小”的接口，并使得内部细节可以对外透明（对外透明的意思是，外部调用者可以顺利的得到自己想要的任何功能，完全意识不到内部细节的存在）”。文章很长，需要安静的环境下阅读。读完后相信你多多少少都是有收获的。
   * [重新认识JavaScript面向对象: 从ES5到ES6](https://zhuanlan.zhihu.com/p/33658346) 点评:
3. 函数式编程
   * [什么是函数式编程思维](https://www.zhihu.com/question/28292740/answer/40336090) 面向数学,变量不可变,无需共享资源无须独占锁,因此线程安全,适合发挥多核CPU并发的威力.顺带把递归和迭代讲透了
4. 元编程
   * [Javascript元编程](https://zhuanlan.zhihu.com/p/20758879)  讲了什么是元编程，并举例eval、new Function\(\)、Proxy等元编程特性
5. 好书推荐
   * [《重构》](https://book.douban.com/subject/4262627/)

## 六、掌握常见的设计模式

1. 面试时很容易聊到的十四种经典设计模式
   * 单例模式
   * 策略模式
   * 代理模式
   * 迭代器模式
   * 发布-订阅模式
   * 命令模式
   * 组合模式
   * 模板方法模式
   * 享元模式
   * 职责链模式
   * 中介者模式
   * 装饰者模式
   * 状态模式
   * 适配器模式
2. MVVM、MVC、MVP
   * [浅析web前端MVVM](https://zhuanlan.zhihu.com/p/54355504) 

## 七、参考网站

1. [中文站-Mozilla大宝库](https://developer.mozilla.org/zh-CN/docs/Web) 最全的Web相关参考文档,没有之一
2. [英文站-StackOverflow](https://stackoverflow.com/) 掌握了四级英语就能向老外提问交流了,解决疑难杂症必上
3. [中文站-Vue.js手册](https://www.w3cschool.cn/aekdgs/) 手册在手,玩转Vue不愁
4. [中英文-Vue资源大全](https://github.com/vuejs/awesome-vue) 超级多的资源,总能找到你喜欢的那款

## 八、博客&公众号

1. 奇舞周刊  进微信搜索"奇舞周刊",360奇舞团\(75Team\)出品,篇篇精品
2. [每一个Javascript开发人员都应该关注的博客](https://www.zcfy.cc/article/15-blogs-every-javascript-developer-should-follow-in-2018) 老外的博客，一些博主是Javascript明星，更多的是像你我这样的普通开发人员。 某些博客关注在某个具体的生态（像是Angular、React或者Vue\)， 还有一些关注更普遍的用法。

## 九、Twitter

1. [尤雨溪](https://twitter.com/youyuxi)  Vue.js作者

