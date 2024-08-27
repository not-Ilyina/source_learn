import $ from 'jquery';
import { Element } from './element.js';
class Unit {
    constructor(element) {
        this.currentElement = element;
    }
}

// 主要是处理普通文本 和 jsx  组件可以递归复用这些

class ReactTextUnit extends Unit {
    getMarkup(rootId) {
        this._rootId = rootId;
        return `<span data-reactid="${rootId}">${this.currentElement}</span>`
    }

    update(nextElement) {
        if (this.currentElement === nextElement) return;
        this.currentElement = nextElement;
        $([`[data-reactid="${this._rootId}"]`]).html(nextElement);
    }
}

class ReactNativeUnit extends Unit {
    getMarkup(rootId) {
        this._rootId = rootId;
        let { type, props } = this.currentElement;
        let tagStart = `<${type} data-reactid="${rootId}"`; // 字符串无法注册事件的
        let tagEnd = `</${type}>`;
        let childContentStr;
        for (let propName in props) {
            console.log(propName);
            if (/on[A-Z]/.test(propName)) {
                const eventType = propName.slice(2).toLowerCase(); // 除去 on
                $(document).on(eventType, `[data-reactid="${rootId}"]`, props[propName]); // 事件委托
            } else if (propName === 'style') {
                let styleObj = props[propName];
                let styles = Object.entries(styleObj).map(([attr, val]) => {
                    // aCA => a-c-a
                    return `${attr.replace(/A-Z/g, m => `-${m.toLowerCase()}`)}:${val}`;
                }).join(';');
                tagStart += (` style="${styles}" `)
            } else if (propName === 'className') {
                // className => class
                tagStart += (` class="${props[propName]}"`);
            } else if (propName === 'children') { // return ['<span>111</span>', ...]
                childContentStr = props[propName].map((child, index) => {
                    // 递归循环子节点
                    let childInstance = createReactUnit(child);
                    return childInstance.getMarkup(`${rootId}.${index}`);
                }).join('');
            } else {
                tagStart += (` ${propName}=${props[propName]}`)
            }
        }
        return tagStart + '>' + childContentStr + tagEnd;
    }
}

// 渲染 React 组件
class ReactCompositeUnit extends Unit {
    getMarkup(rootId) {
        this._rootId = rootId;
        let { type: Component, props } = this.currentElement;
        let componentInstance = this._componentInstance = new Component(props);
        this._componentInstance._currentUnit = this; // TODO
        // 生命周期钩子
        componentInstance.componentWillMount && componentInstance.componentWillMount(); // 先走父亲再走儿子
        let reactComponentRendererElement = componentInstance.render();

        let ReactCompositeUnitInstance = this._ReactCompositeUnitInstance = createReactUnit(reactComponentRendererElement); // 递归渲染
        let markup = ReactCompositeUnitInstance.getMarkup(rootId);

        $(document).on('mounted', () => { // 发布订阅
            componentInstance.componentDidMount && componentInstance.componentDidMount(); // 先子后父
        })
        return markup;
    }

    update(nextElement, partialState) {
        // 获取新元素
        this.currentElement = nextElement || this.currentElement;
        let nextState = this._componentInstance.state = Object.assign(this._componentInstance.state, partialState);

        let nextProps = this.currentElement.props;

        if (this._componentInstance.shouldComponentUpdate && !this._componentInstance.shouldComponentUpdate(nextProps, nextState)) {
            return;
        }
        // domdiff
        let preRenderedUnitInstance =  this._ReactCompositeUnitInstance;
        let preRenderElement = preRenderedUnitInstance.currentElement;
        let nextRenderElement = this._componentInstance.render();
        
        if (shouldDeepCompare(preRenderElement, nextRenderElement)) {
            preRenderedUnitInstance.update(nextRenderElement); // 递归
            this._componentInstance.componentDidUpdate && this._componentInstance.componentDidUpdate();
        } else {
            this._ReactCompositeUnitInstance = createReactUnit(nextRenderElement);
            let nextMarkup = this._ReactCompositeUnitInstance.getMarkup(this._rootId);
            $(`[data-reactid="${this._rootId}"]`).replaceWith(nextMarkup);
        }

    }
}

function shouldDeepCompare(old, newElement) {
    if (old !== null && newElement !== null) {
        // 判断类型一样不一样
    }
    return false;
}


// 工厂函数
function createReactUnit(element) {
    if (typeof element === 'string' || typeof element === 'number') {
        return new ReactTextUnit(element);
    }
    // JSX 类型
    if (element instanceof Element && typeof element.type === 'string') {
        return new ReactNativeUnit(element);
    }
    if (element instanceof Element && typeof element.type === 'function' ) {
        return new ReactCompositeUnit(element);
    }
}

export default createReactUnit;