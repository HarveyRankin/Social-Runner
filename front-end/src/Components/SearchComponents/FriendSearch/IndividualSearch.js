import React from "react";
import { Divider, Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import classes from "./individual.module.css";
import Tick from "../../../Ui/Icons/tick";

const IndividualSearch = (props) => {
  let friendState = props.search;
  console.log(friendState);

  let buttonActive = (
    <Button
      onClick={() => props.click(props.click)}
      style={{ marginLeft: "auto" }}
      variant="contained"
      color="secondary"
    >
      Add
    </Button>
  );

  if (friendState === "pending your response") {
    buttonActive = (
      <div style={{ display: "flex", marginLeft: "auto" }}>
        <Button
          style={{ marginRight: "1%" }}
          onClick={props.rejectClick}
          variant="outlined"
          color="secondary"
        >
          Reject
        </Button>
        <Button onClick={props.clicked} variant="outlined" color="secondary">
          Accept
        </Button>
      </div>
    );
  }
  if (friendState === "friends") {
    buttonActive = (
      <Tick style={{ color: "green", width: "20%", marginLeft: "auto" }} />
    );
  }
  if (friendState === "pending response") {
    buttonActive = (
      <CircularProgress
        style={{ marginLeft: "auto", marginRight: "5%" }}
        color="primary"
      />
    );
  }
  const color = props.color;
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
        borderBottom: "1px solid black",
      }}
    >
      <p style={{ textAlign: "left" }}>{props.username}</p>
      {buttonActive}
    </div>
  );
};

export default IndividualSearch;
