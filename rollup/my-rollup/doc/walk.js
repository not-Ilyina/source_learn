const acorn = require("acorn");

const sourceCode = `import $ from 'jquery'`;

const ast = acorn.parse(sourceCode, {
  locations: true,
  ranges: true,
  sourceType: "module",
  ecmaVersion: 8,
});
console.log("🚀 ~ ast:", ast);

// 遍历语法树
ast.body.forEach((e) => {
  walk(e, {
    enter(node, parent) {
      console.log("进入节点", node, parent);
    },
    leave(node, parent) {
      console.log("离开节点", node, parent);
    },
  });
});

function walk(astNode, { enter, leave }) {
  visit(astNode, null, enter, leave);
}

function visit(node, parent, enter, leave) {
  if (enter) {
    enter(node, parent);
  }

  // 拿到节点的 key 数组
  const keys = Object.keys(node).filter((key) => typeof node[key] === "object");

  keys.forEach((key) => {
    let val = node[key];
    if (Array.isArray(val)) {
      // 子节点 body 可能是数组
      val.forEach((v) => {
        if (v.type) {
          visit(v, node, enter, leave);
        }
      });
    } else if (val && val.type) {
      // 子节点 body 可能是对象
      visit(val, node, enter, leave); // 变量名和代码块会被遍历
    }
  });
  if (leave) {
    leave(node, parent);
  }
}
