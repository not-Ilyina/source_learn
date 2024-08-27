import { createRoot } from './react-dom/client';
let ele = (
    <h1>
        hello <span style={{ color: 'red' }}>world</span>
    </h1>
);

// 虚拟 DOM => Host Element

const root = createRoot(document.getElementById('root'));

console.log(root);
// root.render(ele);