import React from "react";
import classes from "./challengeOverview.module.css";
import { Divider } from "@material-ui/core";
import Tick from "../../../Ui/Icons/tick";
import Cross from "../../../Ui/Icons/cross";
//overview component
const ChallengeOverview = (props) => {
  //component recieves the challenge details
  const challenge = props.challenge;
  
  let startDate = "";
  let endDate = "";
  let creator = "multi-part";
  if (challenge.creator) {
    creator = challenge.creator;
  }
 
  if (creator === "test") creator = "multi-part"; //this is temporary until i find where test is coming from
  if (challenge.start_date) {
    startDate = challenge.start_date.split("T")[0];
    endDate = challenge.end_date.split("T")[0];
  }
  if(challenge.startDate){
    
    if(challenge.startDate.includes('T')){
      
      startDate = challenge.startDate.split("T")[0];
    endDate = challenge.endDate.split("T")[0];
    } else{
    startDate = challenge.startDate
    endDate = challenge.endDate;
    }
  }

  let requirments = null;
  if (challenge.distance || challenge.elevation) {
    requirments = (
      <div>
        <div className={classes.SpecificReq}>
          {challenge.distance > 0 || challenge.distance !== false ? (
            <p style={{ fontWeight: "10px", borderRight: "1px solid black" }}>
              Activity must be equal or longer than {challenge.distance} miles
            </p>
          ) : null}
          {challenge.elevation > 0 || challenge.elevation !== false ? (
            <p style={{ fontWeight: "10px" }}>
              Total Elevation must be equal or greater than{" "}
              {challenge.elevation} ft
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  const clickToProfile = () => {
    
  };
  return (
    <div className={classes.OverviewCon}>
      <div className={classes.TopCon}>
        <div className={classes.Title}>
          <p>{challenge.title || challenge.challenge_title}</p>
          <Divider />
        </div>
        <div className={classes.Dates}>
          <p>START: {startDate}</p>
          <Divider />
          <p>END: {endDate}</p>
        </div>
      </div>
      <div style={{ paddingLeft: "5%", paddingRight: "5%" }}>
        <Divider />
        <h3
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontFamily: "Crushed-regular",
            color: "rgb(114, 134, 248)",
          }}
        >
          Requirments
        </h3>
      </div>
      <div className={classes.RequirmentsCon}>
        <div style={{ borderRight: "1px solid black" }}>
          <p style={{ fontWeight: "bold" }}>GPS</p>
          <div className={classes.Containers}>
            {challenge.gps ? (
              <Tick className={classes.Tick} />
            ) : (
              <Cross className={classes.Cross} />
            )}
          </div>
        </div>
        <div style={{ borderRight: "1px solid black" }}>
          <p style={{ fontWeight: "bold" }}>IMAGE</p>
          <div className={classes.Containers}>
            {challenge.photo ? (
              <Tick className={classes.Tick} />
            ) : (
              <Cross className={classes.Cross} />
            )}
          </div>
        </div>
        <div>
          <p style={{ fontWeight: "bold" }}>DESCRIPTION</p>
          <div className={classes.Containers}>
            {challenge.userDescription ? (
              <Tick className={classes.Tick} />
            ) : (
              <Cross className={classes.Cross} />
            )}
          </div>
        </div>
      </div>
      {challenge.distance || challenge.elevation ? (
        <div className={classes.GpsRequirments}>{requirments}</div>
      ) : null}

      <div style={{ paddingLeft: "5%", paddingRight: "5%" }}>
        <div className={classes.Description}>
          <p style={{ padding: "5%", textAlign: "left", fontSize: "20px" }}>
            {challenge.description || challenge.challenge_description}
          </p>
        </div>
      </div>
      <div className={classes.Creator}>
        <p
          style={{ fontWeight: "bold", color: "rgb(114, 134, 248)" }}
          onClick={clickToProfile}
        >
          {creator || "multi-part"}
        </p>
      </div>
    </div>
  );
};

export default ChallengeOverview;
