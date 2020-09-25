import React from "react";
import classes from "./individual.module.css";
import { Divider } from "@material-ui/core";

const Individaul = ({ score, user, rank }) => {
  return (
    <React.Fragment>
      <Divider style={{ padding: "1px" }} />
      <div className={classes.Individaul}>
        <p style={{ marginLeft: "10%" }}>{rank}</p>
        <p style={{ marginLeft: "18%", cursor: "pointer" }}>{user}</p>
        <p style={{ marginLeft: "auto", marginRight: "10%" }}>{score}</p>
      </div>
    </React.Fragment>
  );
};

export default Individaul;
