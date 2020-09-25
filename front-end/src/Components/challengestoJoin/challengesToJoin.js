import React from "react";
import classes from "./challengesToJoin.module.css";
import ChallengeToJoin from "./challengeToJoin/challengeToJoin";

const ChallengesToJoin = (props) => {
  return (
    <div className={classes.ChallengesCon}>
      {props.challenges.map((el) => {
        return (
          <ChallengeToJoin
            title={el.title}
            distance={el.distance}
            elevation={el.elevation}
            creator={el.creator}
            start_date={el.start_date}
            end_date={el.end_date}
            click={props.click}
            id={el.challenge_id}
            score={el.score}
            gps={el.gps}
            image={el.photo}
            description={el.user_description}
          />
        );
      })}
    </div>
  );
};

export default ChallengesToJoin;
