import { apps } from "./app.js"; // 注册的所有应用

export const NOT_LOADED = "NOT_LOADED";

export const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE"; // 路径匹配加载资源

export const LOAD_ERROR = "LOAD_ERROR"; // 路径匹配加载资源

export const NOT_BOOTSTRAPED = "NOT_BOOTSTRAPED";

export const BOOTSTRAPING = "BOOTSTRAPING";

export const NOT_MOUNTED = "NOT_MOUNTED ";

export const MOUNTING = "MOUNTING";

export const MOUNTED = "MOUNTED";

export const UNMOUNTING = "UNMOUNTING";

// 应用是否正在被激活

export function isActive(app) {
  return app.status === MOUNTED; // 正好在被激活
}

export function shouldBeActive(app) {
  return app.activeWhen(window.location); // 是否应该被激活
}

export function getAppChanges() {
  const appsToLoad = [];
  const appsToMount = [];
  const appsToUnmount = [];

  // 遍历所有注册应用，根据状态和路由匹配，做一个应用筛选分类
  apps.forEach((app) => {
    let appShouldBeActive = shouldBeActive(app);
    switch (app.status) {
      case NOT_LOADED:
      //要去加载
      case LOADING_SOURCE_CODE:
        if (appShouldBeActive) {
          appsToLoad.push(app);
        }
        break;
      case NOT_BOOTSTRAPED:
      case BOOTSTRAPING:
      case NOT_MOUNTED:
        if (appShouldBeActive) {
          appsToMount.push(app);
        }
        break;
      case MOUNTED:
        if (!appShouldBeActive) {
          appsToUnmount.push(app);
        }
        break;
      default:
        break;
    }
  });

  return {
    appsToLoad,
    appsToMount,
    appsToUnmount,
  };
}
