function dispatchAction(queue, action) {
    const update = { action, next: null }; // 创建一个更新节点
    const pending = queue.pending;
    // 把节点挂载到 queue 上面，构建循环链表
    if (queue.pending === null) {
        update.next = update;
    } else {
        // 执行顺序不能变，如果变了顺序， update 节点无法找到头节点
        update.next = pending.next; // 新增节点指向头节点，，头节点微 queue.pending 的 next 节点
        pending.next = update; // 当前尾节点指向新增节点
    }
    queue.pending = update;
}


let queue = { pending: null };

dispatchAction(queue, 'action1');
dispatchAction(queue, 'action2');
dispatchAction(queue, 'action3');
// 遍历循环链表做更新操作  是按照顺序的

const pendingQueue = queue.pending;

if (pendingQueue !== null) {
    let first = pendingQueue.next;
    let cur = first;
    do { // 一开始不满足进入循环条件
        console.log('对节点进行操作', cur);
        cur = cur.next;
    } while (cur !== first);
}

