import React from "react";
import classes from "./GroupChallenge.module.css";

const GroupChallenge = (props) => {
  const { card } = props;
  return (
    <div onClick={() => props.clicked(card.id)} className={classes.Container}>
      <div className={classes.CardCon}>
        <p>{card.title}</p>
        <p>{card.description}</p>
      </div>
    </div>
  );
};

export default GroupChallenge;
