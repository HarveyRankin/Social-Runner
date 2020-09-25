import React from "react";
import { withRouter } from "react-router-dom";
import classes from "./logo.module.css";

const Logo = (props) => {
  function toHomePage() {
    props.history.push("/homepage");
  }
  console.log(props);
  return (
    <div onClick={toHomePage} className={classes.Logo}>
      {props.icon}
    </div>
  );
};

export default withRouter(Logo);
