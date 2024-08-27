import { HostRoot } from './ReactWorkTags.js';
import { NoFlags } from './ReactFiberFlags.js';
/**
 * 
 * @param {*} tag Fiber 类型
 * @param {*} pendingProps 新的属性，等待处理
 * @param {*} key 唯一标识
 */
export function FiberNode(tag, pendingProps, key) {
    this.tag = tag;
    this.key = key;
    this.type = null; // Fiber 类型, 对应虚拟 DOM 的类型, span，div
    // 每一个虚拟 DOM 对应一个 Fiber 节点，每个 Fiber 节点创建一个真实 DOM，是一一对应的关系
    this.stateNode = null; // 对应真实 DOM 节点


    this.return = null; // 指向父亲
    this.child = null; // 指向大儿子
    this.sibing = null; // 指向弟弟

    this.pendingProps = pendingProps; // 等待生效的属性
    this.memoizedProps = null; // 已经生效的属性

    // 每个 fiber 会有自己的状态
    this.memoizedState = null; // 指向第一个 hooks ？

    this.updateQueue = null; // 更新队列

    // render 阶段会计算副作用，，如果子节点没有副作用 flags ，可以不需要继续递归 render
    this.flags = NoFlags; // 副作用标识  位运算 Update、Placement
    this.subtreeFlags = NoFlags; // 为了性能优化

    this.alternate = null; // 替身，轮替 使用双缓冲技术
}

export function createFiberRoot(tag, pendingProps, key) {
    return new FiberNode(tag, pendingProps, key);
}

export function createHostRootFiber() {
    return createFiberRoot(HostRoot, null, null); // 3 根节点类型
}