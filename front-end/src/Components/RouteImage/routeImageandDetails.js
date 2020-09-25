import React from "react";
import classes from "./routeImageandDetails.module.css";
import { Divider } from "@material-ui/core";

//gps details that are attached to the submission
const RouteImageAndDetails = (props) => {
  const challenge = props.challenge;
  let totalTimeInSeconds = challenge.time * 60;
  let result = new Date(null, null, null, null, null, totalTimeInSeconds);
  const newTime = result.toTimeString().split(" ")[0].substring(3);
  challenge.runTime = +newTime;
  const gps = props.gpsImage;
  let gpsImage = null;
  //if gps exsists
  if (gps) {
    gpsImage =
      "https://maps.googleapis.com/maps/api/staticmap?size=1200x1500&zoom=14.5&path=weight:5%7Ccolor:red%7Cenc:" +
      gps +
      "&key=AIzaSyAL5Bh--JmVGRkOelmAx0kTlqRp1mOTM0M";
  }
  const renderHeader = (h1, h2) => {
    const header = [h1, h2];
    const arr = header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
    return arr;
  };
  const renderData = (arg1, arg2, addOn1, addOn2) => {
    return (
      <tr className={classes.TableData}>
        <td>
          {challenge[arg1]} {addOn1}
        </td>
        <td>
          {challenge[arg2]} {addOn2}
        </td>
      </tr>
    );
  };
  return (
    <div style={{ padding: "5px", backgroundColor: "#242426" }}>
      <div className={classes.Container}>
        {challenge.gpsRoute ? (
          <div style={{ display: "flex" }}>
            <div style={{ width: "100%" }}>
              <img
                className={classes.Image}
                style={{ textAlign: "center" }}
                src={gpsImage}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                margin: "1%",
              }}
            >
              <table className={classes.Table}>
                <tbody>
                  <tr
                    stlye={{
                      position: "fixed",
                      backgroundColor: "#242426",
                      borderBottomLeftRadius: "10px",
                      borderBottomRightRadius: "10px",
                    }}
                    className={classes.Header}
                  >
                    {renderHeader("distance", "elevation")}
                  </tr>
                  {renderData("gpsDistance", "elevationGain", "m", "ft")}
                </tbody>
              </table>
              <table className={classes.Table}>
                <tbody>
                  <tr
                    stlye={{
                      position: "fixed",
                      backgroundColor: "#242426",
                      borderBottomLeftRadius: "50px",
                      borderBottomRightRadius: "50px",
                    }}
                    className={classes.Header}
                  >
                    {renderHeader("time", "pace")}
                  </tr>
                  {renderData("time", "pace")}
                </tbody>
              </table>
              <div style={{ direction: "flex", justifyContent: "center" }}>
                <p>{challenge.score}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RouteImageAndDetails;


