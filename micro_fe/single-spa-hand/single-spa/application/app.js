import { NOT_LOADED } from "./app.help.js";
import { reroute } from "../navigation/reroute.js";

// 看路径是否匹配，若匹配则加载对应应用
export const apps = [];
export function registerApplication(appName, loadApp, activeWhen, customProps) {
  const registeration = {
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: NOT_LOADED,
  };
  apps.push(registeration);
  // 每个应用添加状态 未加载、 加载、挂载、卸载

  // 检查要被加载的应用，要被挂载，要被移除

  reroute(); // 重写路由  核心方法
}
