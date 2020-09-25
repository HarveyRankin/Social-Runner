import React from "react";
import Challenge from "../Challenge/challenge";
import classes from "./challengesTable.module.css";
import ChallengeIndividual from "./challengeIndividual";
//bingo card creation component

const ChallengeTable = (props) => {
  return (
    <React.Fragment>
      <div
        className={classes.Card}
        style={{ paddingBottom: "1%", paddingLeft: "1%", paddingRight: "1%" }}
      >
        <div>
          <p
            className={classes.Text}
            style={{
              paddingTop: "5%",
              paddingLeft: "5%",
              paddingRight: "5%",
              paddingBottom: "1%",
              fontSize: "100px",
              fontWeight: "bold",
              color: "rgb(114, 134, 248)",
            }}
          >
            RUNNING BINGO
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginBottom: "2%",
            }}
          >
            <div style={{ maxWidth: "300px", overflow: "hidden" }}>
              <p
                style={{
                  fontSize: "50px",
                  fontWeight: "bold",
                  color: "rgb(114, 134, 248)",
                }}
              >
                {props.bingoTitle}
              </p>
            </div>
            <p
              style={{
                fontSize: "50px",
                fontWeight: "bold",
                color: "rgb(114, 134, 248)",
              }}
            >
              {props.bingoDate}
            </p>
          </div>
        </div>
        <div
          style={{
            overflow: "auto",
            height: "100%",
            width: "100%",
            margin: "auto",
            textAlign: "center",
          }}
        >
          <table className={classes.Table}>
            <tbody>
              {props.challenges.map((row, i) => (
                <tr key={i}>
                  {row.map((challenge, j) => (
                    <td key={j}>
                      {
                        <ChallengeIndividual
                          title={challenge.title}
                          description={challenge.description}
                          click={() => props.click(i, j)}
                        />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChallengeTable;

//need to add toggle buttonse etc
