/** @format */

import ReactDOM from "react-dom/client";
import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Layout from "./pages/Layout";
import About from "./pages/About";
import HowTo from "./pages/HowTo";
import Stats from "./pages/Stats";
import Log from "./pages/Log";
import Location from "./components/Location";
import Login from "./pages/Login";

import Register from "./pages/Register";
import UserProvider, { UserContext } from "./contexts/UserContext";
import LogProvider from "./contexts/LogContext";
import SettingsProvider from "./contexts/SettingsContext";

import { SERVER_DOMAIN } from "./constants";

import "./index.css";

function HamLocator() {
  const [home, setHome] = useState(false);

  const { isAuthenticated, setHomeDataFromDB } = useContext(UserContext);

  useEffect(() => {
    if (!["-1", "0"].includes(isAuthenticated)) {
      setHomeDataFromDB();
    }
  }, [isAuthenticated]);

  const IndexRoute = () => {
    if (isAuthenticated !== "0" && isAuthenticated !== "-1") {
      return <Location />;
    }

    return <Login />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              showHome={home}
              setHome={setHome}
            />
          }
        >
          <Route index element={<IndexRoute />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="instructions" element={<HowTo />} />
          <Route path="about" element={<About />} />
          <Route path="stats" element={<Stats />} />
          <Route path="log" element={<Log />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <LogProvider>
      <SettingsProvider>
        <HamLocator />
      </SettingsProvider>
    </LogProvider>
  </UserProvider>
);
