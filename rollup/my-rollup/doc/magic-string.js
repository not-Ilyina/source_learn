var MagicString = require("magic-string");

var sorceCode = `export var name = 'ff'`;

var ms = new MagicString(sorceCode);
console.log("🚀 ~ ms:", ms.snip(0, 6).toString());

console.log(ms.remove(0, 7).toString());
