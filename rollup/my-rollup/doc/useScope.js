const { name } = require("../../rollup-use/src/msg");
const Scope = require("./scope");

var a = 1;
function one() {
  var b = 2;
  function two() {
    var c = 3;
    console.log(a, b, c);
  }
}

let globalScope = new Scope({
  name: "global",
  parent: null,
  names: ["a"],
});

let oneScope = new Scope({
  name: "oneScope",
  names: ["b"],
  parent: globalScope,
});

let twoScope = new Scope({
  name: "twoScope",
  names: ["c"],
  parent: oneScope,
});

console.log(
  twoScope.findDefiningScope("a").name,
  twoScope.findDefiningScope("b").name,
  twoScope.findDefiningScope("c").name,
  twoScope.findDefiningScope("d")
);
