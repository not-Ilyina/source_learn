const path = require("path");
const fs = require("fs");
const Module = require("./module");
const MagicString = require("magic-string");
const { hasOwnProperty, replaceIndentifier } = require("./utils");

class Bundle {
  constructor(options) {
    this.entryPath = path.resolve(options.entry.replace(/\.js$/, "") + ".js"); // 入口文件绝对路径
    this.modules = new Set();
  }

  build(output) {
    // 先走
    const entryModule = this.fetchModule(this.entryPath); // 一切皆模块
    this.statements = entryModule.expandAllStatements();
    this.deconflict(); // 明名冲突
    const { code } = this.generate();
    fs.writeFileSync(output, code);
  }

  deconflict() {
    const defines = {}; // 变量名和模块数组的一个 map
    const conflicts = {};
    this.statements.forEach((statement) => {
      Object.keys(statement._defines).forEach((name) => {
        if (hasOwnProperty(defines, name)) {
          conflicts[name] = true;
        } else {
          defines[name] = [];
        }
        // 把变量的定义语句对应的模块放到数组里
        defines[name].push(statement._module);
      });
    });
    // 遍历冲突变量数组
    Object.keys(conflicts).forEach((name) => {
      const modules = defines[name];
      modules.pop();
      modules.forEach((module, idx) => {
        let replacement = `${name}$${modules.length - idx}`;
        module.rename(name, replacement);
      });
    });
  }

  /**
   *
   * @param {*} importee 被引入 ./msg.js
   * @param {*} importer 引入别人的模块 main.js
   * @returns
   */
  fetchModule(importee, importer) {
    // let route = importee;
    let route;
    if (!importer) {
      route = importee;
    } else {
      if (path.isAbsolute(importee)) {
        route = importee;
      } else {
        route = path.resolve(
          path.dirname(importer),
          importee.replace(/\.js$/, "") + ".js"
        );
      }
    }
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
      let replacements = {};
      // 依赖和定义的变量都要修改
      Object.keys(statement._dependsOn)
        .concat(Object.keys(statement._defines))
        .forEach((name) => {
          const canonicalName = statement._module.getCanonicalName(name);
          if (name !== canonicalName) {
            replacements[name] = canonicalName;
          }
        });
      const source = statement._source.clone();
      if (statement.type === "ExportNamedDeclaration") {
        source.remove(statement.start, statement.declaration.start); // 删除 export
      }
      replaceIndentifier(statement, source, replacements);

      bundle.addSource({
        content: source,
        separator: "\n",
      });
    });
    return { code: bundle.toString() };
  }
}

module.exports = Bundle;
