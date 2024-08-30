// 用户路径切换，劫持，重新调用 reroute

import { reroute } from "./reroute.js";

function urlRoute() {
  reroute(arguments);
}

window.addEventListener("hashchange", urlRoute);

window.addEventListener("popstate", urlRoute); // 历史切换时会执行

const captureEventListeners = {
  hashchange: [],
  popstate: [],
};

const listeningTo = ["hashchange", "popstate"];
const originalAddEventLister = window.addEventListener;

const originalRemoveEventLister = window.removeEventListener;

// 先劫持的监听事件
window.addEventListener = function (eventName, callback) {
  // 监听事件、函数不能重复
  if (
    listeningTo.includes(eventName) &&
    !captureEventListeners[eventName].some((listener) => listener === callback)
  ) {
    captureEventListeners[eventName].push(callback);
    return;
  }

  return originalAddEventLister.apply(this, arguments);
};

window.removeEventListener = function (eventName, callback) {
  // 监听事件、函数不能重复
  if (listeningTo.includes(eventName)) {
    captureEventListeners[eventName] = captureEventListeners[eventName].filter(
      (fn) => fn !== callback
    );
    return;
  }

  return originalRemoveEventLister.apply(this, arguments);
};

export function callCaptureEventListeners(event) {
  if (event) {
    const eventType = event[0].type;
    if (listeningTo.includes(eventType)) {
      captureEventListeners[eventType].forEach((listener) => {
        listener.apply(this, event); // 调用注册应用前的监听回调
      });
    }
  }
}

function patchFn(updateState, methodName) {
  return function () {
    const urlBefore = window.location.href;
    const r = updateState.apply(this, arguments);
    const urlAfter = window.location.href;
    if (urlBefore !== urlAfter) {
      window.dispatchEvent(new PopStateEvent(methodName));
    }
    return r;
  };
}

window.history.pushState = patchFn(window.history.pushState, "pushState");

window.history.replaceState = patchFn(
  window.history.replaceState,
  "replaceState"
);
