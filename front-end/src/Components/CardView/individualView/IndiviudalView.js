import React from "react";
import classes from "./individualView.module.css";
import { Divider } from "@material-ui/core";
//bingo card
const IndividualView = (props) => {
  return (
    <div onClick={props.click} className={classes.Container}>
      <p>{props.title || "title"}</p>
      <br />
      <Divider />
      <p style={{ fontSize: "15px" }}>{props.description || "descrip"}</p>
      <Divider />
      {props.complete ? (
        <p style={{ fontSize: "20px", color: "green" }}>Complete</p>
      ) : null}
    </div>
  );
};

export default IndividualView;
