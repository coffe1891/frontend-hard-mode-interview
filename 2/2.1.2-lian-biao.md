# 贰.1.2 链表

\(单\)链表的JavaScript数据结构如下：

```javascript
let Node = {//链表中的一个结点
     val : 1891,     //结点的值
     next: node     //一个指针指向下一个结点。若结点为链表的尾端，则next的值是null
}
```

## 01.反转链表

### 迭代法

```javascript
var reverseList = function(head/*Node*/) {
    if(!head || !head.next) return head;
    var prev = null, curr = head;
    while(curr) {
        // 用于临时存储 curr 后继节点
        var next = curr.next;
        // 反转 curr 的后继指针
        curr.next = prev;
        // 变更prev、curr 
        // 待反转节点指向下一个节点 
        prev = curr;
        curr = next;
    }
    head = prev;
    return head;
}
```

### 尾递归法

```javascript
var reverseList = function(head/*Node*/) {
    if(!head || !head.next) return head;
    return reverse(null, head);
};

var reverse = function(prev, curr) {
    if(!curr) return prev;
    var next = curr.next;
    curr.next = prev;
    return reverse(curr, next);
};
```

## 02.回形链表

