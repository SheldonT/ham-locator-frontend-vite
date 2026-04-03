/** @format */

import { useState} from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../components/TextField";
import Button from "../components/Button";
import passwordReset from "./passwordReset.module.css";
import serverInstance from "../api/client";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const submitLogin = async () => {

    try {
      await serverInstance.post("/users/password-reset/", { "email": email });
    } catch (error) {
      // console.error("Error triggering password reset:", error);
    }
    
    setTimeout(() => {
        navigate("/login");
    }, 3000);
  };

  return (
    <div className={passwordReset.loginBG}>
      <div className={passwordReset.main}>
        <h3>Reset Password</h3>

        <TextField
          fieldContainerStyle={passwordReset.customFieldCont}
          value={email}
          setValue={setEmail}
          placeHolder="Email Address"
          isValid={true}
        />
        {isSubmitted && email !== "" ? (
          <div className={passwordReset.successMsgBox}><p className={passwordReset.message}>Reset request submitted. Please check your email for further instructions.</p></div>
        ) : isSubmitted && email === "" ? (
          <div className={passwordReset.errorMsgBox}><p className={passwordReset.message}>Please enter a valid email address.</p></div>
        ) : null}
        <div className={passwordReset.login}>
          <Button
            name="Reset Password"
            clickEvent={() => {
              // In a real app, you would also trigger the password reset process here
                setIsSubmitted(true);
                if (email !== "") {
                  submitLogin();
                } else {
                    setTimeout(() => {
                    setIsSubmitted(false);
                  }, 3000);
                }

            }}
          />
          <Button
            name="Cancel"
            clickEvent={() => {
              // In a real app, you would also trigger the password reset process here
              navigate("/login");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
