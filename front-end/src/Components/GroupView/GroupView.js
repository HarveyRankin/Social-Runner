import React from "react";
import classes from "./GroupView.module.css";
import GroupDetails from "./GroupDetails/GroupDetails";
import SingleView from "./SingleView";

const GroupView = (props) => {
  const challenges = props.challenges;
  const {
    card_description,
    card_title,
    creator,
    start_date,
    end_date,
  } = props.challenges[0];
  console.log(props);
  const startDate = start_date.split("T")[0];
  const endDate = end_date.split("T")[0];
  const data = { card_description, card_title, creator, startDate, endDate };
  let count = 0;
  return (
    <div>
      <div className={classes.TopCon}>
        <GroupDetails click={props.click} details={data} />
      </div>
      <div className={classes.Grid}>
        {props.challenges.map((challenge, index) => {
          count++;
          return (
            <SingleView
              challenge={challenge}
              index={index}
              key={count}
              clicked={props.clicked}
            />
          );
        })}
      </div>
      <div style={{ padding: "5%" }}>
        <div style={{ padding: "3%", border: "1px solid black" }}>
          <p style={{ fontSize: "15px" }}>{data.card_description}</p>
        </div>
      </div>
    </div>
  );
};

export default GroupView;
