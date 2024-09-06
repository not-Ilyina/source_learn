import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './Fiber';
import { HostRoot } from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { ReactElementType } from 'shared/ReactType';
import { scheduleUpdateOnFiber } from './WorkLoop';

export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

// 触发更新？
export function updateContainer(
	element: ReactElementType | null, // <App />  是一个函数
	root: FiberRootNode // root 容器对应节点
) {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElementType | null>(element); // 出问题了
	// 链接首屏渲染和触发state更新
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);

	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
