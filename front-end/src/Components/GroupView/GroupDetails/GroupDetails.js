import React from "react";
import classes from "./GroupDetails.module.css";
import { Divider } from "@material-ui/core";

const GroupDetails = (props) => {
  const {
    card_description,
    card_title,
    creator,
    startDate,
    endDate,
  } = props.details;

  return (
    <div className={classes.Container}>
      <div className={classes.TopCon}>
        <div
          style={{
            borderRight: "1px solid black",
            paddingTop: "5%",
            paddingLeft: "5%",
            paddingRight: "5%",
          }}
        >
          <p>{card_title}</p>
          <Divider />

          <p className={classes.Button} onClick={props.click}>
            JOIN CARD
          </p>
        </div>
        <div
          style={{ paddingTop: "5%", paddingLeft: "5%", paddingRight: "5%" }}
        >
          <p>{startDate}</p>
          <Divider />
          <div>
            <p>{endDate}</p>
          </div>
          <p style={{ marginTop: "5%" }}>{creator}</p>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
