const MagicString = require("magic-string");
const { parse } = require("acorn");

const analyse = require("./ast/analyse");
const { hasOwnProperty } = require("./utils");
const SYSTEM_VARS = ["console", "log"];
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
    // 存放模块修改语句
    this.modifications = {};
    this.canonicalNames = {};
    // 分析
    analyse(this.ast, this.code, this);
  }
  expandAllStatements() {
    let allStatements = [];
    this.ast.body.forEach((statement) => {
      if (statement.type === "ImportDeclaration") return; // 删除导入声明
      // 默认不包括所有的变量声明
      if (statement.type === "VariableDeclaration") return; // 用到的变量才需要放结果里面
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expandStatement(statement) {
    statement._included = { value: true };
    let res = [];

    // 找到此语句用到的变量 把这些变量定义语句找出来，放到 res 数组
    const _dependsOn = Object.keys(statement._dependsOn);
    _dependsOn.forEach((name) => {
      let definitions = this.define(name);
      res.push(...definitions);
    });

    res.push(statement); // 收集完变量声明语句，再收集变量修改语句

    // 找到语句的定义变量、把该变量对应的修改语句找到
    const defines = Object.keys(statement._defines);
    defines.forEach((name) => {
      // 找到变量的修改语句
      const modifications =
        hasOwnProperty(this.modifications, name) && this.modifications[name];
      if (modifications) {
        modifications.forEach((modification) => {
          if (!modification._included) {
            let statements = this.expandStatement(modification);
            res.push(...statements);
          }
        });
      }
    });
    return res;
  }
  define(name) {
    // 区分变量是内部还是外部导入的
    if (hasOwnProperty(this.imports, name)) {
      const { source, importName } = this.imports[name];
      // 获取导入模块 相对路径，绝对路径
      const importedModule = this.bundle.fetchModule(source, this.path);
      const { localName } = importedModule.exports[importName]; // msg.js exports[name]
      return importedModule.define(localName);
    } else {
      // 如果非导入模块，是本地模块
      let statement = this.definitions[name]; // 找到本模块定义该变量语句
      if (statement) {
        if (statement._included) {
          return [];
        } else {
          return this.expandStatement(statement);
        }
      } else {
        if (SYSTEM_VARS.includes(name)) {
          return [];
        } else {
          throw new Error(`变量${name}既没有从外部导入，也没有在当前模块声明`);
        }
      }
    }
  }
  rename(name, replacement) {
    this.canonicalNames[name] = replacement;
  }
  getCanonicalName(name) {
    return this.canonicalNames[name] || name;
  }
}

module.exports = Module;
