import { FiberNode } from './Fiber';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';

let workInProgress: FiberNode | null = null; // 全局指针，指向将要更新的 Fiber 节点

function prepareFreshStack(fiber: FiberNode) {
	workInProgress = fiber;
}

function renderRoot(root: FiberNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('workloop err', e);
			workInProgress = null;
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber); // next 是子 fiber 或者 null
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		// 没有子节点
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			// 有兄弟节点就对兄弟节点 beginWork
			workInProgress = sibling;
			return;
		} else {
			// 没有兄弟节点就找回到父节点
			node = node.return;
			workInProgress = node;
		}
	} while (node !== null);
}
