const walk = require("./walk");
const Scope = require("./scope");

function analyse(ast, code, module) {
  // 第一次循环，找到模块导入导出的变量

  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _included: { value: false, writable: true },
      _module: { value: module },
      _source: { value: code.snip(statement.start, statement.end) },
      _dependsOn: { value: {} }, // 依赖的 var
      _defines: { value: {} }, // 顶级作用域标识
    });

    // 找出导入变量
    if (statement.type === "ImportDeclaration") {
      // 导入模块的相对路径
      let source = statement.source.value;
      statement.specifiers.forEach((specifier) => {
        let importName = specifier.imported.name;
        let localName = specifier.local.name;
        // 当前模块 localName 来源于 source 路径模块的 importName
        module.imports[localName] = { source, importName };
      });
    } else if (statement.type === "ExportNamedDeclaration") {
      // 观察 AST 得出判断条件
      const declaration = statement.declaration;
      if (declaration && declaration.type === "VariableDeclaration") {
        const declarations = declaration.declarations;
        declarations.forEach((variableDeclarator) => {
          const localName = variableDeclarator.id.name;
          const exportName = localName;
          module.exports[exportName] = { localName };
        });
      }
    }
  });

  // 二轮循环，创建作用域链
  // 要知道本模块用到了哪些变量
  // 还需要知道该变量是局部的还是全局的

  let currentScope = new Scope({ name: "模块的顶级作用域" });
  ast.body.forEach((statement) => {
    function addToScope(name) {
      currentScope.addName(name);
      if (!currentScope.parent) {
        // 顶级作用域
        statement._defines[name] = true;
        // 定义域就是该语句
        module.definitions[name] = statement;
      }
    }
    walk(statement, {
      enter(node) {
        // 标识符
        if (node.type === "Identifier") {
          statement._dependsOn[node.name] = true; // 当前语句依赖了 node.name 这个变量
        }
        let newScope;
        switch (node.type) {
          case "FunctionDeclaration":
            addToScope(node.id.name); // 函数名添加到当前作用域
            const names = node.params.map((param) => param.name); // 处理函数参数
            newScope = new Scope({
              name: node.id.name,
              parent: currentScope, // 创建新作用域时，父作用域就是当前作用域
              names,
            });
            break;
          case "VariableDeclaration":
            node.declarations.forEach((declaration) => {
              addToScope(declaration.id.name);
            });
            break;
          default:
            break;
        }

        if (newScope) {
          // 新作用域
          Object.defineProperty(node, "_scope", { value: newScope });
        }
      },
      leave(node) {
        if (Object.hasOwnProperty(node, "_scope")) {
          currentScope = currentScope.parent; // 回退到父作用域
        }
      },
    });
  });

  ast.body.forEach((statement) => {
    console.log(statement._defines);
  });
}

module.exports = analyse;
