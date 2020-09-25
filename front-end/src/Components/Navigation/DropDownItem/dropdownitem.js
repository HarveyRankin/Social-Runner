import React from "react";
import classes from "./dropdownitem.module.css";

const DropdownItem = (props) => {
  return (
    <a href="#" className={classes.MenuItem} onClick={props.click}>
      {props.children}
    </a>
  );
};

export default DropdownItem;
