const PRXY_SUFFIX = "?inject-polyfill";
const POLYFILL_ID = "\0polyfill";

function polyfill() {
  return {
    name: "polyfill",
    async resolveId(source, importer, options) {
      if (source === POLYFILL_ID) {
        return { id: POLYFILL_ID, moduleSideEffects: true };
      }
      if (options.isEntry) {
        // 入口点
        // 查找模块ID
        const resolution = await this.resolve(source, importer, {
          skipSelf: true,
          ...options,
        });
        // 模块无法解析或者外部模块，rollup 报错
        if (!resolution || resolution.external) {
          return resolution;
        }
        // 加载模块内容
        const moduleInfo = await this.load(resolution);
        moduleInfo.moduleSideEffects = true; // 防止 tree shaking
        return `${resolution.id}${PRXY_SUFFIX}`; // 返回新路径 + 查询字符串
      }
      return null;
    },
    // 钩子会执行多次？
    async load(id) {
      if (id === POLYFILL_ID) {
        return `console.log('fake')`;
      }
      // 自定义加载程序
      // 如果是需要代理入口的模块，生成中间代理模块
      if (id.endsWith(PRXY_SUFFIX)) {
        const entryId = id.slice(0, -PRXY_SUFFIX.length);
        // 中间代理的代码
        let code = `
            import ${JSON.stringify(POLYFILL_ID)} // 返回插入代码 
            export * from ${JSON.stringify(entryId)} // 返回原来的代码
        `;
        // 有返回值，就不会走后面的 load 钩子，也不会读硬件文件了
        return code;
      }
      return null;
    },
  };
}

export default polyfill;

/**
 * 默认情况 rollup 只认识相对路径
 */
