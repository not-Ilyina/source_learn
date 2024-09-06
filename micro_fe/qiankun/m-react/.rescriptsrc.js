module.exports = {
  webpack: (config) => {
    config.output.libraryTarget = "umd";
    config.output.library = "m-react"; // 打包格式是 umd
    return config;
  },
  devServer: (config) => {
    config.headers = {
      "Access-control-Allow-Origin": "*",
    };
    return config;
  },
};
