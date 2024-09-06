import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./public-path";

let root;
function render(props) {
  const container = props.container;
  root = ReactDOM.createRoot(
    container
      ? container.querySelector("#root")
      : document.getElementById("root")
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({}); // 独立运行
}

export async function bootstrap(props) {
  console.log(props);
}

export async function mount(props) {
  render(props);
}

export async function unmount(props) {
  root.unmount();
}
