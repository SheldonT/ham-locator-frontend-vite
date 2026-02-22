/** @format */

import { useEffect, useState, useContext } from "react";
import useCallData from "../hooks/useCallData";
import axios from "axios";
import InfoBar from "./InfoBar";
import CallMap from "./CallMap";
import InputBar from "./InputBar";
import SaveLog from "./SaveLog";
import ClearTable from "./ClearTable";
import location from "./location.module.css";
import { UserContext } from "../contexts/UserContext";
import { LogContext } from "../contexts/LogContext";
import { SettingsContext } from "../contexts/SettingsContext";
import { SERVER_DOMAIN } from "../constants";
import serverInstance from "../api/client";
import { json } from "react-router-dom";

function validateEntry(entry, currentList) {
  let result = false;

  if (currentList.find((c) => entry.id === c.id) !== undefined) result = true;

  return result;
}

export const utcHrs = (date) => {
  if (date.getUTCHours() < 10) {
    return "0" + date.getUTCHours();
  } else {
    return date.getUTCHours();
  }
};

export const utcMins = (date) => {
  if (date.getUTCMinutes() < 10) {
    return "0" + date.getUTCMinutes();
  } else {
    return date.getUTCMinutes();
  }
};

export const utcSeconds = (date) => {
  if (date.getUTCSeconds() < 10) {
    return "0" + date.getUTCSeconds();
  } else {
    return date.getUTCSeconds();
  }
};

export const formatDate = (date) => {
  let day = "";
  let month = "";

  if (parseInt(date.getUTCMonth() + 1) < 10) {
    month = `0${date.getUTCMonth() + 1}`;
  } else {
    month = date.getUTCMonth() + 1;
  }

  if (parseInt(date.getUTCDate()) < 10) {
    day = `0${date.getUTCDate()}`;
  } else {
    day = date.getUTCDate();
  }

  return date.getUTCFullYear() + "-" + month + "-" + day;
};

function Location() {
  const [contactInfo, setContactInfo] = useState({});
  //const [infoList, setInfoList] = useState([]);
  const [extraInfo, setExtraInfo] = useState({});
  const [id, setId] = useState(1);

  const jsonResp = useCallData(contactInfo.contactCall);

  const { isAuthenticated, authUserHome } = useContext(UserContext);
  const { optionalFields, lines } = useContext(SettingsContext);
  const { log, setLog } = useContext(LogContext);

  const resetTable = () => {
    setId(1);
    //setInfoList([]);
    setLog([]);
  };

  useEffect(() => {
    const insertToDB = async (newData) => {
      const newRecord = {
        userId: isAuthenticated,
        lat: parseFloat(newData.anchor[0]),
        lng: parseFloat(newData.anchor[1]),
        ...newData,
        freq: parseFloat(newData.freq),
        sigRepSent: parseInt(
          newData.sigRepSent === "" ? "0" : newData.sigRepSent
        ),
        sigRepRecv: parseInt(
          newData.sigRepRecv === "" ? "0" : newData.sigRepRecv
        ),
        serialSent: parseInt(
          newData.serialSent === "" ? "0" : newData.serialSent
        ),
        serialRecv: parseInt(
          newData.serialRecv === "" ? "0" : newData.serialRecv
        ),
        utc: parseInt(newData.utc === "" ? "0" : newData.utc),
      };

      delete newRecord.anchor;

      console.log(newRecord);

      try {
        await serverInstance.post(`/logs/addrecord/`, newRecord);
      } catch (error) {
        console.log(error);
      }
    };

    if (validateEntry(jsonResp, log /*infoList*/)) {
      console.log("An error occured. Please try again.");
    } else {
      if (jsonResp.anchor && contactInfo) {
        const currDate = new Date();
        const utcDate = formatDate(currDate);

        const utcTime =
          utcHrs(currDate) +
          ":" +
          utcMins(currDate) +
          ":" +
          utcSeconds(currDate);

        setId(id + 1);

        //setInfoList
        setLog((previousInfo) => {
          const newData = {
            ...contactInfo,
            ...jsonResp,
            id: id,
            contactDate: utcDate,
            contactTime: utcTime,
          };

          insertToDB(newData);

          let dataCollection = [newData, ...previousInfo];

          //localStorage.setItem("list", JSON.stringify(dataCollection));

          dataCollection.sort((a, b) => {
            return new Date(b.contact_date) - new Date(a.contact_date);
          });

          return dataCollection;
        });
      }
    }
  }, [jsonResp]);

  useEffect(() => {
    //const storedData = JSON.parse(localStorage.getItem("list") || "[]");

    const getLog = async () => {
      try {
        const response = await serverInstance.get(`/logs/`, {
          params: { decend: true },
        });

        if (response.data.data.records.length !== 0) {
          setId(response.data.data.records.length + 1);
          let data = response.data.data.records;

          for (let i = 0; i < data.length; i++) {
            data[i].anchor = [data[i].lat, data[i].lng];
            data[i].id = data.length - i;

            data[i].contactDate = data[i].contactDate.slice(0, 10);

            delete data[i].lat;
            delete data[i].lng;
            delete data[i].userId;
          }

          data.sort((a, b) => {
            return new Date(b.contactDate) - new Date(a.contactDate);
          });
          
          
          //setInfoList(data);
          setLog(data);
        } else {
          resetTable();
        }
      } catch (e) {
        if (e.response?.status === 401 || e.response?.status === 403) {
        console.log('Invalid credentials');
       
      } else {
        console.error('Login error:', e);
      }
      }
    };

    getLog();
  }, []);

  return (
    <>
      <div className={location.map}>
        <CallMap
          info={log /*infoList*/}
          infoLastId={id}
          selectedInfo={extraInfo}
          click={setExtraInfo}
          drawLines={lines}
        />

        <InputBar
          setInfo={setContactInfo}
          resetExtra={setExtraInfo}
          optionalFields={optionalFields}
        />
      </div>
      <div
        className={location.tutorial}
        style={{
          display: authUserHome.call === "DEMO" ? "block" : "none",
        }}
      >
        Need help? Watch my{" "}
        <a
          href="https://www.loom.com/share/b920f56b108c47efb60675f31806721a"
          target="_blank"
          rel="noreferrer"
        >
          tutorial video
        </a>
        .
      </div>
      <InfoBar info={/*infoList*/ log} click={setExtraInfo} editField={false} />

      <div className={location.controlBar}>
        {/*<SaveLog>Save Log</SaveLog>*/}
      </div>
    </>
  );
}

export default Location;
