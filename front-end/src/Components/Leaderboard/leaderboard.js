import React from "react";
import classes from "./leaderboard.module.css";
import Individual from "./individaul";
import Individaul from "./individaul";

const Leaderboard = ({ challenges }) => {
  return (
    <React.Fragment>
      <div className={classes.Title}>
        <p
          style={{
            margin: "auto",
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            fontSize: "30px",
          }}
        >
          Leaderboard
        </p>

        <div className={classes.Leaderboard}>
          <div className={classes.Options}>
            <p style={{ fontSize: "25px", color: "white" }}>Rank</p>
            <p style={{ fontSize: "25px", color: "white" }}>User</p>
            <p
              style={{
                fontSize: "25px",
                color: "white",
              }}
            >
              Score
            </p>
          </div>
          {challenges.map((challenge, index) => {
            return (
              <Individaul
                score={challenge.score}
                user={challenge.username}
                rank={index + 1}
              />
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Leaderboard;
