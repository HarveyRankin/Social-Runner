import React from "react";
import Button from "@material-ui/core/Button";

const SingleChallengePreview = (props) => {
  const {
    description,
    distance,
    elevation,
    endDate,
    gps,
    photo,
    score,
    startDate,
    title,
    userDescription,
  } = props.challenge;
  let verifiedMethods = true;
  if (!gps && !photo && !userDescription) {
    verifiedMethods = false;
  }
  const Verification = (
    <div>
      {photo ? <p>User must upload an image</p> : null}
      {userDescription ? <p>User must upload a challenge description</p> : null}
      {gps ? <p>User must upload their gps</p> : null}
      {distance ? <p>User must run {distance} miles or greater</p> : null}
      {elevation ? <p>User must run {elevation} ft or greater</p> : null}
    </div>
  );
  return (
    <div>
      <h1>{title}</h1>
      <h2>Description</h2>
      <p>{description}</p>
      <h2>Verification</h2>
      {verifiedMethods ? Verification : <p>No verification specified</p>}
      <h2>Start Date</h2>
      <p>{startDate}</p>
      <h2>End Date</h2>
      <p>{endDate}</p>
      <h2>Score</h2>
      <p>{score}</p>
      <Button
        style={{ textAlign: "center", margin: "auto" }}
        variant="contained"
        color="secondary"
        onClick={props.submit}
      >
        Secondary
      </Button>
    </div>
  );
};

export default SingleChallengePreview;
