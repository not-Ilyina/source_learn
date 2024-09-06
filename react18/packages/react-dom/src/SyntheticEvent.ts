import { Container } from 'hostConfig';
import { Props } from 'shared/ReactType';

export const elementPropsKey = '__props';
const validEventTypeList = ['click'];

export interface DOMElement extends Element {
	[elementPropsKey]: Props;
}

type EventCallback = (e: Event) => void;

interface SyntheticEvent extends Event {
	__stopPropagation: boolean;
}

interface Paths {
	capture: EventCallback[];
	bubble: EventCallback[];
}

export function updateFiberProps(node: DOMElement, props: Props) {
	node[elementPropsKey] = props;
}

export function initEvent(container: Container, evevtType: string) {
	if (!validEventTypeList.includes(evevtType)) {
		console.warn('当前不支持', evevtType, '事件');
		return;
	}
	if (__DEV__) {
		console.log('初始化书记兼:', evevtType);
	}
	container.addEventListener(evevtType, (e) => {
		dispatchEvent(container, evevtType, e);
	});
}

function createSyntheticEvent(e: Event) {
	const syntheticEvent = e as SyntheticEvent;
	syntheticEvent.__stopPropagation = false;
	const originStopPropagation = e.stopPropagation;
	syntheticEvent.stopPropagation = () => {
		syntheticEvent.__stopPropagation = true;
		if (originStopPropagation) {
			originStopPropagation();
		}
	};
	return syntheticEvent;
}

function dispatchEvent(container: Container, evevtType: string, e: Event) {
	const targetElement = e.target;

	if (targetElement === null) {
		console.warn('事件不存在 target', e);
		return;
	}
	// 1.收集沿途的事件
	const { bubble, capture } = collectPaths(
		targetElement as DOMElement,
		container,
		evevtType
	);
	// 2. 构造合成事件
	const se = createSyntheticEvent(e);
	// 3. 遍历 capture
	triggerEvevtFlow(capture, se);

	if (!se.__stopPropagation) {
		// 4. 遍历 bubble
		triggerEvevtFlow(bubble, se);
	}
}

function triggerEvevtFlow(paths: EventCallback[], se: SyntheticEvent) {
	for (let i = 0; i < paths.length; i++) {
		const callback = paths[i];
		callback.call(null, se);
		if (se.__stopPropagation) {
			break;
		}
	}
}

function getEventCallbackNameFromEventType(
	evevtType: string
): string[] | undefined {
	return {
		click: ['onClickCapture', 'onClick']
	}[evevtType];
}

function collectPaths(
	targetElement: DOMElement,
	container: Container,
	evevtType: string
) {
	const paths: Paths = {
		capture: [],
		bubble: []
	};

	while (targetElement && targetElement !== container) {
		const elementProps = targetElement[elementPropsKey];
		if (elementProps) {
			const callbackNameList = getEventCallbackNameFromEventType(evevtType);
			if (callbackNameList) {
				callbackNameList.forEach((callbackName, i) => {
					const eventCallback = elementProps[callbackName];
					if (eventCallback) {
						if (i === 0) {
							// capture
							paths.capture.unshift(eventCallback);
						} else {
							paths.bubble.push(eventCallback);
						}
					}
				});
			}
		}
		targetElement = targetElement.parentNode as DOMElement;
	}
	return paths;
}
