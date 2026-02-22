/** @format */
import { useContext } from "react";
import { countryCode } from "../constants";
import Flag from "react-world-flags";
import { getDistance } from "geolib";
import { UserContext } from "../contexts/UserContext";
import extraInfo from "./extraInfo.module.css";

function ExtraInfo({ info, infoStyle }) {
  const { authUserHome } = useContext(UserContext);

  let code;
  let locDetails;
  let callSign;
  let time;
  let itu;
  let distance = "";

  if (info) {
    const countryInfo = countryCode.find((c) => c.name === info.country);

    if (countryInfo) code = countryInfo.countryCode;

    locDetails = info.details;
    callSign = info.contactCall;

    if (info?.call) callSign = info.call;

    time = info.utc ? (
      <div className={extraInfo.extraDetails}>Time Zone: {info.utc} UTC </div>
    ) : null;
    itu = info.itu ? (
      <div className={extraInfo.extraDetails}> ITU Zone: {info.itu}</div>
    ) : null;
  }
  

  try{
  if (authUserHome && Object.keys(authUserHome).length !== 0 && info && !info.prefix && Object.keys(info).length !== 0) {


    let dist = getDistance(
      // {latitude: 47.5615, longitude: -52.7126},
      // {latitude: 51.5074, longitude: -0.1278}
      { latitude: authUserHome.anchor[0], longitude: authUserHome.anchor[1] },
      { latitude: info.anchor[0], longitude: info.anchor[1] }
    );

    if (authUserHome.unit === "imperial") {
      dist = Math.round(dist * 0.000621371, 0);
    } else {
      dist = Math.round(dist / 1000, 1000);
    }

    distance = (
      <div className={extraInfo.extraDetails}>
        Distance:{" "}
        {dist
          .toString()
          .concat(authUserHome.unit === "imperial" ? " mi" : " km")}
      </div>
    );
  }
  } catch (e) {

    console.log("Error calculating distance: ", e);
  }

  return (
    <div className={extraInfo.markerInfo} style={infoStyle ? infoStyle : null}>
      <div className={extraInfo.extraHeader}>
        {callSign ? callSign : "Unknown Country"}
        <div className={extraInfo.flagIcon}>
          <Flag code={code} height={20} />
        </div>
      </div>
      {locDetails ? (
        <div className={extraInfo.extraRow}>
          <div className={extraInfo.extraDetails}>{locDetails}</div>
        </div>
      ) : null}
      {time ? <div className={extraInfo.extraRow}>{time}</div> : null}
      {itu ? <div className={extraInfo.extraRow}>{itu}</div> : null}
      {distance !== "" ? (
        <div className={extraInfo.extraRow}>{distance}</div>
      ) : null}
    </div>
  );
}

export default ExtraInfo;
