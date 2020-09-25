import React, { Component } from "react";
import classes from "./CardPage.module.css";
import { withRouter } from "react-router-dom";
import axios from "axios";
import CardView from "../../../Components/CardView/CardView";
import Backdrop from "../../../Ui/Backdrop/backdrop";
import Modal from "../../../Hoc/Modal/modal";
import ChallengeOverview from "../../../Components/challengestoJoin/challengeDisplay/challengeOverview";
import ChallengeInput from "../../../Components/Challenge/ChallengeCompletionInput/challengeCompletionInput";
import rowsAndCols from "../../../helperFunctions/RowsAndCols/rowsAndCols";
import Button from "@material-ui/core/Button";
import LeaderboardTable from "../../../Components/Leaderboard/leaderboard2/Container";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Divider } from "@material-ui/core";

class CardPage extends Component {
  state = {
    isExpired: null,
    groupChallenges: [],
    rows: null,
    cols: null,
    cardTitle: null,
    cardDescription: null,
    startDate: null,
    endDate: null,
    cardId: null,
    showBackdrop: null,
    currentChallenge: null,
    showInput: false,
    rowsComplete: null,
    colsComplete: null,
    userScores: null,
    user: [],
    filterScores: [],
    sort: "score",
    cardComplete: null,
    challengesLoading: null,
    cardStarted: null,
  };
  toChallengePage = () => {
    //takes the user to the challenge page
    const id = this.state.groupChallenges[0][0].id; //gets the card id for the path name
    const challenge_id = this.state.currentChallenge.challenge_id; //gets the challenge id with the index
    this.props.history.push(`/challenge/${id}/${challenge_id}`);
  };
  handleViewClick = (x, y) => {
    const challenge = this.state.groupChallenges[x][y];
    const data = {
      challenge_id: challenge.challenge_id,
      description: challenge.challenge_description,
      distance: challenge.distance,
      elevation: challenge.elevation,
      endDate: challenge.end_date,
      gps: challenge.gps,
      photo: challenge.photo,
      score: 1,
      startDate: challenge.start_date,
      title: challenge.challenge_title,
      userDescription: challenge.user_description,
      complete: challenge.complete,
      creator: "test",
      rowNum: challenge.rowNum,
      colNum: challenge.colNum,
    };
    this.setState({ currentChallenge: data, showBackdrop: true });
  };
  toggleBackdrop = () => {
    this.setState({ showBackdrop: !this.state.showBackdrop, showInput: false });
  };
  toggleInput = () => {
    this.setState({ showInput: !this.state.showInput });
  };
  checkChallengeComplete = (arr2d) => {
    //flaten the array,
    const array = arr2d;
    const card_id = this.state.cardId;
    axios
      .get(`/athletes/checkCompleteChallenges/${card_id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const comparisonArray = res.data;
        if (!res.data.length) {
          //change later
          const elPerRow = arr2d[0].colsNum;
          //creating 2d array from the data
          const newArr = array.reduce(
            (rows, key, index) =>
              (index % elPerRow == 0
                ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows,
            []
          );
          //setting the state of challenges with the complete property
          this.setState({ groupChallenges: newArr, challengesLoading: false });
        } else {
          for (let chall of array) {
            chall.complete = false;
            for (let challObj of comparisonArray) {
              if (challObj.challenge_id === chall.challenge_id)
                chall.complete = true;
            }
          }
          const elPerRow = arr2d[0].colsNum;
          //creating 2d array from the data
          const newArr = array.reduce(
            (rows, key, index) =>
              (index % elPerRow == 0
                ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows,
            []
          );
          this.setState({ groupChallenges: newArr });
        }
      })
      .catch((err) => console.log(err));
  };
  handleSubmission = (array) => {
    //console.log(array);
    if (Array.isArray(array)) {
      alert("challenge submitted");
      let newChallenges = [...this.state.groupChallenges];
      console.log(newChallenges);
      const row = this.state.currentChallenge.rowNum;
      const col = this.state.currentChallenge.colNum;

      newChallenges[row][col].complete = true;
      //check to see if row or column is complete
      this.setState({
        groupChallenges: newChallenges,
        showInput: false,
        showBackdrop: false,
      });
    
      this.rowsAndColCheck(row, col);
    } else {
      alert("failed");
    }
  };

  rowsAndColCheck = (row, col) => {
  
    const CardColLength = +this.state.rows;
    const CardRowLength = +this.state.cols;
    let rowComplete = true;
    for (let i = 0; i < CardRowLength; i++) {
      if (!this.state.groupChallenges[row][i].complete) {
        rowComplete = false;
        break;
      }
    }
    let colComplete = true;

    for (let i = 0; i < CardColLength; i++) {
      if (!this.state.groupChallenges[i][col].complete) {
        console.log(this.state.groupChallenges[i][col]);
        colComplete = false;
        break;
      }
    }

    if (rowComplete === true) {
      axios
        .post(
          "/challenges/group/addRow",
          {
            card_id: this.state.cardId,
            row_num: row,
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          this.setState({ rowsComplete: res.data.rows });
        })
        .catch((err) => console.log(err));
    }
    if (colComplete) {
      axios
        .post(
          "/challenges/group/addCol",
          {
            card_id: this.state.cardId,
            col_num: col,
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => this.setState({ colsComplete: res.data.cols }))
        .catch((err) => console.log(err));
    }
  };

  handleUserFilter = (e) => {
    let value = e.target.value;
    const dataToFilter = this.state.filterScores;
    const reg = new RegExp(value.split("").join(".*"), "i");
    if ((value = "")) return this.setState({ userScores: dataToFilter });
    const filtered = dataToFilter.filter((item) => {
      if (item.username.match(reg)) return item; //checking against regular expression
    });
    this.setState({ userScores: filtered });
  };
  handleSorting = (e) => {
    const value = e.target.value;
    const card_id = this.state.cardId;
    if (value === "score") {
      axios
        .get(`/challenges/group/overallScore/${card_id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const username = res.data.username;
          const scores = res.data.data;
          const clientScores = scores.filter(
            (item) => item.username === username
          );
          const sorted = scores
            .sort((a, b) => b.overallScore - a.overallScore)
            .map((el, index) => {
              el.rank = index + 1;
              return el;
            });
          console.log(sorted);

          this.setState({
            userScores: sorted,
            filterScores: sorted,
            user: clientScores,
            sort: value,
          });
        })
        .catch((err) => console.log(err));
    } else if (value === "rows") {
    
      axios
        .get(`/challenges/group/allRows/${card_id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const scores = res.data;
          const sorted = scores
            .sort((a, b) => b.overallScore - a.overallScore)
            .map((el, index) => {
              el.rank = index + 1;
              return el;
            });
          this.setState({
            userScores: sorted,
            filterScores: sorted,
            sort: value,
          });
        })
        .catch((err) => console.log(err));

      this.setState({ userScores: [], filterScores: [], sort: value });
    } else {
     
      axios
        .get(`/challenges/group/allCols/${card_id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const scores = res.data;
          const sorted = scores
            .sort((a, b) => b.overallScore - a.overallScore)
            .map((el, index) => {
              el.rank = index + 1;
              return el;
            });
          this.setState({
            userScores: sorted,
            filterScores: sorted,
            sort: value,
          });
        })
        .catch((err) => console.log(err));
    }
  };
  render() {

    return (
      <div className={classes.Body}>
        <Backdrop
          show={this.state.showBackdrop}
          clicked={this.toggleBackdrop}
        />
        <Modal show={this.state.showBackdrop}>
          {this.state.currentChallenge ? (
            <div>
              {this.state.showInput ? (
                <ChallengeInput
                  succesful={this.handleSubmission}
                  challenge={this.state.currentChallenge}
                />
              ) : (
                <ChallengeOverview challenge={this.state.currentChallenge} />
              )}
            </div>
          ) : null}
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            {this.state.showInput ? (
              <Button
                style={{ marginTop: "2%" }}
                onClick={this.toggleInput}
                variant="outlined"
                color="secondary"
                className={classes.button}
              >
                Back
              </Button>
            ) : (
              <div>
                {this.state.cardStarted ? (
                  <Button
                    style={{ marginTop: "2%" }}
                    onClick={this.toChallengePage}
                    variant="outlined"
                    color="secondary"
                    className={classes.button}
                  >
                    Challenge Page
                  </Button>
                ) : (
                  <Button
                    style={{ marginTop: "2%" }}
                    onClick={this.toChallengePage}
                    variant="outlined"
                    color="secondary"
                    className={classes.button}
                    disabled={!this.state.cardStarted}
                  >
                    Card Not Started
                  </Button>
                )}
              </div>
            )}
          </div>
        </Modal>
        <div style={{ marginTop: "10%", position: "relative" }}>
          {this.state.cardComplete === "complete" ? (
            <div
              className={classes.CompleteContainer}
              style={{ position: "absolute" }}
            >
              <p
                className={classes.Complete}
                style={{ fontSize: "100px", fontWeight: "bold" }}
              >
                Complete
              </p>
            </div>
          ) : null}
          {this.state.isExpired ? (
            <div className={classes.Expired}>
              <p className={classes.ExpiredText}>THIS CARD HAS NOW EXPIRED</p>
              <p className={classes.ExpiredSmallText}>See Who won!</p>
            </div>
          ) : null}
          {!this.state.cardStarted ? (
            <div className={classes.Expired}>
              {this.state.groupChallenges.length > 0 ? (
                <div>
                  <p className={classes.ExpiredText}>
                    THIS CARD HAS NOT STARTED
                  </p>
                  <p className={classes.ExpiredSmallText}>
                    STARTS ON{" "}
                    {this.state.groupChallenges[0][0].start_date.split("T")[0]}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <CardView
            description={this.state.cardDescription}
            challengesLoading={this.state.challengesLoading}
            click={this.handleViewClick}
            challenges={this.state.groupChallenges}
            bingoTitle={this.state.cardTitle}
            bingoDate={this.state.startDate}
          />
        </div>
        <div className={classes.InfoPanel}>
          <div
            style={{
              display: "flex",
              backgroundColor: "rgb(241, 247, 248)",
              borderBottomLeftRadius: "50px",
              borderBottomRightRadius: "50px",
            }}
          >
            <div className={classes.Stats}>
              <div
                style={{
                  width: "100%",
                  marginBottom: "5%",
                  height: "50px",
                }}
              >
                <p
                  style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Card Score
                </p>
                {this.state.user[0] ? (
                  <p style={{ fontSize: "20px", color: "white" }}>
                    {this.state.user[0].overallScore}
                  </p>
                ) : (
                  <p style={{ fontSize: "20px", color: "white" }}>0</p>
                )}
              </div>
              <Divider />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginTop: "20%",
                }}
              >
                <div
                  style={{
                    marginTop: "20%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      marginTop: "5%",
                      color: "white",
                    }}
                  >
                    Rows
                  </p>
                  {this.state.rowsComplete ? (
                    <p style={{ fontSize: "20px", color: "white" }}>
                      {this.state.rowsComplete}
                    </p>
                  ) : (
                    <p style={{ fontSize: "20px", color: "white" }}>0</p>
                  )}
                </div>
                <div
                  style={{
                    marginTop: "10%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Columns
                  </p>
                  {this.state.colsComplete ? (
                    <p style={{ fontSize: "20px", color: "white" }}>
                      {this.state.colsComplete}
                    </p>
                  ) : (
                    <p style={{ fontSize: "20px", color: "white" }}>0</p>
                  )}
                </div>
              </div>
            </div>
            <Divider orientation="vertical" flexItem />
            <div style={{ marginBottom: "1%", padding: "2%" }}>
              <div></div>
              <div className={classes.TopOfLeaderboard}>
                <TextField
                  variant="outlined"
                  onChange={this.handleUserFilter}
                  style={{ width: "100%", margin: "1%" }}
                  id="standard-search"
                  label="Search User"
                  type="Search User"
                />
                <FormControl
                  variant="outlined"
                  style={{ width: "100%", marginLeft: "auto", margin: "1%" }}
                  className={classes.formControl}
                >
                  <Select
                    style={{ width: "100%" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    fullWidth
                    onChange={this.handleSorting}
                    value={this.state.sort}
                  >
                    <MenuItem value="score">Card Score</MenuItem>
                    <MenuItem value="rows">Rows Collected</MenuItem>
                    <MenuItem value="cols">Columns Collected</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {this.state.userScores ? (
                <div className={classes.LeaderBoardWrapper}>
                  <LeaderboardTable users={this.state.userScores} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.setState({ challengesLoading: true });
    const card_id = this.props.match.params.id; //gets the card id from the url
    axios
      .get(`/challenges/group/${card_id}`, {
        //gets the card details
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        //configuring the dates to a standard date and time - comparison was not as simple as expected 
        const startDate = res.data[0].start_date.split("T")[0];
        const endDate = res.data[0].end_date.split("T")[0];
        const today = new Date();
        const start_date = res.data[0].start_date.split("-");
        const year = start_date[0];
        const month = start_date[1];
        const day = start_date[2].split("T")[0];
        const newStart = new Date(year, month, day);
        let startConfigured = `${newStart.getFullYear()}-${newStart.getMonth()}-${newStart.getDate()}`;
        let todayConfigured = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        startConfigured = new Date(startConfigured);
        todayConfigured = new Date(todayConfigured);
        let started = true;
        //checing the start date
        if (todayConfigured < startConfigured) started = false;
        if (todayConfigured === startConfigured) started = true;
        this.setState({
          rows: +res.data[0].rowsNum,
          cols: +res.data[0].colsNum,
          cardTitle: res.data[0].card_title,
          cardDescription: res.data[0].card_description,
          startDate: startDate,
          endDate: endDate,
          cardId: res.data[0].id,
          cardStarted: started,
        });
        return res;
      })
      .then((res) => {
        //getting how many rows and cols are complete of the card
        axios
          .get(`/challenges/group/rowsAndCols/${res.data[0].id}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            this.setState({
              rowsComplete: res.data.rows,
              colsComplete: res.data.cols,
            });
          })
          .catch((err) => console.log(err));
        this.checkChallengeComplete(res.data);
      })
      .catch((err) => console.log(err));
    axios
      .get(`/challenges/group/overallScore/${card_id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const username = res.data.username;
        const scores = res.data.data;
        const clientScores = scores.filter(
          (item) => item.username === username
        );
        const sorted = scores
          .sort((a, b) => b.overallScore - a.overallScore)
          .map((el, index) => {
            el.rank = index + 1;
            return el;
          });

        this.setState({
          userScores: sorted,
          filterScores: sorted,
          user: clientScores,
        });
      })
      .catch((err) => console.log(err));
    axios
      .get(`/challenges/group/completeCheck/${card_id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const completeStatus = res.data.data;
        this.setState({
          cardComplete: completeStatus,
          isExpired: res.data.expired,
        });
      })
      .catch((err) => console.log(err));
  }
}

export default withRouter(CardPage);
