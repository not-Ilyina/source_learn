import { createApp } from "vue";
import App from "./App.vue";
import routes from "./router";
import { createRouter, createWebHistory } from "vue-router";
import "./public-path";

let app;
let history;
let router;
function render(props) {
  app = createApp(App);
  history = createWebHistory(window.__POWERED_BY_QIANKUN__ ? "/vue" : "/");
  router = createRouter({
    history,
    routes,
  });
  app.use(router);

  const container = props.container;
  app.mount(
    container ? container.querySelector("#app") : document.getElementById("app")
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}
export async function bootstrap(props) {
  console.log(props);
}

export async function mount(props) {
  render(props);
}

export async function unmount(props) {
  console.log(history, "history");
  app.unmount();
  history.destroy();
  app = null;
  router = null;
}
