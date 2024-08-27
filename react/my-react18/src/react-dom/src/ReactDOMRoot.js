import { createContainer } from 'react-reconciler/src/ReactFiberReconciler';

function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot;
}

export function createRoot(container) {
    const root = createContainer(container); // 根节点是没有虚拟 DOM
    return new ReactDOMRoot(root);
}