import React from "react";
import classes from "./scoreInput.module.css";
import { Divider } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

const ScoreInput = (props) => {
  return (
    <React.Fragment>
      <Divider style={{ marginTop: "3%", padding: "1px" }} />
      <div className={classes.ScoreCon}>
        <TextField
          id="outlined-number"
          label="Score"
          name="score"
          type="number"
          onChange={props.change}
          InputLabelProps={{
            shrink: true,
          }}
          value={props.value}
          variant="outlined"
        />
      </div>
    </React.Fragment>
  );
};

export default ScoreInput;
