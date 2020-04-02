# 贰.1.2 单调栈

## **贰.1.2.1 定义**

**单调栈，顾名思义就是栈内元素单调按照递增\(递减\)顺序排列的栈**。这里的单调递增或递减是指的从栈顶到栈底单调递增或递减。

示例：用数组`[7,4,9,5,3,2]`构建一个单调递减栈。

![](../.gitbook/assets/monotone-stack.gif)

代码示例：

```javascript
(()=>{
    let A=[7,4,9,5,3,2],stk=[];
    let l=A.length;
    for (let i = 0; i < l; i++) {
        while (stk.lenght && A[i] <= A[stk[stk.length-1]]) { // 单调递增栈
            // 单调递减栈的情况为 A[i] >= A[stk[stk.length-1]]]
            stk.pop();
        }
        stk.push(i);
    }
})();
```

## 贰.1.2.2 应用场景

* 找出数组中每项左右两边第一个大于/小于它的解。
* 题目中隐含查找第一个（或离此元素最近的）大于/小于此元素的值，这类问题都可以考虑用单调栈求解。

## 贰.1.2.3 应用示例

### 1.气温问题（[LeetCode.739](https://leetcode-cn.com/problems/daily-temperatures/)）

题目如下：

> 根据每日 气温 列表，请重新生成一个列表，对应位置的输出是需要再等待多久温度才会升高超过该日的天数。如果之后都不会升高，请在该位置用 0 来代替。
>
> 例如，给定一个数组`T= [73, 74, 75, 71, 69, 72, 76, 73]`，你的输出应该是`[1, 1, 4, 2, 1, 1, 0, 0]`。

这道题用若2个for循环的办法解决，时间复杂度是O\(N^2\)；

```javascript
/**
 * @param {number[]} T
 * @return {number[]}
 */
var dailyTemperatures = function (T) {
    let arr = [];
    let l = T.length;

    for (let i = 0; i < l; i++) {
        if (i == l - 1) {//末尾一定是0
            arr.push(0);
        } else {
            for (let j = i + 1; j < l; j++) {
                if (T[j] > T[i]) {
                    arr.push(j - i);
                    break;
                }else if(j==l-1){
                    arr.push(0);
                }
            }
        }
    }

    return arr;
};
```

而若使用单调栈，时间复杂度能将为O\(N\)。来分析下这道题，思路如下：

* 维护一个单调递增栈，栈内存储气温数组 T 的 index ；
* 查看当前元素是否大于栈顶元素所对应的 T 的值，也就是 T\[stack\[stack.length - 1\]\] ；
* 如果大于，那说明找到需要等待的天数。如果不大于那说明还没到找到比这天高的温度，同时继续维护这个单调栈；
* 如果大于，需要等待的天数就是当前数组 T 的index减去单调栈顶对应的index；
* 若循环完毕还没有找到，则需要等待的天数为0。

```javascript
/**
 * @param {number[]} T
 * @return {number[]}
 */
var dailyTemperatures = function(T) {
    let { length } = T;
    let res = new Array(length).fill(0);
    let stack = [];
    for(let i = 0; i < length; i++) {
        while(stack.length && T[i] > T[stack[stack.length - 1]]) {
            let index = stack.pop();//条件满足得到一个结果之后，取出栈顶存放的index
                                    //并执行出栈，可以接着计算下一个了。
            res[index] = i - index;//res[index]是巧妙之处，存放天数
        }
        stack.push(i);//栈内存放T的index
    }
    return res;
};
```

说白了就是空间换时间，新增一个单调栈存放index，巧妙地来换取时间复杂度的降低。

### 2.求数组项左右两侧比该项大的数

原题如下：

> 给定一个长度为N的正整数数组，输出每个数左右两边第一个比它小的数，如果不存在则输出 - 1。   
>   
>  输入： `[3, 4, 2, 7, 5]`
>
>  输出：   
> 左边 `[-1, 3, -1, 2, 2]`   
> 右边 `[2, 2, -1, 5, -1]`

解题思路：查找左右两边第一个更小的元素，使用单调递增栈

* 入栈时，**当前元素左边的第一个更小的元素**是**当前栈顶元素**
* 出栈时，**栈顶右边第一个更小的元素**是**即将入栈的当前元素**

```javascript
((arr) => {
    let l = arr.length;
    let resLeft = new Array(l).fill(-1);
    let resRight = new Array(l).fill(-1);
    let stack = [];
    for (let i = 0; i < l; i++) {
        while (stack.length && arr[i] < arr[stack[stack.length - 1]]) {
            let index = stack.pop();
            resRight[index] = arr[i];
            if (stack.length)
                resLeft[index] = arr[stack[stack.length - 1]];
        }
        stack.push(i);
    }
    console.log(resLeft, resRight);
})([3, 4, 2, 7, 5]);
```

## 贰.1.2.3 总结要点

单调栈的核心并不是单调，单调递增或者递减只不过是副产品。其实际意义在于：

* 实际上单调栈中并不保存数组项的值，而是保存数组项在原数组中的索引位置（index）；
* 单调栈只是一个临时用来协助加速计算的、比较巧妙的数据结构；
* 若从1到N遍历数组一遍，把每个将要放入的数组项其对应的索引位置（index）记录到栈里，就可以在O\(N\)的时间复杂度内得到数组所有项的左/右边、距离该项元素最近、且比该项元素大/小的其他元素的索引位置（index）。

