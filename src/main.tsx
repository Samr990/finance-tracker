import ReactDOM from "react-dom/client"; // Use 'react-dom/client' for React 18
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css"; // Import Tailwind styles

// Create a root and render the app
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <div className="bg-gray-100 min-h-screen flex justify-center p-0 m-0">
      <div className="w-full bg-white shadow-lg rounded-lg ">
        <App />
      </div>
    </div>
  </Provider>
);
