class Scope {
  constructor(options) {
    this.name = options.name; // 作用域名称
    this.parent = options.parent; // 父作用域
    this.names = options.names || []; //
  }
  addName(name) {
    this.names.push(name);
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
