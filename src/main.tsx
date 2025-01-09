import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css"; // Import Tailwind styles

ReactDOM.render(
  <Provider store={store}>
    <div className="bg-gray-100 min-h-screen flex  justify-center p-0 m-0">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <App />
      </div>
    </div>
  </Provider>,
  document.getElementById("root")
);
