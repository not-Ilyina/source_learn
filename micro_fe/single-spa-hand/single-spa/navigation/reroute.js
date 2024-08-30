import { getAppChanges, shouldBeActive } from "../application/app.help.js";
import { toLoadPromise } from "../lifecycles/load.js";
import { toBootstrapPromise } from "../lifecycles/bootstrap.js";
import { toMountPromise } from "../lifecycles/mount.js";
import { toUnmountPromise } from "../lifecycles/unmount.js";
import { started } from "../start.js";

export function reroute() {
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();

  // 加载完毕要挂载
  //   const loadMountPromises = Promise.all(
  //     appsToLoad.map((app) =>
  //       toLoadPromise().then((app) => tryToBootstrapAddMount(app))
  //     )
  //   );
  if (started) {
    // 用户调用了 start 要处理挂载或者卸载
    return performAppChange();
  }

  //   加载
  return loadApp();

  function loadApp() {
    return Promise.all(
      appsToLoad.map((app) => {
        toLoadPromise(app);
      })
    );
  }

  function performAppChange() {
    // 卸载不需要应用
    const unmountPromises = Promise.all(
      appsToUnmount.map((app) => toUnmountPromise(app))
    );
    // 加载 启动 (保证卸载干净)挂载
    const mountPromises = appsToLoad.map((app) =>
      toLoadPromise(app).then((app) => {
        // 保证先卸载干净
        tryBootstrapAndMount(app, unmountPromises);
      })
    );

    function tryBootstrapAndMount(app, unmountPromises) {
      if (shouldBeActive(app)) {
        return toBootstrapPromise(app).then((app) =>
          unmountPromises.then(() => toMountPromise(app))
        );
      }
    }
  }
}
