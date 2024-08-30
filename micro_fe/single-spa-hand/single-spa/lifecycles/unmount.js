import { MOUNTED, NOT_MOUNTED, UNMOUNTING } from "../application/app.help.js";

export function toUnmountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== MOUNTED) {
      return app;
    }
    app.status = UNMOUNTING;
    // unmount 可能是数组
    return app.unmount(app.customProps).then(() => {
      app.status = NOT_MOUNTED;
    });
  });
}
