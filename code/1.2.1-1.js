//函数的声明形态
function func(){
    console.log("函数的声明形态")
}

//函数的表达式形态
let func0 =function(){
    console.log("函数的表达式形态");
}

//函数的嵌套形态
let func1 = function(){
    console.log("函数的嵌套形态");
    let func2 = function(){
        console.log("func2嵌套在func1里")
    }
    func2();
}

// 函数的闭包形态
let func3 = function(){
    return function(){
        console.log("我是以闭包形态存在的函数");
    }
}
//所有的函数都通一对括号“()”调用执行
func();
func0();
func1();
func3()();