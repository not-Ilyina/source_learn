class Scope {
  constructor(options) {
    this.name = options.name; // 作用域名称
    this.parent = options.parent; // 父作用域
    this.names = options.names || []; //

    this.isBlock = !!options.isBlock; // 是否为块级作用域
  }
  addName(name, isBlockDeclaration) {
    // 次变量不是块级变量（var），且当前是作用域是块级作用域
    if (!isBlockDeclaration && this.isBlock) {
      // 做作用域变量提升
      this.parent.addName(name, isBlockDeclaration);
    } else {
      this.names.push(name);
    }
  }
  findDefiningScope(name) {
    if (this.names.includes(name)) {
      return this;
    } else if (this.parent) {
      return this.parent.findDefiningScope(name);
    } else {
      return null;
    }
  }
}

module.exports = Scope;
