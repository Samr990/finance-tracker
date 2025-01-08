import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css"; // Import Tailwind styles

ReactDOM.render(
  <Provider store={store}>
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        <App />
      </div>
    </div>
  </Provider>,
  document.getElementById("root")
);
