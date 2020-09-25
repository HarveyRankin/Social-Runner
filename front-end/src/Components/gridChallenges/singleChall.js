import React, { useState } from "react";
import classes from "./singleChall.module.css";
import { Divider } from "@material-ui/core";
import Arrow from "../../Ui/Icons/arrowRight";
import TextField from "@material-ui/core/TextField";
import Toggle from "../../Ui/Toggle/toggle";
import Metrics from "../Challenge/GPSInputs/gpsInputs";
import Score from "../Challenge/ScoreInput/scoreInput";

const SingleChallenge = (props) => {
  const [showEdit, setEdit] = useState(false);
  const gps = "gps";
  const toggleEdit = () => {
    setEdit(!showEdit);
  };

  return (
    <div className={classes.Container}>
      <React.Fragment>
        <Divider />

        <div className={classes.ChallCon}>
          <p>
            <b>Challenge {props.challNum}</b>
          </p>
          <p>{props.title}</p>
          {props.title !== "Challenge Title" ? (
            <div className={classes.Edit} onClick={toggleEdit}>
              {showEdit ? (
                <p>Close</p>
              ) : (
                <div style={{ display: "flex" }}>
                  <p>Edit</p>
                  <Arrow style={{ marginTop: "3%" }} />
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              <p
                onClick={() => props.getIndex(props.challNum)}
                style={{ cursor: "pointer" }}
                className={classes.CreateChallenge}
              >
                Create a Challenge
              </p>
              <Arrow style={{ marginTop: "3%" }} />
            </div>
          )}
        </div>
        {showEdit ? (
          <div
            style={{
              border: "1px solid #242426",
              boxShadow: "0 2px 4px -1px rgba(0,0,5,5);",
            }}
          >
            <div className={classes.DataInput}>
              <TextField
                style={{ width: "100%", margin: "1%" }}
                id="outlined-basic"
                name="title"
                label="Challenge Title"
                variant="outlined"
                required
                value={props.title}
                onChange={(e) => props.editChanges(e, props.challNum)}
              />
              <TextField
                style={{ width: "100%", margin: "1%" }}
                id="outlined-basic"
                label="Challenge Description"
                rows={5}
                name="description"
                variant="outlined"
                value={props.description}
                onChange={(e) => props.editChanges(e, props.challNum)}
              />
            </div>
            <div className={classes.VerficationCon}>
              <span className={classes.GPS}>
                <Toggle
                  className={classes.GPS}
                  id="gps"
                  name={gps}
                  checked={props.gps}
                  toggle={(e) => props.editToggle(e, props.challNum)}
                />
              </span>
              <span className={classes.Photo}>
                <Toggle
                  name="photo"
                  toggle={(e) => props.editToggle(e, props.challNum)}
                  checked={props.photo}
                />
              </span>

              <span className={classes.Description}>
                <Toggle
                  toggle={(e) => props.editToggle(e, props.challNum)}
                  name="userDescription"
                  checked={props.userDescription}
                />
              </span>
            </div>
            {props.gps ? (
              <Metrics
                distance={props.distance}
                elevation={props.elevation}
                change={(e) => props.editChanges(e, props.challNum)}
              />
            ) : null}
            <Score
              style={{ marginBottom: "2%" }}
              value={props.score}
              change={(e) => props.editChanges(e, props.challNum)}
            />
          </div>
        ) : null}
      </React.Fragment>
    </div>
  );
};

export default SingleChallenge;
