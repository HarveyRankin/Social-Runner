import React from "react";
import classes from "./SingleContainer.module.css";
import challengePage from "../../../ChallengePage/challengePage";
import Tick from "../../../../../Ui/Icons/tick";
import Cross from "../../../../../Ui/Icons/cross";

const SingleContainer = ({ challenges, click }) => {
  console.log(challenges);
  const renderData = () => {
    return challenges.map((challenge, index) => {
      let style = "Odd";
      if (index % 2 == 0) style = "Even";
      let joined;
      challenge.joined
        ? (joined = (
            <Tick
              style={{
                width: "30%",
                height: "auto",
                color: "green",
                marginTop: "5%",
              }}
            />
          ))
        : (joined = (
            <Cross
              style={{
                width: "30%",
                height: "auto",
                color: "red",
                marginTop: "5%",
              }}
            />
          ));
      let endDate = challenge.end_date.split("T")[0];
      if (challenge.expired) endDate = <p style={{ color: "red" }}>Expired</p>;
      return (
        <tr
          className={classes[style]}
          key={index}
          onClick={() => click(challenge.individual_id, challenge.challenge_id)}
        >
          <td>{challenge.title}</td>
          <td>{challenge.creator}</td>
          <td>{challenge.club || <p>No Club</p>}</td>
          <td>{joined}</td>
          <td style={{ color: "red" }}>{endDate}</td>
        </tr>
      );
    });
  };

  const renderHeader = () => {
    let header = ["title", "creator", "club", "Joined", "expiry"];
    const arr = header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
    return arr;
  };
  return (
    <div className={classes.TableWrapper}>
      {challenges.length > 0 ? (
        <div className={classes.Table}>
          <table className={classes.Table}>
            <tbody>
              <tr
                stlye={{
                  position: "fixed",
                  backgroundColor: "#242426",
                  borderBottomLeftRadius: "50px",
                  borderBottomRightRadius: "50px",
                }}
                className={classes.Header}
              >
                {renderHeader()}
              </tr>
              {challenges.length > 0 ? renderData() : <p>No data</p>}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <p>No Single Challenges</p>
        </div>
      )}
    </div>
  );
};

export default SingleContainer;
