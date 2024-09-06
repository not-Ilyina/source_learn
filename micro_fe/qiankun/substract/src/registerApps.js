import { registerMicroApps, start } from "qiankun";

const loader = (loading) => {
  console.log("加载状态: ", loading);
};

registerMicroApps(
  [
    {
      name: "reactApp",
      entry: "//localhost:4000",
      activeRule: "/react",
      container: "#container",
      loader,
    },

    {
      name: "vueApp",
      entry: "//localhost:5000",
      activeRule: "/vue",
      container: "#container",
      loader,
    },
  ],
  {
    beforeLoad() {
      console.log("before load");
    },
    beforeMount() {
      console.log("before mount");
    },
    afterMount() {
      console.log("after mount");
    },
    beforeUnmount() {
      console.log("before unmount");
    },
    afterUnmount() {
      console.log("after unmount");
    },
  }
);

start();
