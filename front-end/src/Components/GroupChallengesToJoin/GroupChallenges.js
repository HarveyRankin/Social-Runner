import React from "react";
import classes from "./GroupChallenges.module.css";
import GroupChallenge from "./GroupChallenge";
//bingo card 
const GroupChallenges = (props) => {
  const { cards } = props;
  console.log(props);
  return (
    <div className={classes.Container}>
      {cards.map((card) => (
        <GroupChallenge clicked={props.clicked} card={card} />
      ))}
    </div>
  );
};

export default GroupChallenges;
