import React from "react";
import classes from "./challengeDisplay.module.css";
import { Button } from "@material-ui/core";

const ChallengeDisplay = (props) => {
  return (
    <div className={classes.DisplayCon}>
      <h2>{props.challenge.title}</h2>
      <p>{props.challenge.description}</p>
      <Button onClick={props.click} color="secondary">
        Join Challenge
      </Button>
    </div>
  );
};

export default ChallengeDisplay;
