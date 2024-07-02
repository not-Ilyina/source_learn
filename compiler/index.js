const { tokenizer, parser, transformer, codeGenerator, compiler } = require('./compiler.js');

const assert = require('assert');

const input  = '(add 2 (subtract 4 2))';
const output = 'add(2, subtract(4, 2));';

// 测试用例
const tokens = [
    { type: 'paren',  value: '('        },
    { type: 'name',   value: 'add'      },
    { type: 'number', value: '2'        },
    { type: 'paren',  value: '('        },
    { type: 'name',   value: 'subtract' },
    { type: 'number', value: '4'        },
    { type: 'number', value: '2'        },
    { type: 'paren',  value: ')'        },
    { type: 'paren',  value: ')'        }
];

// 下一步需要把 tokens 转成 AST

const ast = {
    type: 'Program',
    body: [{
        type: 'CallExpression',
        name: 'add',
        params: [
            {
                type: 'NumberLiteral',
                value: '2',
            }, 
            {
                type: 'CallExpression',
                name: 'subtract',
                params: [
                    {
                        type: 'NumberLiteral',
                        value: '4',
                    },
                    {
                        type: 'NumberLiteral',
                        value: '2',
                    }
                ],
            }
        ],
    }],
}

// 需要把这个 ast 转化成一个更加具体的 ast transformer 函数

const newAst = {
    type: 'Program',
    body: [
        {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: {
                    type: 'Identifier',
                    name: 'add',
                },
                arguments: [
                    {
                        type: 'NumberLiteral',
                        value: '2',
                    },
                    {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'subtract',
                        },
                        arguments: [
                            {
                                type: 'NumberLiteral',
                                value: '4',
                            },
                            {
                                type: 'NumberLiteral',
                                value: '2',
                            },
                        ],
                    },
                ],
            },
        },
    ],
};

// const ts = tokenizer(input); // 词法分析
// console.log("🚀 ~ ts:", ts);
// const paserOut = parser(tokens);
// console.log("🚀 ~ paserOut:", paserOut);
// const trans = transformer(ast);
// console.log("🚀 ~ trans:", trans.body[0].expression.callee);
// const code = codeGenerator(newAst);
// console.log("🚀 ~ code :", code )

assert.deepEqual(tokenizer(input), tokens, 'token 不相等');
assert.deepEqual(parser(tokens), ast, 'ast 不相等');
assert.deepEqual(transformer(ast), newAst, 'newAst 不相等');
assert.deepEqual(codeGenerator(newAst), output, 'code 不相等');
assert.deepEqual(compiler(input), output, 'compiler 不相等');
console.log('测试成功');