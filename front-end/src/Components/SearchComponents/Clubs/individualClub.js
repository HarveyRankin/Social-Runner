import React from "react";
import classes from "./individualClub.module.css";
import { Button } from "@material-ui/core";
import Tick from "../../../Ui/Icons/tick";

const IndividualClub = (props) => {
  return (
    <div
      className={classes.Container}
      style={{
        fontSize: "25px",
        fontWeight: "bold",
        position: "relative",
        zIndex: "9999",
        display: "flex",
        padding: "3%",
        backgroundColor: "rgba(200, 244, 253, 0.787)",
        borderBottom: "1px solid rgb(0, 0, 92)",
      }}
    >
      <p className={classes.IndividualSearch}>{props.club}</p>
      <div style={{ marginLeft: "auto" }}>
        {props.joined ? (
          <Tick style={{ color: "blue" }} />
        ) : (
          <Button onClick={props.follow} color="secondary" variant="outlined">
            Follow
          </Button>
        )}
      </div>
    </div>
  );
};

export default IndividualClub;
