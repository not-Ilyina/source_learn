import hasOwnProperty from 'shared/hasOwnProperty.js';
import REACT_ELEMENT_TYPE from 'shared/ReactSymbols.js';
const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true,
}

function hasValidKey(config) {
    return config.key !== undefined;
}

function hasValidRef(config) {
    return config.ref !== undefined;
}


function ReactElement(type, key, ref, props) {
    return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref,
        props,
    }
}

export function jsxDEV(type, config) {
    let propName;
    const props = {}
    let key = null; // 每个虚拟 DOM 都有一个可选 key 属性
    let ref = null;
    if (hasValidKey(config)) {
        key = config.key;
    }
    if (hasValidRef(config)) {
        ref = config.ref;
    }

    for (propName in config) {
        console.log(config, propName);
        if (hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)) { // 保留属性没必要转移
            props[propName] = config[propName]; // 属性转移
        }
    }
    return ReactElement(type, key, ref, props);
}