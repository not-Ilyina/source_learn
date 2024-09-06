import { FiberNode, createWorkInProgress, FiberRootNode } from './Fiber';
import { MutationMask, NoFlags } from './FiberFlags';
import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null; // 全局指针，指向将要更新的 Fiber 节点

function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// 调度
	const root = markUpdateFromFiberToRoot(fiber); // 从当前更新节点 上升到跟节点
	renderRoot(root);
}

// 从当前节点找到根 Fiber 节点
export function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}

	return null;
}

export function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workloop err', e);
			}
			workInProgress = null;
		}
	} while (true);

	const finishedWork = root.current.alternate; // workInProgress  应该就是构建好的 Fiber 树？
	root.finishedWork = finishedWork;

	// wip fiberNode 树 树中的 flags
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	//
	const finishedWork = root.finishedWork;
	if (finishedWork === null) return;
	if (__DEV__) console.warn('commit阶段开始', finishedWork);
	root.finishedWork = null; // 重置
	// 判断是否存在 3 个子阶段需要执行的阶段

	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
	// 判断 root 是否包含 mutation 的操作标记
	if (subtreeHasEffect || rootHasEffect) {
		// beforeMutation
		// mutation
		commitMutationEffects(finishedWork);
		root.current = finishedWork; // 切换 Fiber 树
		// layout
	} else {
		// 不管有没有 Mutation 标记都需要切换 Fiber 树
		root.current = finishedWork;
	}
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
		// 没有子节点  完成当前节点处理，然后继续寻找兄弟节点
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
