import React from "react";
import classes from "./SingleView.module.css";
import { Divider } from "@material-ui/core";
import Arrow from "../../Ui/Icons/arrowRight";

const SingleView = (props) => {
  console.log(props);
  const {
    challenge_description,
    challenge_title,
    gps,
    photo,
    user_description,
  } = props.challenge;
  const index = props.index;

  return (
    <div onClick={() => props.clicked(index)} className={classes.Container}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <h3 style={{ textAlign: "center" }}>Challenge {index + 1}</h3>
          <Arrow style={{ marginTop: "12%" }} />
        </div>
        <div>
          <p style={{ marginTop: "14%" }}>Overview</p>
        </div>
      </div>

      <Divider />
      <p>{challenge_title}</p>
    </div>
  );
};

export default SingleView;
