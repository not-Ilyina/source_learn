import { reroute } from "./navigation/reroute.js";

// 开启路径监控，可以在路由变换，调用对应 mount
export let started = false;
export function start() {
  started = true;
  reroute();
}
