/** @format */

import { useContext, useState } from "react";
import { saveAs } from "file-saver";
import { bandDef } from "../constants";
import PopUp from "./PopUp";
import Button from "./Button";
import saveLog from "./saveLog.module.css";
import serverInstance from "../api/client";

function SaveLog({ children }) {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [fileType, setFileType] = useState("adif");
  const [fileName, setFileName] = useState("");

  const getLog = async (format) => {
    try{
      const response = await serverInstance.get(`/logs/exportlog/${format}`);

      const log = response.data
      const fileSuffix = format === "adif" ? "adi" : "csv";
      const blob = new Blob(
        [log],
        { type: "text/plain" }
      );

      const finalFileName = fileName.trim() === "" ? `log_${new Date().toISOString().replace(/[:.]/g, "-")}` : fileName;


      saveAs(blob, finalFileName + "." + fileSuffix);

    } catch (error) {
      console.error("Error fetching log:", error);
    }
  };

  return (
    <div className={saveLog.saveFile}>
      <div
        onClick={() => {
          setIsPopUpOpen(!isPopUpOpen);
        }}
      >
        {children}
      </div>
      <PopUp styleCSS={saveLog.popUp} show={isPopUpOpen}>
        <span>Save File...</span>

        <div className={saveLog.fileNameInput}>
          <input
            type="radio"
            name="fileType"
            id="adif"
            value="adif"
            checked={fileType === "adif"}
            onChange={(e) => setFileType(e.target.value)}
          />
          <label htmlFor="adif">ADIF</label>
          <input
            style={{ marginLeft: "1rem" }}
            type="radio"
            name="fileType"
            id="csv"
            value="csv"
            checked={fileType === "csv"}
            onChange={(e) => setFileType(e.target.value)}
          />
          <label htmlFor="csv">CSV</label>
        </div>

        <div className={saveLog.fileNameInput}>
          <input
            autoFocus
            className={saveLog.fileName}
            id="fileName"
            type="text"
            placeholder="File Name"
            // value={fileName}
            defaultValue={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                getLog(fileType);
                setIsPopUpOpen(false);
              }
            }}
          />
          <span>.{fileType}</span>
        </div>
        <div className={saveLog.popUpButtons}>
          <Button
            name="Save"
            clickEvent={() => {
              getLog(fileType);
              setIsPopUpOpen(false);
            }}
          />
          <Button name="Cancel" clickEvent={() => setIsPopUpOpen(false)} />
        </div>
      </PopUp>
    </div>
  );
}

export default SaveLog;
