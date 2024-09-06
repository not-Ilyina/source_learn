// import ReactDOM from "react-dom";
// ReactDOM.render("hello", document.getElementById("root"));
import React from "react"; // pnpm link 到了自己写的 react
import ReactDOM from "react-dom";
function App() {
  return (
    <div>
      {/* <span>big react</span>
       */}
      <Sub />
    </div>
  );
}

console.log(<div key="123"></div>);

function Sub() {
  return <span>big react</span>;
}

// const jsx = (
//   <div>
//     <span>big react</span>
//   </div>
// );
const root = document.querySelector("#root");

// console.log(<App />);
ReactDOM.createRoot(root).render(<App />);
// ReactDOM.createRoot(root).render(a);
