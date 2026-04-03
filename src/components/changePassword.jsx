/** @format */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FocusTrap from "focus-trap-react";
import axios from "axios";
import TextField from "./TextField";
import Button from "./Button";
import useCallData from "../hooks/useCallData";
import { UserContext } from "../contexts/UserContext";
import changePassword from "./changePassword.module.css";
import { SERVER_DOMAIN } from "../constants";
import serverInstance from "../api/client";

function ChangePassword({ setVis }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { authUserHome, isAuthenticated, setIsAuthenticated, setAuthUserHome } =
    useContext(UserContext);

  const submit = () => {
    if (password !== "" && confirmPassword !== "" && password === confirmPassword) {
      let pwUpdate = {
        userId: isAuthenticated,
        password: password,
        confirm_password: confirmPassword,
      };

      serverInstance
        .post(`/users/edituser/`, pwUpdate)
        .then((response) => {
          if (response.status === 200) {
            setVis(false);
            //change password invalidates tokens, so login is required.
            navigate("/login");
          }
        })
        .catch((e) => {navigate("/login")});
    } else {
      //TODO: Add error message for user
      setVis(false);
    }
  };

  return (
    <FocusTrap>
      <div className={changePassword.homeBG}>
        <div className={changePassword.homeDialog}>
          <div className={changePassword.homeContent}>
            <span className={changePassword.homeTitle}>
              Change your password...
            </span>
            <div className={`${changePassword.inputCont} ${changePassword.inputAdapt}`}>
              <div className={changePassword.textField}>
                {/*<label className={home.callLabel}>Callsign: </label>*/}
                <TextField
                  fieldContainerStyle={changePassword.formFields}
                  value={password}
                  setValue={setPassword}
                  placeHolder="New Password"
                  isValid={true}
                  password
                  keyDown={(e) => {
                    if (e.key === "Enter") {
                      submit();
                    }
                  }}
                />
                <TextField
                  fieldContainerStyle={changePassword.formFields}
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  placeHolder="Confirm Password"
                  isValid={true}
                  password
                  keyDown={(e) => {
                    if (e.key === "Enter") {
                      submit();
                    }
                  }}
                />
                {/*TODO: Add error message for user */}
              </div>
              {/*<span className={home.demo}>* Enter "DEMO" for testing</span>*/}
            </div>

            <div className={changePassword.inputCont}>
              <Button name="Submit" clickEvent={submit} />
              <Button
                name="Cancel"
                clickEvent={() => {
                  setVis(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}

export default ChangePassword;
