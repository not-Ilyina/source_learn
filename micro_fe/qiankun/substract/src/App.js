import React, { useEffect } from "react";
import "./App.css";

import { BrowserRouter, Link } from "react-router-dom";
import { loadMicroApp } from "qiankun";
function App() {
  const containerRef = React.createRef();

  useEffect(() => {
    loadMicroApp({
      name: "m-static",
      entry: "//localhost:8080",
      container: containerRef.current,
    });
  });
  return (
    <div className="App">
      <BrowserRouter>
        <Link to="/react">React</Link>
        <Link to="/vue">Vue</Link>
      </BrowserRouter>
      <div ref={containerRef}></div>
      <div id="container"></div>
    </div>
  );
}

export default App;
