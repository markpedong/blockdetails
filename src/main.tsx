import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./pages/app";
import Root from "./pages/root";
import "./styles/global.module.scss";

const router = createBrowserRouter([
  { path: "/", element: <Root /> },
  { path: "/app", element: <App /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
