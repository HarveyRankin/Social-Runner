import React, { Component } from "react";
import classes from "./singleChallenge.module.css";
import { Button } from "@material-ui/core";
//
class SingleChallenge extends Component {
  state = {
    challengeSelected: false,
    distance: false,
    time: false,
    elevation: false,
  };
  toggleChallengeType = () => {
    this.setState({ customChallenge: !this.state.customChallenge });
  };
  toggleCustom = () => {
    this.setState({ challengeSelected: true, customChallenge: true });
  };
  toggleStandard = () => {
    this.setState({ challengeSelected: true, customChallenge: false });
  };
  render() {
    let left = (
      <Button variant="contained" color="secondary" onClick={this.toggleCustom}>
        Custom Challenge
      </Button>
    );
    let right = (
      <Button variant="contained" color="primary" onClick={this.toggleStandard}>
        Standard Challenge
      </Button>
    );
    if (this.state.challengeSelected && this.state.customChallenge) {
      left = <h1>custom output</h1>;
      right = (
        <div>
          Custom input
          <button onClick={this.toggleChallengeType}>toggle to standard</button>
        </div>
      );
    }
    if (this.state.challengeSelected && !this.state.customChallenge) {
      left = <h1>standard output</h1>;
      right = (
        <div>
          Standard input
          <button onClick={this.toggleChallengeType}>toggle to custom</button>
        </div>
      );
    }
    return (
      <div className={classes.Card}>
        <div>{left}</div>
        <div>{right}</div>
      </div>
    );
  }
}

export default SingleChallenge;
