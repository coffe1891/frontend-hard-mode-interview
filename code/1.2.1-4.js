//函数调用自身称为递归,函数名为“func”
(function (i){
    //"use strict" //取消注释则为严格模式，会报错
    console.log("函数名为"+func.name+",第"+i+"次调用")
    if(i<3){//递归出口
        arguments.callee(++i);
    }
})(1);
//函数名为func,第1次调用
//函数名为func,第3次调用
//函数名为func,第3次调用


//该函数与后面的箭头函数等效
(function(i){
    console.log(i);
})(1);
//箭头函数
((i)=>{
    console.log(i);
})(1);