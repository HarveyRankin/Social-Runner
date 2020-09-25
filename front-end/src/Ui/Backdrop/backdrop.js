import React from "react";
import classes from "./backdrop.module.css";
//Backdrop component for the whole application
const Backdrop = (props) => {
  return props.show ? (
    <div className={classes.Backdrop} onClick={props.clicked}></div>
  ) : null;
};
export default Backdrop;
