import React from "react";
import classes from "./challengeToJoin.module.css";
import { Divider } from "@material-ui/core";
import Tick from "../../../Ui/Icons/tick";
import Cross from "../../../Ui/Icons/cross";

const ChallengeToJoin = ({
  id,
  distance,
  title,
  elevation,
  creator,
  start_date,
  end_date,
  click,
  score,
  image,
  gps,
  description,
}) => {
  const endDate = end_date.split("T")[0];
  return (
    <div onClick={() => click(id)} className={classes.Challenge}>
      <div style={{ borderBottom: "1px solid black" }}>
        <p style={{ fontSize: "15px", marginBottom: "1%" }}>{title}</p>
      </div>
      <div style={{ borderBottom: "1px solid black" }} className={classes.Date}>
        <div style={{ borderRight: "1px solid black" }}>
          <p style={{ fontSize: "15px" }}>Default Score</p>
          <p style={{ fontSize: "10px" }}>{score}</p>
        </div>
        <p style={{ fontSize: "10px" }}>End: {endDate} </p>
      </div>
      <div className={classes.Requirments}>
        <div className={classes.Gps} style={{ borderRight: "1px solid black" }}>
          <p style={{ fontSize: "15px" }}>GPS</p>
          {gps ? (
            <Tick style={{ marginTop: "1%" }} />
          ) : (
            <Cross style={{ marginTop: "1%" }} />
          )}
        </div>
        <div style={{ borderRight: "1px solid black" }}>
          <p style={{ fontSize: "15px" }}>Image</p>
          {image ? (
            <Tick style={{ marginTop: "1%" }} />
          ) : (
            <Cross style={{ marginTop: "1%" }} />
          )}
        </div>
        <div>
          <p style={{ fontSize: "15px" }}>description</p>
          {description ? (
            <Tick style={{ marginTop: "1%" }} />
          ) : (
            <Cross style={{ marginTop: "1%" }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeToJoin;
