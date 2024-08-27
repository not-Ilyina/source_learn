import { instantiate } from "./instantiate";
import { InstanceMap } from "./instanceMap";

export default class CompositeComponent {
    constructor(element) {
        this.component = element.type;
        this.props = element.props;
    }

    mount() {
        this.instantiate();
        // 实例化完需要进行 render
        return this.toMount();
    }
    // 实例化自己
    instantiate() {
        if (this.component.isClassComponent) {
            this.instance = new this.component(this.props);
            InstanceMap.set(this.instance, this);
        } else {
            this.instance = null;
        }
    }

    render() {
        if (this.instance) {
            this.renderedElement = this.instance.render(); // 类组件
        } else {
            this.renderedElement = this.component(this.props)
        }
    }

    setState(state) {
        const controller = InstanceMap.get(this);
        controller.update(state);
    }

    update(state) {
        this.instance.state = { ...this.instance.state, ...state };
        this.render();

        console.log(this.renderedElement);
        // // 销毁重建
        // const hostNode = this.getHostNode();
        // this.unmount();
        // const newNode = this.toMount();
        // hostNode.parentNode.replaceChild(newNode, hostNode);
    }

    getHostNode() {
        return this.renderedComponent?.getHostNode();
        // return this.node;
    }

    unmount() {
        this.renderedComponent?.unmount();
    }

    toMount() {
        this.render();

        // 执行递归 mount
        if (this.renderedElement) {
            this.renderedComponent = instantiate(this.renderedElement);
            return this.renderedComponent.mount();
        }
        return null;

    }
}