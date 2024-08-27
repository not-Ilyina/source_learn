import { createHostRootFiber } from './ReactFiber.js';

function FiberRootNode(containerInfo) {
    this.containerInfo = containerInfo; // div #root   
}

export function createFiberRoot(containerInfo) {
    const root = new FiberRootNode(containerInfo); // Fiber 根节点  本质是容器 DOM 节点信息
    const uninitializedFiber = createHostRootFiber(); // 页面根节点

    root.current = uninitializedFiber; // current 指向当前的 Fiber 树
    uninitializedFiber.stateNode = root;

    return root;
}