const babel = require('@babel/core');

const sourceCode = `
    <h1>
        hello <span style={{ color: 'red' }}>world</span>
    </h1>
`;

const res = babel.transform(sourceCode, {
    plugins: [
        // ["@babel/plugin-transform-react-jsx", { runtime: 'classic' }]
        ["@babel/plugin-transform-react-jsx", { runtime: 'automatic' }]
    ],
});


console.log(res.code);