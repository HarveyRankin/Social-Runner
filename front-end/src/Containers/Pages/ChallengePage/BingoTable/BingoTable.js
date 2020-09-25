import React from "react";
import classes from "./BingoTable.module.css";
import { withRouter } from "react-router-dom";
//this is the bingo grid 
const BingoTable = (props) => {
  const navigateToPage = (chall_id) => {
    const cardId = props.challenges[0][0].id;
    props.history.push(`/challenge/${cardId}/${chall_id}`);
  };
  return (
    <div>
      <table className={classes.Table}>
        <tbody>
          {props.challenges.map((row, i) => (
            <tr key={i}>
              {row.map((challenge, j) => {
                let style = "Normal";
                if (challenge.challenge_id === props.currentChall.challenge_id)
                  style = "Current";
               
                return (
                  <td
                    onClick={() => navigateToPage(challenge.challenge_id)}
                    className={classes[style]}
                    key={j}
                  >
                    <p style={{}}>{challenge.challenge_title}</p>
                    {challenge.complete ? (
                      <p
                        style={{
                          color: "green",
                          fontWeight: "bold",
                          fontSize: "20px",
                        }}
                      >
                        Complete
                      </p>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withRouter(BingoTable);
