/** @format */

import ReactDOM from "react-dom/client";
import {UserProvider} from "./contexts/UserContext";
import {LogProvider} from "./contexts/LogContext";
import {SettingsProvider} from "./contexts/SettingsContext";
import App from "./App.jsx";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <LogProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </LogProvider>
  </UserProvider>
);