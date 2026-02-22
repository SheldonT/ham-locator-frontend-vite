/** @format */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  validateCall,
  validatePasswd,
  validateEmail,
} from "../ValidateFunctions";
import TextField from "../components/TextField";
import Button from "../components/Button";
import login from "./login.module.css";
import useCallData from "../hooks/useCallData";
import { SERVER_DOMAIN } from "../constants";
import serverInstance from "../api/client";

function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [grid, setGrid] = useState("");
  const [unit, setUnit] = useState("metric");

  const [passwd, setPasswd] = useState("");
  const [passwdCheck, setPasswdCheck] = useState("");

  const [validCall, setValidCall] = useState(true);
  const [warningCall, setWarningCall] = useState(false);

  const [validPasswd, setValidPasswd] = useState(true);
  const [warningPasswd, setWarningPasswd] = useState(false);

  const [validEmail, setValidEmail] = useState(true);
  const [warningEmail, setWarningEmail] = useState(false);

  const [passwdMatchWarning, setPasswdMatchWarning] = useState(false);

  //const [body, setBody] = useState("{}");

  const newUserInfo = useCallData(userName);

  //const postNewUser = useFetchPost("/users/adduser", body);

  const callFocus = useRef();
  const passwdFocus = useRef();
  const passCheckFocus = useRef();
  const emailFocus = useRef();

  const nav = useNavigate();

  const errorPopupStyle = {
    marginTop: 0,
  };

  const cancel = () => {
    setUserName("");
    setEmail("");
    setGrid("");
    setUnit("metric");
    setPasswd("");
    setPasswdCheck("");

    setWarningCall(false);
    setWarningPasswd(false);
    setWarningEmail(false);
    setPasswdMatchWarning(false);

    nav("/");
  };

  const submit = () => {
    passwdFocus.current.focus();
    passCheckFocus.current.focus();
    emailFocus.current.focus();
    callFocus.current.focus();

    if (!validCall) {
      setWarningCall(true);
    }

    if (!validPasswd) {
      setWarningPasswd(true);
    }
    if (!validEmail) {
      setWarningEmail(true);
    }

    if (passwd !== passwdCheck) {
      setPasswdMatchWarning(true);
    }

    if (validCall && validPasswd && validEmail && passwd === passwdCheck) {
      serverInstance
        .post(`/users/adduser/`, {
          callsign: userName.toUpperCase(),
          email: email,
          country: newUserInfo.country,
          lat: parseFloat(newUserInfo.anchor[0]),
          lng: parseFloat(newUserInfo.anchor[1]),
          gridloc: grid,
          privilege: "user",
          units: unit,
          itu: parseInt(newUserInfo.itu),
          utc: parseFloat(newUserInfo.utc),
          password: passwd,
          confirm_password: passwdCheck,
        })
        .then((response) => {
          if (response.data.success) {
            nav("/");
          } else {
            alert(
              response.data.message
            );
          }
        })
        .catch((e) =>  alert(
              e.response?.data?.message ||
                "Registration failed. Please try again later."
            ));

      setWarningCall(false);
      setWarningPasswd(false);
      setWarningEmail(false);
      setPasswdMatchWarning(false);
    }
  };

  return (
    <div className={login.loginBG}>
      <div className={login.main}>
        <h3>Registration</h3>
        <div className={login.formContent}>
          <div className={login.formColumn}>
            <TextField
              fieldContainerStyle={login.customFieldCont}
              validate={validateCall}
              value={userName}
              setValue={setUserName}
              placeHolder="Callsign"
              setValid={setValidCall}
              isValid={validCall}
              setWarning={setWarningCall}
              warning={warningCall}
              refrence={callFocus}
              errorPopupStyle={errorPopupStyle}
            />
            <TextField
              fieldContainerStyle={login.customFieldCont}
              validate={validatePasswd}
              value={passwd}
              setValue={setPasswd}
              placeHolder="Password"
              setValid={setValidPasswd}
              isValid={validPasswd}
              warning={warningPasswd}
              setWarning={setWarningPasswd}
              refrence={passwdFocus}
              password={true}
            />
            <TextField
              fieldContainerStyle={login.customFieldCont}
              value={passwdCheck}
              setValue={setPasswdCheck}
              placeHolder="Retype Password"
              isValid={passwd === passwdCheck ? true : false}
              warning={passwdMatchWarning}
              setWarning={setPasswdMatchWarning}
              errMsg="Passwords don't match"
              refrence={passCheckFocus}
              password={true}
            />
          </div>
          <div className={login.formColumn}>
            <TextField
              fieldContainerStyle={login.customFieldCont}
              value={grid}
              setValue={setGrid}
              placeHolder="Grid"
              isValid={true}
            />
            <TextField
              fieldContainerStyle={login.customFieldCont}
              validate={validateEmail}
              value={email}
              setValue={setEmail}
              placeHolder="Email"
              setValid={setValidEmail}
              isValid={validEmail}
              warning={warningEmail}
              setWarning={setWarningEmail}
              refrence={emailFocus}
            />

            <span className={login.radioButtonLabel}>Measurement System:</span>
            <div className={login.radioButtonGroup}>
              <div className={login.radioButton}>
                <input
                  type="radio"
                  id="metric"
                  value="metric"
                  name="units"
                  defaultChecked
                  onChange={(e) => setUnit(e.target.value)}
                />
                <label htmlFor="metric">Metric</label>
              </div>
              <div className={login.radioButton}>
                <input
                  type="radio"
                  id="imperial"
                  value="imperial"
                  name="units"
                  onChange={(e) => setUnit(e.target.value)}
                />
                <label htmlFor="metric">Imperial</label>
              </div>
            </div>
          </div>
        </div>
        <div className={login.submit}>
          <Button
            style={login.registerButtons}
            name="Create Account"
            clickEvent={submit}
          />
          <Button
            style={login.registerButtons}
            name="Cancel"
            clickEvent={cancel}
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
