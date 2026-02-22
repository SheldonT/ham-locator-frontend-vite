/** @format */
import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import About from "./pages/About";
import HowTo from "./pages/HowTo";
import Stats from "./pages/Stats";
import Log from "./pages/Log";
import Location from "./components/Location";
import Login from "./pages/Login";

import Register from "./pages/Register";
import {UserContext } from "./contexts/UserContext";


import "./index.css";

function App() {
  const [home, setHome] = useState(false);

  const { isAuthenticated, setHomeDataFromDB, isCheckingAuth } = useContext(UserContext);

  useEffect(() => {
    if (!["-1", "0", null].includes(isAuthenticated)) {
      setHomeDataFromDB();
    }
  }, [isAuthenticated]);

  const IndexRoute = () => {
    if (isAuthenticated !== "0" && isAuthenticated !== "-1" && isAuthenticated !== null) {
      return <Location />;
    }

    return <Login />;
  };

  // Don't render anything until auth check completes
  if (isCheckingAuth || isAuthenticated === null) {
    return null; // Or return a loading spinner component
  }

  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_ROUTE || '/'}>
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

export default App;
