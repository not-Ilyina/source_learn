const path = require("path");

const rollup = require("./lib/rollup");

const entry = path.resolve(__dirname, "src/main.js");
// C:\data\front_end_study\source_learn\rollup\my-rollup\src\main.js

const output = path.resolve(__dirname, "dist/bundle.js");

rollup(entry, output);
