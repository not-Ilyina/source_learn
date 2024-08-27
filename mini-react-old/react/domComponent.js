import { instantiate } from "./instantiate";
import EventListener from "./event";


export default class DomComponent {
    constructor(element) {
        this.element = element;
        this.tag = element.type;
        this.props = element.props;
    }

    mount() {
        this.createElement();
        this.setAttribute();
        this.mountChildren();

        return this.node;
    }

    createElement() {
        this.node = document.createElement(this.tag);
    }

    setAttribute() {
        Object.keys(this.props).forEach(attr => {
            // 跳过 children 属性，修正： className => class
            if (attr !== 'children') {
                if (attr === 'className') {
                    this.node.setAttribute('class', this.props[attr]);
                } else if (EventListener.isEventAttribute(attr)) {
                    EventListener.listen(attr, this.props[attr], this.node);
                } else {
                    this.node.setAttribute(attr, this.props[attr]);
                }
            }
        })
    }

    mountChildren() {
        let children = this.props.children || [];

        if (!Array.isArray(children)) {
            children = [children];
        }

        const nodeList = [];

        children.forEach(e => {
            const node = instantiate(e).mount();
            if (node) {
                nodeList.push(node);
            }
        });

        nodeList.forEach(n => {
            this.node.appendChild(n);
        });
    }

    getHostNode() {
        return this.node;
    }
}