import $ from 'jquery';
import createReactUnit from './unit.js';
import createElement from './element.js';
import Component from './component.js';

let React = {
    render,
    nextRootIndex: 0,
    createElement,
    Component,
}

function render(element, container) {
    // 工厂函数
    let createReactUnitInstance = createReactUnit(element);
    let markup = createReactUnitInstance.getMarkup(React.nextRootIndex);
    // let markup = `<span data-reactid="${React.nextRootIndex}">${element}</span>`
    $(container).html(markup);
    // 触发挂载完成
    $(document).trigger('mounted');
}

export default React;
