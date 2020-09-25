import React, { Component } from "react";
import classes from "./gridChallenges.module.css";
import Challenge from "../Challenge/challenge";
import Button from "@material-ui/core/Button";
import SingleChallenge from "./singleChall";

class Challenges extends Component {
  state = {};

  render() {
    const challenges = this.props.challenges;
    console.log(challenges);
    return (
      <React.Fragment>
        <div className={classes.BasicGrid}>
          {challenges.map((el, index) => {
            return (
              <SingleChallenge
                title={el.title}
                gps={el.gps}
                photo={el.photo}
                userDescription={el.userDescription}
                challNum={index + 1}
                getIndex={(num) => this.props.getIndex(num)}
                description={el.description}
                editChanges={this.props.editChanges}
                editToggle={this.props.editToggle}
                distance={el.distance}
                elevation={el.elevation}
                score={el.score}
              />
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default Challenges;
