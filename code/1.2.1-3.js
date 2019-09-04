//函数调用自身称为递归,函数名为“func”
(function func(i){
    console.log("函数名为"+func.name+",第"+i+"次调用")
    if(i<3){//递归出口
        func(++i);
    }
})(1);
//函数名为func,第1次调用
//函数名为func,第3次调用
//函数名为func,第3次调用