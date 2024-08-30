import { getAppChanges, shouldBeActive } from "../application/app.help.js";
import { toLoadPromise } from "../lifecycles/load.js";
import { toBootstrapPromise } from "../lifecycles/bootstrap.js";
import { toMountPromise } from "../lifecycles/mount.js";
import { toUnmountPromise } from "../lifecycles/unmount.js";
import { started } from "../start.js";
import "./navagation-event.js";
import { callCaptureEventListeners } from "./navagation-event.js";
export function reroute(event) {
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();
  if (started) {
    // 用户调用了 start 要处理挂载或者卸载
    return performAppChange();
  }

  //   加载
  return loadApp();

  function loadApp() {
    return Promise.all(appsToLoad.map(toLoadPromise)).then(callEventListener); // 加载完;
  }

  function performAppChange() {
    // 卸载不需要应用
    const unmountPromises = Promise.all(appsToUnmount.map(toUnmountPromise));
    // 加载 启动 (保证卸载干净)挂载
    const loadMountPromises = Promise.all(
      appsToLoad.map((app) =>
        toLoadPromise(app).then((app) => {
          return app && tryBootstrapAndMount(app, unmountPromises);
        })
      )
    );
    // 应用加载过了，下次直接挂载
    const mountPromises = Promise.all(
      appsToMount.map((app) => tryBootstrapAndMount(app, unmountPromises))
    );

    function tryBootstrapAndMount(app, unmountPromises) {
      if (shouldBeActive(app)) {
        return toBootstrapPromise(app).then((app) =>
          unmountPromises.then(() => toMountPromise(app))
        );
      }
    }

    Promise.all([loadMountPromises, mountPromises]).then(() => {
      // 挂载完  再调用
      callEventListener();
    });
  }

  function callEventListener() {
    callCaptureEventListeners(event);
  }
}
