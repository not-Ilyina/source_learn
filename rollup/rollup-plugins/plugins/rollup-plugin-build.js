function build(pluginOptions) {
  return {
    name: "build", // 插件名字
    async options(options) {
      console.log("options");
      // 汇总配置前执行
      return { ...options };
    },
    async buildStart(options) {
      // 汇总了配置的所有内容
      console.log("buildStart");
    },
    async resolveId(source, importer) {
      console.log("🚀 ~ resovleId ~ source:", source, importer);
    },
    async load(id) {},
    async transform(code, id) {
      console.log("transform", code, id);
    },
    buildEnd() {
      console.log("buildEnd");
    },
  };
}

export default build;
