const Bundle = require("./bundle");

/**
 *
 * @param {*} entry 入口文件
 * @param {*} output 输出目录+文件名
 */

function rollup(entry, output) {
  const bundle = new Bundle({ entry });
  bundle.build(output);
}

module.exports = rollup;
