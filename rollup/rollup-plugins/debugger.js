import { rollup } from "rollup";

import rollupOptions from "./rollup.config.js";

/**
 * rollup 职工三个阶段
 * 1. 打包阶段
 */

(async function () {
  // 1. 打包  build hook
  const bundle = await rollup(rollupOptions);
  // 2. 生成
  await bundle.generate(rollupOptions.output);
  // 3. 写入
  await bundle.write(rollupOptions.output);
  // 4. 关闭
  await bundle.close();
})();
