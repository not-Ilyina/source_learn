const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 5000,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },

  configureWebpack: {
    output: {
      libraryTarget: "umd",
      library: "m-vue",
    },
  },
});
