import babel from "@rollup/plugin-babel";

// 支持第三方库的打包
import nodeResovle from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import typescript from "@rollup/plugin-typescript";

import { terser } from "rollup-plugin-terser";

import postcss from "rollup-plugin-postcss";

import server from "rollup-plugin-serve";

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.cjs.js",
    format: "cjs",
    name: "bundleName",
    globals: {
      lodash: "_",
      jquery: "$",
    },
  },
  external: ["lodash", "jquery"],
  plugins: [
    babel({
      exclude: /node_modules/,
    }),
    nodeResovle(), // 加载 node_module 模块
    commonjs(), // 支持 cjs 语法
    typescript(),
    terser(),
    postcss(),
    server({
      open: true,
      port: 8080,
      contentBase: "./dist",
    }),
  ],
};
