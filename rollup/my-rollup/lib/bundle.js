const path = require("path");
const fs = require("fs");
const Module = require("./module");
const MagicString = require("magic-string");

class Bundle {
  constructor(options) {
    this.entryPath = path.resolve(options.entry); // 入口文件绝对路径
    this.modules = new Set();
  }

  build(output) {
    // 先走
    const entryModule = this.fetchModule(this.entryPath); // 一切皆模块
    this.statements = entryModule.expandAllStatements();
    const { code } = this.generate();
    fs.writeFileSync(output, code);
  }

  fetchModule(importee) {
    let route = importee;
    if (route) {
      const code = fs.readFileSync(route, "utf-8");
      const module = new Module({
        // 创建模块实例
        code,
        path: route,
        bundle: this,
      });
      this.modules.add(module);
      return module;
    }
  }

  generate() {
    let bundle = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      const source = statement._source.clone();
      bundle.addSource({
        content: source,
        separator: "\n",
      });
    });
    return { code: bundle.toString() };
  }
}

module.exports = Bundle;
