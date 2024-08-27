export class Element {
    constructor(type, props) {
        this.type = type;
        this.props = props;
    }
}

function createElement(type, props, ...children) {
    props = props || {};
    props.children = children;
    return new Element (
        type,
        props,
    );
    // 返回虚拟 DOM
}

export default createElement;
