import React, { useState, useEffect } from "react";
import classes from "./challenge.module.css";
import TextField from "@material-ui/core/TextField";
import Toggle from "../../Ui/Toggle/toggle";
import GPSInputs from "./GPSInputs/gpsInputs";
import DateInputs from "./DateInputs/dateInputs";
import { Divider } from "@material-ui/core";
import ScoreInput from "./ScoreInput/scoreInput";

//challenge creation input component (children comp includes gps,descrip)

const Challenge = (props) => {
  const [gpsState, setGpsState] = useState(false);
  const [descripState, setDescripState] = useState(false);
  const [photoState, setPhotoState] = useState(false);
  const challenge = props.challenge;
  
  useEffect(() => {
    props.toggle("gps", gpsState);
  }, [gpsState, setGpsState]);
  useEffect(() => {
    props.toggle("userDescription", descripState);
  }, [descripState, setDescripState]);
  useEffect(() => {
    props.toggle("photo", photoState);
  }, [photoState, setPhotoState]);
  useEffect(() => {
    setDescripState(false);
    setGpsState(false);
    setPhotoState(false);
  }, [props.refreshToggles]);
  useEffect(() => {
    
    setDescripState(props.challenge.userDescription);
    setGpsState(props.challenge.gps);
    setPhotoState(props.challenge.photo);
  }, [props.togglesUpdate]);

  return (
    <div className={classes.Challenge}>
      <form className={classes.Form}>
        <TextField
          style={{ width: "100%" }}
          id="outlined-basic"
          onChange={props.change}
          name="title"
          label="Challenge Title"
          variant="outlined"
          required
          value={challenge.title}
        />
        <TextField
          style={{ width: "100%", marginTop: 30 }}
          id="outlined-multiline-static"
          label="Challenge Description"
          multiline
          rows={5}
          name="description"
          variant="outlined"
          required
          onChange={props.change}
          value={challenge.description}
        />
        <Divider style={{ marginTop: "3%", padding: "1px" }} />
        <h2
          style={{
            textAlign: "center",
            fontSize: "50px",
            color: "rgb(114, 134, 248)",
          }}
        >
          Verification Methods
        </h2>
        <p style={{ fontSize: "30px" }}>
          Set formal verfiication:<b>this is optional</b>
        </p>
        <div className={classes.VerficationCon}>
          <span className={classes.GPS}>
            <Toggle
              className={classes.GPS}
              id="gpsToggle"
              checked={gpsState}
              toggle={() => setGpsState(!gpsState)}
            />
          </span>
          <span className={classes.Photo}>
            <Toggle
              toggle={() => setPhotoState(!photoState)}
              checked={photoState}
            />
          </span>

          <span className={classes.Description}>
            <Toggle
              toggle={() => setDescripState(!descripState)}
              checked={descripState}
            />
          </span>
        </div>
        {photoState ? <p>Athlete must upload an image</p> : null}
        {descripState ? <p>Athlete must upload a description</p> : null}
        {gpsState ? (
          <GPSInputs
            change={props.change}
            distance={props.challenge.distance}
            elevation={props.challenge.elevation}
          />
        ) : null}
        {props.dateInputs ? <DateInputs change={props.change} /> : null}

        <ScoreInput change={props.change} value={props.challenge.score} />
      </form>
    </div>
  );
};
export default Challenge;

//buttons will be changed to toggles
