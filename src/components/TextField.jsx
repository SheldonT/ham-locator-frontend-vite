/** @format */
import { useState } from "react";
import PopUp from "./PopUp";
import attention from "../assets/attention.svg";
import inputField from "./inputField.module.css";

function TextField({
  fieldStyle,
  fieldContainerStyle,
  value,
  validate,
  setValue,
  placeHolder,
  keyDown,
  refrence,
  isValid,
  setValid,
  warning,
  setWarning,
  leaveFocus,
  focusCallback,
  exp,
  errMsg,
  errorPopupStyle,
  password,
  disarm,
}) {
  const [errorMsg, setErrorMsg] = useState(errMsg || "");
  const warningStyle = {
    borderColor: "red",
    borderWidth: "0.2rem",
    outlineWidth: "0.1rem",
  };
  const validStyle = {
    borderColor: "black",
  };

  return (
    <div className={`${inputField.fieldContainer} ${fieldContainerStyle}`}>
      <input
        className={`${inputField.field} ${fieldStyle}`}
        style={!isValid ? warningStyle : validStyle}
        ref={refrence}
        type={password ? "password" : "text"}
        placeholder={placeHolder}
        value={value}
        disabled={disarm ? true : false}
        data-testid="inputField"
        onChange={(e) => {
          const cleanValue = exp ? e.target.value.replace(exp, "") : e.target.value;
          setValue(cleanValue);

          if (validate) {
            setValid(validate(cleanValue, setErrorMsg));
          }
        }}
        onFocus={() => {
          if (setWarning && warning) {
            setWarning(false);
          }
          if (focusCallback) {
            focusCallback();
          }
        }}
        onBlur={(e) => {
          const cleanValue = exp ? e.target.value.replace(exp, "") : e.target.value;
          if (validate) {
            setValid(validate(cleanValue, setErrorMsg));
          }
          if (leaveFocus) {
            leaveFocus(cleanValue);
          }
        }}
        onKeyDown={(e) => {
          if (keyDown) keyDown(e);
        }}
      />

      <PopUp
        styleCSS={inputField.errorPopUp || errorPopupStyle}
        icon={attention}
        iconSize={{ height: "3rem", width: "3rem" }}
        show={warning}
      >
        <p className={inputField.errorText}>{errorMsg}</p>
      </PopUp>
    </div>
  );
}

export default TextField;
