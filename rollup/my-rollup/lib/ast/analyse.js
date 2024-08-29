const walk = require("./walk");
const Scope = require("./scope");
const { hasOwnProperty } = require("../utils");

function analyse(ast, code, module) {
  // 第一次循环，找到模块导入导出的变量

  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _included: { value: false, writable: true }, // 防止多次变量使用
      _module: { value: module },
      _source: { value: code.snip(statement.start, statement.end) },
      _dependsOn: { value: {} }, // 依赖的 var
      _defines: { value: {} }, // 顶级作用域标识 本语句定义了哪些变量
      _modifies: { value: {} }, // 本语句修改了哪些变量
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
    function addToScope(name, isBlockDeclaration) {
      currentScope.addName(name, isBlockDeclaration);
      if (
        !currentScope.parent ||
        (currentScope.isBlock && !isBlockDeclaration)
      ) {
        // 顶级作用域
        statement._defines[name] = true; // 暂时还没用到
        // 定义域就是该语句
        module.definitions[name] = statement; // 作用域链是为了
      }
    }
    function checkForReads(node) {
      // 标识符
      if (node.type === "Identifier") {
        statement._dependsOn[node.name] = true; // 当前语句依赖了 node.name 这个变量
      }
    }
    function checkForWrites(node) {
      function addNode(node) {
        const { name } = node;
        statement._modifies[name] = true; // 此语句修改了 name 变量
        if (!hasOwnProperty(module.modifications, name)) {
          module.modifications[name] = [];
        }
        // 存放该模块中某个变量对应的所有修改语句
        module.modifications[name].push(statement);
      }
      if (node.type === "AssignmentExpression") {
        addNode(node.left);
      } else if (node.type === "UpdateExpression") {
        addNode(node.argument);
      }
    }
    walk(statement, {
      enter(node) {
        checkForReads(node);
        checkForWrites(node);
        let newScope;
        switch (node.type) {
          case "FunctionDeclaration":
            addToScope(node.id.name); // 函数名添加到当前作用域
            const names = node.params.map((param) => param.name); // 处理函数参数
            newScope = new Scope({
              name: node.id.name,
              parent: currentScope, // 创建新作用域时，父作用域就是当前作用域
              names,
              isBlock: false, // 函数创建不是块级作用域
            });
            break;
          case "VariableDeclaration":
            node.declarations.forEach((declaration) => {
              if (node.kind === "let" || node.kind === "const") {
                addToScope(declaration.id.name, true);
              } else {
                addToScope(declaration.id.name);
              }
            });
            break;
          case "BlockStatement": // 块级作用域
            newScope = new Scope({
              parent: currentScope,
              isBlock: true,
            });
            break;
          default:
            break;
        }

        if (newScope) {
          // 新作用域
          Object.defineProperty(node, "_scope", { value: newScope });
          currentScope = newScope;
        }
      },
      leave(node) {
        if (hasOwnProperty(node, "_scope")) {
          currentScope = currentScope.parent; // 回退到父作用域
        }
      },
    });
  });
}

module.exports = analyse;
