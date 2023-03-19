import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./pages/root";
import "./styles/global.module.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
