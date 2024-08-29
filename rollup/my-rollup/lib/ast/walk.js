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
      val.forEach((v) => {
        if (v.type) {
          visit(v, node, enter, leave);
        }
      });
    } else if (val && val.type) {
      visit(val, node, enter, leave);
    }
  });
  if (leave) {
    leave(node, parent);
  }
}

module.exports = walk;
