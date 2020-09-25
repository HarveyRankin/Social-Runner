import React, { Component } from "react";
import classes from "./challengePage.module.css";
import axios from "axios";
import ChallengeOverview from "../../../Components/challengestoJoin/challengeDisplay/challengeOverview";
import ChallengeInput from "../../../Components/Challenge/ChallengeCompletionInput/challengeCompletionInput";
import ChallengeComplete from "../../../Components/CompleteChallenge/completeChalllege";
import Individual from "../../../Components/Leaderboard/individaul";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowRight from "../../../Ui/Icons/arrowRight";
import { withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
import Cross from "../../../Ui/Icons/cross";
import Backdrop from "../../../Ui/Backdrop/backdrop";
import Modal from "../../../Hoc/Modal/modal";
import CardView from "../../../Components/CardView/CardView";
import rowsAndCols from "../../../helperFunctions/RowsAndCols/rowsAndCols";
import groupCompletionCheckApi from "../../../helperFunctions/GroupCompletionCall/groupCompletionCheckApi";
import Table from "./BingoTable/BingoTable";
import LeaderboardTable from "../../../Components/Leaderboard/leaderboard2/Container";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Modal2 from "../../../Hoc/Modal2/Modal2";
//this is the challenge page of the application for both single and bingo
class ChallengePage extends Component {
  state = {
    expired: null,
    sort: "date_newest",
    type: null,
    challenge: null, //challenge details (for the overview)
    answered: false, //conditional to chekc if the client has answered the challenge
    userData: null, //userdata
    comments: null, //comments for the submitted challenge
    showBackdrop: false, //toggle for backdrop
    allChallenges: [], //array for all submitted challenges
    sortedData: [], //array of sorted data for the leaderbaord
    user: null,
    userScore: null, //userscore
    userRank: null, //userrank
    leaderboardLoading: true, //conditional for spinner
    loadingIndividaul: true, //conditional for spinner
    showInput: false, //conditional to showe input box
    reactedChallenges: {},
    showLeaderBoardPanel: false,
    showInput: false,
    showSubmisson: false, //object for submission id's
    groupChallenges: [],
    SingleStarted: true,
    cardStarted: true,
  };

  updateChallenges = async (challengesArr) => {
    //check if it returns an array
    //updates all the challenges when changes take place
    if (Array.isArray(challengesArr)) {
      const sort = challengesArr
        .sort((a, b) => (a.score < b.score ? 1 : -1))
        .map((el, i) => {
          el.overallScore = el.score;
          el.rank = i + 1;
          return el;
        });
      this.sortChallenges(this.state.sort, challengesArr);
      this.setState({
        sortedData: sort,
        showInput: false,
        showBackdrop: false,
      });

      if (this.state.type !== "single") {
        const cardId = this.state.groupChallenges[0][0].id;

        axios
          .get(`/challenges/group/${cardId}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            const challenges = res.data;
            axios
              .get(`/athletes/checkCompleteChallenges/${cardId}`, {
                headers: {
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((res) => {
                const comparisonArray = res.data;

                if (!res.data.length) {
                  //change later
                  const elPerRow = challenges[0].colsNum;
                  //creating 2d array from the data
                  const newArr = challenges.reduce(
                    (rows, key, index) =>
                      (index % elPerRow == 0
                        ? rows.push([key])
                        : rows[rows.length - 1].push(key)) && rows,
                    []
                  );
                  const data = newArr;
                  const test = data.flat();
                  const challenge = test.filter(
                    (item) =>
                      item.challenge_id === this.state.challenge.challenge_id
                  )[0];
                  const row = challenge.rowNum;
                  const col = challenge.colNum;
                  const cardRows = +challenge.rowsNum;
                  const cardCols = +challenge.colsNum;
                  const groupChallenges = data;
                  rowsAndCols(
                    row,
                    col,
                    cardRows,
                    cardCols,
                    groupChallenges,
                    cardId
                  );

                  this.setState({ groupChallenges: newArr });
                } else {
                  for (let chall of challenges) {
                    chall.complete = false;
                    for (let challObj of comparisonArray) {
                      if (challObj.challenge_id === chall.challenge_id)
                        chall.complete = true;
                    }
                  }
                  const elPerRow = challenges[0].colsNum;
                  //creating 2d array from the data
                  const newArr = challenges.reduce(
                    (rows, key, index) =>
                      (index % elPerRow == 0
                        ? rows.push([key])
                        : rows[rows.length - 1].push(key)) && rows,
                    []
                  );

                  const data = newArr;
                  const test = data.flat();
                  const challenge = test.filter(
                    (item) =>
                      item.challenge_id === this.state.challenge.challenge_id
                  )[0];
                  const row = challenge.rowNum;
                  const col = challenge.colNum;
                  const cardRows = +challenge.rowsNum;
                  const cardCols = +challenge.colsNum;
                  const groupChallenges = data;
                  rowsAndCols(
                    //this is a helper function
                    row,
                    col,
                    cardRows,
                    cardCols,
                    groupChallenges,
                    cardId
                  );
                  this.completeCardCheck(row, col);
                  this.setState({ groupChallenges: newArr });
                }
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      } else {
        //console.log(challengesArr);
      }
    }
  };
  closeModal = () => {
    this.setState({ showSubmisson: false });
  };
  completeCardCheck = (row, col) => {
    //if it is complete
    const challenges = this.state.groupChallenges;
    const card_id = challenges[row][col].id;
    let complete = true;
    for (let i = 0; i < challenges.length; i++) {
      for (let j = 0; j < challenges[i].length; j++) {
        if (
          !challenges[i][j].complete &&
          challenges[i][j] !== challenges[row][col]
        ) {
          complete = false;
          break;
        }
      }
    }
    if (complete) {
      axios
        .post(
          "/challenges/group/cardComplete",
          {
            card_id: card_id,
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
        });
    }

  };
  sortChallenges = (
    //sorts the uploads
    e = this.state.sort,
    challengesProvided = this.state.allChallenges
  ) => {
    let value = e;
    //console.log(challengesProvided);
    const challenges = challengesProvided.map((item) => {
      item.times = new Date(item.ts);
      return item;
    });
    if (e.target) value = e.target.value;
    if (value === "date_newest") challenges.sort((a, b) => b.times - a.times);
    if (value === "date_oldest") challenges.sort((a, b) => a.times - b.times);
    if (value === "score_highest") challenges.sort((a, b) => b.score - a.score);
    if (value === "score_lowest") challenges.sort((a, b) => a.score - b.score);

    this.setState({ allChallenges: challenges, sort: value });
  };
  toggleInput = () => {
    this.setState({ showInput: !this.state.showInput }); //opens input box
  };
  handleReturnClick = () => {
    this.props.history.push(`/card/${this.state.type}`); //takes the client back to the card page
  };
  updateReacted = (obj) => {
    //console.log(obj);
    this.setState({ reactedChallenges: obj });
  };
  handleViewClick = () => console.log("test");
  toggleBackdrop = () =>
    this.setState({
      showBackdrop: !this.state.showBackdrop,
      showLeaderBoardPanel: !this.state.showBackdrop,
      showSubmisson: false,
      showInput: false,
    });
  handleLeaderboardPanel = () =>
    this.setState({
      showLeaderBoardPanel: !this.state.showLeaderBoardPanel,
      showBackdrop: !this.state.showBackdrop,
    });
  handleUserSubmission = () =>
    this.setState({
      showSubmisson: true,
      //showBackdrop: !this.state.showBackdrop,
    });
  handleSubmission = () =>
    this.setState({ showInput: true, showBackdrop: true });

  handleDelete = (sub_id) => {
    const rowandCol = {};
    let cardId;
    //checking it is a group challenge
    if (this.state.groupChallenges.length > 0) {
      cardId = this.state.groupChallenges[0][0].id;
      this.state.groupChallenges.forEach((row) => {
        row.forEach((el) => {
          if (el.challenge_id === this.state.challenge.challenge_id) {
            rowandCol["col"] = el.colNum;
            rowandCol["row"] = el.rowNum;
          }
        });
      });
    }

    axios
      .post(
        `/challenges/submission/delete/${sub_id}/${this.state.type}`,
        {
          challenge: this.state.challenge.challenge_id,
          cardId: cardId,
          row: rowandCol.row,
          col: rowandCol.col,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) =>
        this.setState({
          allChallenges: res.data,
          answered: false,
          showSubmisson: false,
        })
      )
      .catch((err) => console.log(err));
  };
  render() {

    return (
      <React.Fragment>
        <div
          style={{ paddingBottom: "25%", position: "relative", width: "100%" }}
        >
          <div className={classes.Banner}>
            {this.state.type !== "single" ? (
              <div className={classes.TopCon}>
                <div className={classes.TableWrapper}>
                  {this.state.challenge ? (
                    <Table
                      challenges={this.state.groupChallenges}
                      currentChall={this.state.challenge}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
            {this.state.challenge ? (
              <div className={classes.Overhang}>
                <div
                  style={{
                    backgroundColor: "red",
                    position: "relative",
                    zIndex: 99,
                    boxShadow: "2px 6px 15px 4px rgba(0,0,0,0.77)",
                    marginTop: "5%",
                  }}
                >
                  {this.state.expired ? (
                    <div className={classes.ExpiredCon}>
                      <p className={classes.Expired}>Expired</p>
                    </div>
                  ) : null}
                  <div>
                    {!this.state.SingleStarted ? (
                      <p
                        style={{
                          fontSize: "30px",
                          fontFamily: "Crushed-regular",
                        }}
                      >
                        THIS CHALLENGE STARTS ON THE{" "}
                        {this.state.challenge.start_date.split("T")[[0]]}
                      </p>
                    ) : null}
                  </div>
                  <ChallengeOverview challenge={this.state.challenge} />
                </div>
                <div
                  style={{
                    width: "100%",
                    marginTop: "5%",
                    paddingBottom: "2%",
                    backgroundColor: "#303040",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      padding: "3%",
                      borderBottomRightRadius: "50px",
                      borderBottomLeftRadius: "50px",
                      backgroundColor: " #242426",
                      boxShadow: "1px 24px 36px -11px rgba(0,0,0,0.54)",
                    }}
                  >
                    <Button
                      onClick={this.handleLeaderboardPanel}
                      style={{ width: "150px" }}
                      color="primary"
                      variant="contained"
                    >
                      Leaderboard
                    </Button>
                    {this.state.answered ? (
                      <Button
                        onClick={this.handleUserSubmission}
                        style={{ width: "150px" }}
                        color="secondary"
                        variant="contained"
                      >
                        Your Attempt
                      </Button>
                    ) : (
                      <div>
                        {!this.state.expired ? (
                          <div>
                            {this.state.SingleStarted ? (
                              <Button
                                onClick={this.handleSubmission}
                                style={{ width: "150px" }}
                                color="secondary"
                                variant="contained"
                              >
                                Submit Attempt
                              </Button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    )}

                    {this.state.type !== "single" ? (
                      <Button
                        onClick={this.handleReturnClick}
                        color="primary"
                        variant="contained"
                      >
                        Return to Card
                      </Button>
                    ) : null}
                    <div
                      style={{
                        backgroundColor: "#f8f8ff",
                        paddingLeft: "3%",
                        paddingRight: "3%",
                        borderRadius: "10px",
                      }}
                    >
                      <FormControl
                        style={{ width: "200px" }}
                        className={classes.formControl}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Sort Posts
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          onChange={(e) => this.sortChallenges(e)}
                        >
                          <MenuItem value={"date_newest"}>
                            Date - Newest
                          </MenuItem>
                          <MenuItem value={"date_oldest"}>
                            Date - Oldest
                          </MenuItem>
                          <MenuItem value={"score_highest"}>
                            Score - Highest
                          </MenuItem>
                          <MenuItem value={"score_lowest"}>
                            Score - Lowest
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className={classes.AllSubmissions}>
                    {this.state.allChallenges.length > 0 ? (
                      <div className={classes.Thirdrow}>
                        {this.state.allChallenges.map((challenge) => {
                          let row = "single";
                          let col = "single";
                          let cardId = false;
                          let creator = false;
                          //console.log(challenge)
                          console.log(challenge);
                          if (this.state.groupChallenges) {
                            this.state.groupChallenges.forEach((rows) => {
                              rows.forEach((el) => {
                                if (
                                  el.challenge_id === challenge.challenge_id
                                ) {
                                  row = el.rowNum;
                                  col = el.colNum;
                                  cardId = el.id;
                                  creator = el.creator;
                                }
                              });
                            });
                          }
                          return (
                            <div style={{ marginTop: "2%" }}>
                              <ChallengeComplete
                                id={challenge.id}
                                image={challenge.image}
                                expired={this.state.expired}
                                row={row}
                                col={col}
                                card={cardId}
                                user={this.state.user}
                                challenge_id={this.state.challenge.challenge_id}
                                challengesReacted={this.state.reactedChallenges}
                                click={this.handleComment}
                                challenge={challenge}
                                succesful={this.updateChallenges}
                                updateReacted={this.updateReacted}
                                delete={this.handleDelete}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p
                        style={{
                          fontSize: "70px",
                          fontFamily: "Crushed-regular",
                          color: "rgb(114, 134, 248)",
                        }}
                      >
                        NO POSTS
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className={classes.Page}>
            <Backdrop
              show={this.state.showBackdrop}
              clicked={this.toggleBackdrop}
            />
            {this.state.showSubmisson && this.state.challenge ? (
              <Modal2
                closeModal={this.closeModal}
                open={this.state.showSubmisson}
              >
                <div style={{ width: "40%", height: "auto" }}>
                  <ChallengeComplete
                    expired={this.state.expired}
                    user={this.state.user}
                    challenge_id={this.state.challenge.challenge_id}
                    challengesReacted={this.state.reactedChallenges}
                    click={this.handleComment}
                    challenge={this.state.userData}
                    succesful={this.updateChallenges}
                    updateReacted={this.updateReacted}
                  />
                </div>
              </Modal2>
            ) : null}
            {this.state.showInput && this.state.challenge ? (
              <Modal show={this.state.showInput}>
                <ChallengeInput
                  challenge={this.state.challenge}
                  succesful={this.updateChallenges}
                />
              </Modal>
            ) : null}

            {this.state.showLeaderBoardPanel ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "fixed",
                  width: "25%",
                  padding: "5%",
                  backgroundColor: "rgba(28, 28, 62, 0.8)",
                  top: "0",
                  bottom: "0",
                  left: "-10px",
                  zIndex: "9999",
                  transition: "3000ms left cubic-bezier(0.77, 0, 0.175, 1)",
                  OverflowX: "hidden",
                  padding: "3%",
                  boxShadow: "10px 4px 15px 1px rgba(0,0,0,0.78)",
                  border: "1px solid black",
                  transition: "transform 0.9s ease-out",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Cross
                    onClick={this.handleLeaderboardPanel}
                    className={classes.Cross}
                    style={{
                      width: "10%",
                      height: "auto",
                      cursor: "pointer",
                      marginLeft: "auto",
                      color: "red",
                      marginBottom:'5%'
                    }}
                  />
                </div>

                <div className={classes.LeaderBoard}>
                  <LeaderboardTable users={this.state.sortedData} />
                </div>
               
              </div>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.allChallenges !== prevState.allChallenges) {
      axios
        .get(`/challenges/single/check/${this.props.match.params.id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.data.data !== "not answered") {
            this.setState({
              answered: true,
              userData: res.data,
              user: res.data.username,
              loadingIndividaul: false,
            });
          }
        });
    }
  }
  componentDidMount() {
    const challenge_id = this.props.match.params.id; //get the challenge id
    const type = this.props.match.params.type; //will either recieve "single" or the card_id
    this.setState({ type: type }); //set the type to the state (single or card)
    if (type === "single") {
      //if it is a single challenge
      axios
        .get(`/challenges/single/${challenge_id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          const today = new Date();
          const start_date = res.data.data.start_date.split("-");

          const year = start_date[0];
          const month = start_date[1];
          const day = start_date[2].split("T")[0];
          //this had to be done so the dates can be compared
          const newStart = new Date(year, month, day);
          //creating dates to compare
          
          let todayConfigured = `${today.getFullYear()}-${today.getMonth()+ 1}-${today.getDate()}`;
          let startconfigured = `${newStart.getFullYear()}-${newStart.getMonth()}-${newStart.getDate()}`;
          todayConfigured = new Date(todayConfigured)
          startconfigured = new Date(startconfigured)
          
          let started = true; //testing for start date
          if (todayConfigured < startconfigured) started = false;
          if (todayConfigured === startconfigured) started = true;
          this.setState({
            challenge: res.data.data,
            expired: res.data.expired,
            SingleStarted: started,
          });
        })
        .catch((err) => console.log(err));
      axios
        .get("/athletes/profile/personal/", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => this.setState({ user: res.data.username }))
        .catch((err) => console.log(err));
    } else {
      const card_id = type; //get card id
      axios
        .get(`/challenges/group/details/${card_id}/${challenge_id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res);
          console.log("IT IS HERE");
          this.setState({
            challenge: res.data.data[0],
            expired: res.data.expired,
          });
        })
        .catch((err) => console.log(err));
      console.log("trying");
      axios
        .get(`/challenges/group/${card_id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const challenges = res.data;

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
                const elPerRow = challenges[0].colsNum;
                //creating 2d array from the data
                const newArr = challenges.reduce(
                  (rows, key, index) =>
                    (index % elPerRow == 0
                      ? rows.push([key])
                      : rows[rows.length - 1].push(key)) && rows,
                  []
                );
                this.setState({ groupChallenges: newArr });
              } else {
                for (let chall of challenges) {
                  chall.complete = false;
                  for (let challObj of comparisonArray) {
                    if (challObj.challenge_id === chall.challenge_id)
                      chall.complete = true;
                  }
                }
                const elPerRow = challenges[0].colsNum;
                //creating 2d array from the data
                const newArr = challenges.reduce(
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
        })
        .catch((err) => console.log(err));
    }
    axios //check if the user has already completed the challenge
      .get(`/challenges/single/check/${challenge_id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.data !== "not answered") {
          this.setState({
            answered: true, //sets to true if it is answered
            userData: res.data, //returns the user data
            user: res.data.username, //returns the username
            loadingIndividaul: false, //cancels the loading spinner
          });
        }
      });
    axios
      .get(`/challenges/completedCheck/${challenge_id}`, {
        //checks to see if the challenge has been reacted to
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const newReactedToo = { ...this.state.reactedChallenges };
        res.data.forEach((element) => {
          newReactedToo[element.submission_id] = true; //sets an object with the submission id of all comlpeted challenges that the client has reacted to
        });
        
        this.setState({ reactedChallenges: newReactedToo }); //sets it to the state.
      })
      .catch((err) => console.log(err)); //catches the error
    axios
      .get(`/challenges/single/all/${challenge_id}`, {
        //gets all submission related to the challenge
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const data = res.data;
      
        data.forEach((el) => {
          let totalpaceInSeconds = el.pace * 60
          let paceResult = new Date(
            null,
            null,
            null,
            null,
            null,
            totalpaceInSeconds
          );
          let totalTimeInSeconds = el.runTime * 60;
          let result = new Date(
            null,
            null,
            null,
            null,
            null,
            totalTimeInSeconds
          );
          const newTime = result.toTimeString().split(" ")[0].substring(3);
          const paceTime = paceResult.toTimeString().split(" ")[0].substring(3);

          el.pace = paceTime;
          el.runTime = newTime;
        });
        const sortt = data
          .map((item) => {
            item.times = new Date(item.ts);
            return item;
          })
          .sort((a, b) => b.times - a.times);

        const sorted = res.data
          .sort((a, b) => (a.score < b.score ? 1 : -1))
          .map((el, i) => {
            el.overallScore = el.score;
            el.rank = i + 1;
            return el;
          });
        //console.log(sorted); //sorts the data for the leaderboard
        if (this.state.user) {
          let count = 0;
          for (let i = 0; i < sorted.length; i++) {
            count++; //counts how far down the list the user is ranked on the leaderboard
            if (sorted[i].username === this.state.user) {
              //once it reaches the client name it sets the details to the state
              this.setState({ userScore: sorted[i].score, userRank: count });
            }
          }
        }
        this.setState({
          allChallenges: sortt,
          leaderboardLoading: false, //cancels leaderboard loading
          sortedData: sorted,
        });
      });
  }
}
export default withRouter(ChallengePage);
