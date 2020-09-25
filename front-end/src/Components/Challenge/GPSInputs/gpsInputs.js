import React from "react";
import classes from "./gpsInputs.module.css";
import TextField from "@material-ui/core/TextField";
import { Divider } from "@material-ui/core";

const GPSInputs = (props) => {
  return (
    <React.Fragment>
      <Divider style={{ padding: "1px" }} />
      <div className={classes.InputsContainer}>
        <TextField
          id="outlined-number"
          label="Distance (miles)"
          name="distance"
          type="number"
          onChange={props.change}
          InputLabelProps={{
            shrink: true,
          }}
          value={props.distance}
          variant="outlined"
        />
        <TextField
          id="outlined-number"
          label="Elevation (ft)"
          name="elevation"
          type="number"
          value={props.elevation}
          onChange={props.change}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <div className={classes.Rule}>
          <p>
            <b>Input a value for one or both gps validation</b>
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GPSInputs;
