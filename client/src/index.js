import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter } from "react-router-dom";
import App from "./App";

// Use "BrowserRouter" to provide a "Router-Link" similar thing from VueJS
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
