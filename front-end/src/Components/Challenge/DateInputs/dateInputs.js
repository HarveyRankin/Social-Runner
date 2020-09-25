import React from "react";
import classes from "./dateInputs.module.css";
import { Divider } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

const DateInputs = (props) => {
  return (
    <React.Fragment>
      <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
      <div className={classes.InputsCon}>
        <TextField
          value={props.startDate}
          id="standard-number"
          label="Start Date"
          name="startDate"
          type="date"
          onChange={props.change}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          value={props.endDate}
          id="standard-number"
          name="endDate"
          label="End Date"
          type="date"
          onChange={props.change}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default DateInputs;
