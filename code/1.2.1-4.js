// 匿名函数能递归吗？能。但老办法 arguments.callee 只适用于非严格模式。
// 下面只是帮助理解历史代码。现代项目不建议使用 arguments.callee。
(function (i) {
    console.log("匿名函数，第" + i + "次调用");
    if (i < 3) {
        arguments.callee(i + 1);
    }
})(1);
// >> 匿名函数，第1次调用
// >> 匿名函数，第2次调用
// >> 匿名函数，第3次调用

// 现代写法：给函数表达式起名，严格模式下也能正常递归。
(function () {
    "use strict";
    (function repeat(i) {
        console.log("具名函数，第" + i + "次调用");
        if (i < 3) repeat(i + 1);
    })(1);
})();

// 这两种 IIFE 都能执行，但箭头函数的 this / arguments 等行为不同，不能说完全等价。
(function (i) {
    console.log(i);
})(1);
((i) => {
    console.log(i);
})(1);
