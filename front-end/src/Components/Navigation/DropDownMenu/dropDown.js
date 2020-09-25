import React from "react";
import classes from "./dropDown.module.css";

const DropDown = (props) => {
  return <div className={classes.Dropdown}>{props.children}</div>;
};

export default DropDown;
