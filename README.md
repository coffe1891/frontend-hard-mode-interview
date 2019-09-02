>如何在Hard模式下通过一线互联网公司的面试？我，38岁的听障程序员，没错，属于听力残疾人士，2003年出版个人第一本互联网技术书籍，后来在360和百度工作，再后来创业3次，运气好成功了1次，酷爱挑战逆境。在南方休息2年后，现在回到了北京，有了新的挑战：计划入职一线互联网公司做感兴趣的前端(Front-End)工作。因为听力差、年龄大，很多互联网公司的领导似乎不太接受这样的，屡屡被拒。面对如此逆境，我决定苦练技能，用优秀的面试表现打动雇主以达成目标。因此做了这个内参，把前端知识和前端面试要点梳理一遍，作为自己求职的复习/进阶内参。现在分享出来，用心写上点评，希望对你有用。[@欢迎给我提建议](https://github.com/coffe1891/FERD/issues/new)，[@Twitter](https://twitter.com/coffe1891)。

#### 零、搞定Hard模式下的面试
1. 一线互联网公司面试前的准备
    * 该公司是做什么的，实力怎么样，前景如何，口碑怎样？
    * 该岗位负责做什么的，上升空间多大？
    * 面试官会是什么样的人呢？
    * 面试官可能问到哪些笔试、面试题？
    * 如何在面试前就给人留下深刻印象？
    * 面试应该怎样穿着打扮？
2. 面试中的技巧
    * 面试期间仪态禁忌有哪些？
    * 如何得体的与面试官交谈？
    * 如何回答面试中常被问及的问题？
    * 如何给HR和面试官留下好而深刻的印象？
3. 面试后的积极应对
    * 面试完离开后如何给HR和面试官打招呼？
    * 如何礼貌又得体的询问结果？
    * 如果被拒，如何再次寻求面试机会？
    * 面完及时总结-->提升-->准备下一轮面试。
#### 一、前端之灵：JavaScript语言
1. 最新特性
    * [2019年的JavaScript性能](https://juejin.im/post/5d1f27285188252f275fdbb6)<br/>点评:
1. 语言基础
    * [作用域、作用域链](https://zhuanlan.zhihu.com/p/59321690)<br/>许多开发人员经常混淆作用域和执行上下文的概念，误认为它们是相同的概念，但事实并非如此
    * [彻底搞懂Javascript中的this](https://www.cnblogs.com/kaima/p/javascript_this.html)<br/>按照作者提供的窍门再也不怕搞错this指向了
    * [面试官想知道你有多理解call,apply,bind](https://mp.weixin.qq.com/s/DlUJq0JJzHjnPwCI_SAI5Q)<br/>写得详实易懂,看完可以举一反三、对答如流
    * [彻底搞懂Javascript中的闭包](https://www.cnblogs.com/wangfupeng1988/p/3994065.html)<br/>“闭包”这个词的概念的文字描述，确实不好解释，我看过很多遍，但是现在还是记不住。但是你只需要知道应用的两种情况即可——函数作为返回值，函数作为参数传递。
    * [如何形象地解释 JavaScript 中 map、foreach、reduce 间的区别？](https://www.zhihu.com/question/24927450/answer/29478982)<br/>点评:Vue.js作者给的解释，简单干脆，附带还讲了filter()
    * [新的RegExp特性，rest/spread属性，异步迭代和Promise.prototype.finally](https://zhuanlan.zhihu.com/p/55416553)<br/>每个JavaScript开发者都该了解的ES2018新特性
1. 浏览器、JS引擎
    * [页面重排与重绘（Reflow & Repaint)](https://zhuanlan.zhihu.com/p/35184404)<br/>把浏览器的工作原理也讲到了，reflow和repaint是两个很重要的概念,一定要搞明白
    * [V8引擎是如何工作的](https://zhuanlan.zhihu.com/p/73768338)<br/>对V8引擎需要有充分了解才能知道为什么快，怎么样写代码会跑的更快
    * [V8内存管理和垃圾回收机制总结](https://www.jianshu.com/p/455d0b9ef0a8)<br/>V8采用分代回收+复制回收的垃圾回收算法,这个知识点要弄明白,是通用的
1. 奇技淫巧
    * [JavaScript函数柯里化](https://zhuanlan.zhihu.com/p/31271179)<br/>性能不佳,但是面试时高频出现
    * [用 Reduce 实现 Promise 串行执行](https://zhuanlan.zhihu.com/p/47896370)<br/>确实很妙
    * [ES6之Proxy的巧用](https://zhuanlan.zhihu.com/p/75407419)<br/>Proxy可以拦截/控制任何目标Object的行为,十分强大。嗯，灵活性几乎总是意味着性能损失
1. 书籍推荐
    * [关于 JavaScript 的好书有哪些？](https://www.zhihu.com/question/19562698/answer/89480175)<br/>绝对都是好书,我都读过,但我不是此文作者

#### 二、必须学扎实：数据结构与算法
1. 面试时高频率出现的算法
    * [十大经典排序算法](https://www.runoob.com/w3cnote/ten-sorting-algorithm.html) <br/>很严谨的文档,论文风格,对阅读能力有较高要求,适合深度阅读
    * [二叉树中的最大路径和](https://zhuanlan.zhihu.com/p/77213607)<br/>递归用来解决二叉树问题就是简洁
    * [前端笔试&面试常见算法](https://juejin.im/post/5b72f0caf265da282809f3b5#heading-17)<br/>写得都通俗易懂,算是一份前端面试小抄
    * [字节跳动前端面试2道算法题](https://www.cnblogs.com/kaima/p/bytedance_interview.html)<br/>二叉树算法题我当时答得不算好,没有进入第二面,正在寻求再次面试的机会
1. 其他算法理论
    * [面试官问你斐波那契数列的时候不要高兴得太早](https://zhuanlan.zhihu.com/p/54378423) <br/>把递归/尾递归、迭代讲明白了,C语言版本,不妨碍阅读
    * [尾递归究竟是好是坏](https://www.zhihu.com/question/49368021/answer/115631284) <br/>确定编译器能优化尾递归,就可以写尾递归
1. 好书推荐
    * [《学习JavaScript数据结构与算法》](https://book.douban.com/subject/27129352/)<br/>这是第2版,加入了ES6的一些新内容,建议先看一遍书目录,高级点的数据结构还需要专门看其他文章,目前市面上没有比这本好的

#### 三、流行的框架
1. 综合
    * [开发跨平台app推荐React Native还是flutter？](https://www.zhihu.com/question/307298908/answer/569471390)<br/>讲清楚了为什么flutter更快
    * [Angular和Vue.js深度对比](https://www.cnblogs.com/scode2/p/8820613.html)
1. Vue.js
    * [Vue问得最多的面试题](https://zhuanlan.zhihu.com/p/53703176)<br/>面试小抄,细节很多,但我觉得没必要死记硬背,搞清楚原理更重要
    * [Vue源码解读：Vue数据响应式原理](https://www.jianshu.com/p/1032ecd62b3a)<br/>分析比较透彻,适合深度阅读
1. Angular.js
1. React Native
1. flutter
    * [Flutter 开发体验初探](https://zhuanlan.zhihu.com/p/78344178)<br/>基于Android Studio,对Android猿会更友好
1. 好书推荐

#### 四、必会的工具
1. Webpack-自动打包模块工具
    * [带你走进webpack世界，成为webpack头号玩家](https://juejin.im/post/5ac9dc9af265da23884d5543)
    * [webpack入门指南](https://webpack.docschina.org/guides/)<br/>花1~2天看完这个指南就算入门了
1. Swagger-API文档管理
    * [Swagger介绍及使用](https://www.jianshu.com/p/349e130e40d5)<br/>再也不愁文档更新不及时了
1. IDE-工欲善其事必先利其器
    * [高效使用VSCode的9点建议](https://zhuanlan.zhihu.com/p/60394607)<br/>这9插件中 Live Share 最逆天,多行编辑也十分好用
    * [这就是我想要的VSCode插件！](https://zhuanlan.zhihu.com/p/36020180)<br/>Quokka.js,Bracket Pair Colorizer,Import Cost这三个插件惊艳了我
    * [适用于前端开发者的12款VSCode扩展工具](https://zhuanlan.zhihu.com/p/37090453)<br/>VSCode没有它们会非常单调
    * Sublime

#### 五、掌握常见的设计模式，实战中融会贯通
1. 十四种经典设计模式
    * (01) 单例模式
    * (02) 策略模式
    * (03) 代理模式
    * (04) 迭代器模式
    * (05) 发布-订阅模式
    * (06) 命令模式
    * (07) 组合模式
    * (08) 模板方法模式
    * (09) 享元模式
    * (10) 职责链模式
    * (11) 中介者模式
    * (12) 装饰者模式
    * (13) 状态模式
    * (14) 适配器模式
1. MVVM、MVC、MVP
    * [浅析web前端MVVM](https://zhuanlan.zhihu.com/p/54355504)<br/>点评:

#### 六、编程思想
1. 综合
    * [如何通俗易懂地举例说明「面向对象」和「面向过程」有什么区别](https://www.zhihu.com/question/27468564/answer/103253765)<br/>点评:
1. 面向对象编程
    * [面向对象编程(OOP)的弊端是什么](https://www.zhihu.com/question/20275578/answer/26577791)<br/>作者意思是面向对象只是一种编程范式，真正美的设计不局限于面向对象这个范式，首先要明白什么是美的设计，再考虑面向对象的实现，而不是倒着来为了OOP而OOP；同时，很多人把“封装、继承、多态”当成面向对象三要素，这是错的，面向对象只有2个要点“封装”和“归一化”；最后作者阐述了什么是“封装”：“真正的封装是，经过深入的思考，做出良好的抽象，给出“完整且最小”的接口，并使得内部细节可以对外透明（对外透明的意思是，外部调用者可以顺利的得到自己想要的任何功能，完全意识不到内部细节的存在）”。文章很长，需要安静的环境下阅读。读完后相信你多多少少都是有收获的。
    * [重新认识JavaScript面向对象: 从ES5到ES6](https://zhuanlan.zhihu.com/p/33658346)<br/>点评:
1. 函数式编程
    * [什么是函数式编程思维](https://www.zhihu.com/question/28292740/answer/40336090)<br/>面向数学,变量不可变,无需共享资源无须独占锁,因此线程安全,适合发挥多核CPU并发的威力.顺带把递归和迭代讲透了
1. 元编程
    * [Javascript元编程](https://zhuanlan.zhihu.com/p/20758879)<br> 讲了什么是元编程，并举例eval、new Function()、Proxy等元编程特性
1. 架构原则
    * 单一职责原则
    * 最少知识原则
    * 开放-封闭原则
    * 接口和面向接口编程
    * 代码重构

#### 七、参考网站
1. [中文站-Mozilla大宝库](https://developer.mozilla.org/zh-CN/docs/Web)<br/>最全的Web相关参考文档,没有之一
1. [英文站-StackOverflow](https://stackoverflow.com/)<br/>掌握了四级英语就能向老外提问交流了,解决疑难杂症必上
1. [中文站-Vue.js手册](https://www.w3cschool.cn/aekdgs/)<br/>手册在手,Vue不愁
1. [中英文-Vue资源大全](https://github.com/vuejs/awesome-vue)<br/>超级多的资源,总能找到你喜欢的那款

#### 八、博客&公众号
1. 奇舞周刊 <br/>进微信搜索"奇舞周刊",360奇舞团(75Team)出品,篇篇精品
1. [每一个Javascript开发人员都应该关注的博客](https://www.zcfy.cc/article/15-blogs-every-javascript-developer-should-follow-in-2018)<br/>一些博主是Javascript明星，更多的是像你我这样的普通开发人员。 某些博客关注在某个具体的生态（像是Angular、React或者Vue)， 还有一些关注更普遍的用法。

#### 九、Twitter
1. [尤雨溪](https://twitter.com/youyuxi) <br>Vue.js作者