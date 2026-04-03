/** @format */

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import TextField from "../components/TextField";
import Button from "../components/Button";
import login from "./login.module.css";
import { UserContext } from "../contexts/UserContext";

function Login() {
  const [userName, setUserName] = useState("");
  const [passwd, setPasswd] = useState("");

  const { authenticate, isAuthenticated, removeAuthenticated } = useContext(UserContext);

  const submitLogin = () => {
    authenticate(userName, passwd);
  };

  const guestLogin = () => {
    authenticate("DEMO", "Dem01234");
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      submitLogin();
    }
  };

  return (
    <div className={login.loginBG}>
      <div className={login.main}>
        <h3>Login</h3>
        <TextField
          fieldContainerStyle={login.customFieldCont}
          value={userName}
          setValue={setUserName}
          placeHolder="Email Address"
          isValid={true}
          keyDown={onEnter}
          focusCallback={removeAuthenticated}
        />

        <TextField
          fieldContainerStyle={login.customFieldCont}
          value={passwd}
          setValue={setPasswd}
          placeHolder="Password"
          isValid={true}
          password={true}
          keyDown={onEnter}
          focusCallback={removeAuthenticated}
        />
        {isAuthenticated === "-1" ? (
          <div className={login.errorMsg}>Invalid email or password.</div>
        ) : null}

        <Link to="/password-reset">Forgot Password</Link>

        <div className={login.login}>
          <Button
            name="Login"
            clickEvent={() => {

                submitLogin();
              
            }}
          />
        </div>
        <div className={login.newAccount}>
          <p>
            Not registered? <Link to="/register">Create an account.</Link>
          </p>

          {/* <p>
            or click{" "}
            <a href="#" onClick={() => guestLogin()}>
              here
            </a>{" "}
            to login as a guest.
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
