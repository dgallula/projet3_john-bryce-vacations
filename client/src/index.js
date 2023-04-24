import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as BS } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stateManagement/store.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BS>
    <Provider store={store}>
      <App />

    </Provider>
  </BS>
  // </React.StrictMode>
);
