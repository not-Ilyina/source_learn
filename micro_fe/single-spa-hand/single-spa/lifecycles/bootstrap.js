import {
  BOOTSTRAPING,
  NOT_BOOTSTRAPED,
  NOT_MOUNTED,
} from "../application/app.help.js";

export function toBootstrapPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_BOOTSTRAPED) {
      return app;
    }
    app.status = BOOTSTRAPING;
    return app.bootstrap(app.customProps).then(() => {
      app.status = NOT_MOUNTED;
      return app;
    });
  });
}
