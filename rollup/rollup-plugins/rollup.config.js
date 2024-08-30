import build from "./plugins/rollup-plugin-build.js";
import polyfill from "./plugins/rollup-plugin-polyfill.js";

export default {
  input: "./src/index.js",
  output: {
    dir: "dist",
  },
  plugins: [polyfill()],
};
