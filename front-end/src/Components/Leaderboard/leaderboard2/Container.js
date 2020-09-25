import React from "react";
import classes from "./Container.module.css";

const LeaderBoardCon = (props) => {
  let users = props.users;

  const renderData = () => {
    return users.map((person, index) => {
      let style = "Odd";
      if (index % 2 == 0) style = "Even";
      return (
        <tr className={classes[style]} key={index}>
          <td>{person.rank}</td>
          <td>{person.username}</td>
          <td style={{ fontWeight: "bold" }}>{person.overallScore}</td>
        </tr>
      );
    });
  };
  const renderHeader = () => {
    let header;
    if (!users[0]) {
      header = ["Rank", "User", "Score"];
    } else {
      header = ["Rank", "User", "Score"];
    }

    const arr = header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });

    return arr;
  };

  return (
    <div className={classes.Table}>
      <table className={classes.Table}>
        <tbody>
          <tr
            stlye={{
              backgroundColor: "#242426",
              borderBottomLeftRadius: "50px",
              borderBottomRightRadius: "50px",
            }}
            className={classes.Header}
          >
            {renderHeader()}
          </tr>
          {props.users.length > 0 ? (
            renderData()
          ) : (
            <div
              style={{
                width: "100%",
                height: "auto",
                padding: "4%",

                fontSize: "25px",
                fontFamily: "Crushed-regular",
              }}
            >
              <p>NO DATA</p>
            </div>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoardCon;
