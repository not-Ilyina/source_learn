const MagicString = require("magic-string");
const { parse } = require("acorn");

const analyse = require("./ast/analyse");

class Module {
  constructor({ code, path, bundle }) {
    // 源代码 路径 bundle实例
    this.code = new MagicString(code);
    this.path = path;
    this.bundle = bundle;
    // 代码转 AST
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: "module",
    });

    // tree shaking  存放模块导入导出的变量
    this.imports = {};
    this.exports = {};
    this.definitions = {}; // 存放当前模块的顶级变量的定义语句
    // 分析
    analyse(this.ast, this.code, this);
  }
  expandAllStatements() {
    let allStatements = [];
    this.ast.body.forEach((statement) => {
      let statements = this.expandAllStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }

  expandAllStatement(statement) {
    statement._included = { value: false };
    let res = [];
    res.push(statement);
    return res;
  }
}

module.exports = Module;
