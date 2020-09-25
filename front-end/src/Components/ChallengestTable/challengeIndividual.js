import React from "react";
import classes from "./challengeIndividual.module.css";
import Tick from "../../Ui/Icons/tick";
import Cross from "../../Ui/Icons/cross";
import Error from "../../Ui/Icons/error";

const ChallengeIndividual = (props) => {
  const { title, description } = props;
  let helper = (
    <Error style={{ color: "red", width: "50px", height: "auto" }} />
  );
  if (title && title !== "Challenge Title" && description) {
    helper = <Tick style={{ color: "green", width: "50px", height: "auto" }} />;
  }
  return (
    <div className={classes.Container} onClick={props.click}>
      <p style={{ fontFamily: "Crushed-regular" }}>{title}</p>
      {helper}
    </div>
  );
};

export default ChallengeIndividual;
