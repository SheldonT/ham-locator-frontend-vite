/** @format */

import { useContext, useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import logo from "../assets/hl-logo.svg";
import logout from "../assets/logoutIcon.svg";
import Menu from "../components/Menu";
import Home from "../components/Home";
import ChangePassword from "../components/changePassword";
import Settings from "../components/Settings";
import { UserContext } from "../contexts/UserContext";
import { LogContext } from "../contexts/LogContext";

function Layout(
//   {
//   showHome,
//   setHome,
// }
) {

  const [showHome, setShowHome] = useState(false)
  const [showResetPW, setShowResetPW] = useState(false);
  
  const navigate = useNavigate();

  const { logoutUser, isAuthenticated } = useContext(UserContext);
  const { setLog } = useContext(LogContext);

  const logoutAction = async () => {
    await logoutUser();
    setLog([]);

    navigate("/login");
  };

  return (
    <>
      <div className="title" id="title">
        <Link to="/">
          <img className="logo" src={logo} alt="" />{" "}
        </Link>
        <Menu />
        <div
          className="logoutBar"
          style={{ display: isAuthenticated !== "0" ? "flex" : "none" }}
        >
          <Settings setHomeVis={setShowHome} setResetPWVis={setShowResetPW} />
          <img
            className="logoutLogo"
            src={logout}
            alt="Logout"
            onClick={() => {
              logoutAction();
            }}
          />
        </div>
      </div>

      <div className="main" id="main">
        {showHome ? <Home setVis={setShowHome} /> : null}
        {showResetPW ? <ChangePassword setVis={setShowResetPW} /> : null}
        <Outlet />
      </div>
      <div className="footer">
        Version 1.1 made by{" "}
        <a href="https://twitter.com/Steegan" target="_blank" rel="noreferrer">
          SheldonT
        </a>{" "}
        (on{" "}
        <a
          href="https://github.com/SheldonT/Ham-Locator"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        ). <br />
        DXCC search powered by{" "}
        <a href="https://www.hamqth.com/" target="_blank" rel="noreferrer">
          HamQTH.com
        </a>
        . <br />
      </div>
    </>
  );
}

export default Layout;
