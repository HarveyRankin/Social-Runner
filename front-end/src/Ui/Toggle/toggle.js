import React from "react";
import Switch from "@material-ui/core/Switch";
import classes from "./toggle.module.css";
//toggle component
const Toggle = (props) => {
  return (
    <div className={classes.Toggle}>
      <Switch
        id={props.id}
        checked={props.checked}
        onChange={props.toggle}
        name={props.name}
        inputProps={{ "aria-label": "secondary checkbox" }}
      />
    </div>
  );
};

export default Toggle;
