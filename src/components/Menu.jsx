/** @format */

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import menuImg from "../assets/hamburgerMenu.svg";
import menu from "./menu.module.css";
import PopUp from "./PopUp";

function Menu() {
  const [openMenu, setOpenMenu] = useState(false);

  const nav = useNavigate();

  const { isAuthenticated } = useContext(UserContext);

  const navigateTo = (path) => {
    nav(path);
    setOpenMenu(false);
  };

  return (
    <div
      className={menu.menuBar}
      style={{ display: isAuthenticated !== "0" ? "flex" : "none" }}
    >
      <div
        className={menu.menuEl}
        onClick={() => {
          navigateTo("/");
        }}
      >
        {" "}
        Home
      </div>
      <div
        className={menu.menuEl}
        onClick={() => {
          navigateTo("/log");
        }}
      >
        {" "}
        Full Log
      </div>
      <div
        className={menu.menuEl}
        onClick={() => {
          navigateTo("/stats");
        }}
      >
        {" "}
        Log Stats
      </div>
      <div
        className={menu.menuEl}
        onClick={() => {
          navigateTo("/instructions");
        }}
      >
        {" "}
        Instructions
      </div>
      <div
        className={menu.menuEl}
        onClick={() => {
          navigateTo("/about");
        }}
      >
        {" "}
        About
      </div>
      <div
        className={menu.hamburger}
        onClick={() => {
          setOpenMenu(!openMenu);
        }}
      >
        <img className={menu.menuImg} src={menuImg} />

        <PopUp styleCSS={menu.menu} show={openMenu}>
          <div
            className={menu.hMenuEl}
            onClick={() => {
              navigateTo("/");
            }}
          >
            Home
          </div>
          <div
            className={menu.hMenuEl}
            onClick={() => {
              navigateTo("/log");
            }}
          >
            Full Log
          </div>
          <div
            className={menu.hMenuEl}
            onClick={() => {
              navigateTo("/stats");
            }}
          >
            Log Stats
          </div>
          <div
            className={menu.hMenuEl}
            onClick={() => {
              navigateTo("/instructions");
            }}
          >
            Instructions
          </div>
          <div
            className={menu.hMenuEl}
            onClick={() => {
              navigateTo("/about");
            }}
          >
            About
          </div>
        </PopUp>
      </div>
    </div>
  );
}

export default Menu;
