import React, { Component } from "react";
import Uuid from "uuid4";
import Input from "@material-ui/core/Input";
import Backdrop from "../../../Ui/Backdrop/backdrop";
import Modal from "../../../Hoc/Modal/modal";
import SingleChallenge from "../../../Components/SingleChallenge/singleChallenge";
import classes from "./bingoBuilder.module.css";
import Tabs from "../../../Components/Navigation/TabPanel/tabPanel";
import Challenge from "../../../Components/Challenge/challenge";
import verification from "../../../helperFunctions/Verification/verificationChallenge";
import SinglePreview from "./SingleChallengePreview/singleChallengePreview";
import axios from "axios";
import { Button, Divider, TextField } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import Cross from "../../../Ui/Icons/cross";
import Dates from "../../../Components/Challenge/DateInputs/dateInputs";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import ChallengeTable from "../../../Components/ChallengestTable/challengesTable";
import ChallengeOverview from "../../../Components/challengestoJoin/challengeDisplay/challengeOverview";
//challenge create page
class Bingbuiler extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  state = {
    previewSubmitted: false, //this will change the modal and backdrop when implemeted
    NotSelected: true,
    challenges: [], //when creating a bingo card this where they are stored
    challenge: { //storage of the single challenge
      title: "",
      description: "",
      gps: false,
      photo: false,
      userDescription: false,
      startDate: null,
      endDate: null,
      score: 1,
      distance: 0,
      elevation: 0,
      privacy: "global",
      clubSelected: null,
      //sets the privacy
    },
    refreshToggles: 1, //this is changed when refreshed
    bingoDescription: null, //bingo card description
    bingoTitle: null, //bingo card tite
    endDate: null, //bingo card end date
    startDate: null, //bingo card start date
    bingoPrivacy: "global", //card privacy
    showBackDrop: false, //shows the backdrop
    type: 1, //tab type number
    singleChallengeError: null, //error for single challenge
    challengeNum: null, //challenge Number
    showGridInput: false, //show grid input
    groupChallengeSelected: null,
    groupChallengeErrors: [],
    rows: 2,
    columns: 2,
    currentGroupChallengeRow: null,
    currentGroupChallengeCol: null,
    showGroupInput: false,
    clubs: [],
    clubSelected: null,
    handleGroupToggles: 1, //this is the challenge that has been select = this is a reference to the challenges array
  };

  toggleBackdrop = () => {
    this.setState({
      showBackDrop: !this.state.showBackDrop,
      showGroupInput: false,
    });
  };
  handleChangeNum = (e) => {
    const num = +e.target.value;
    this.setState({ challengeNum: num });
  };
  addChallenges = () => {
    //this adds the group challenges to the state
    const challenges = [];
    for (let i = 0; i < this.state.rows; i++) {
      const row = i;
      const array = [];
      for (let j = 0; j < this.state.columns; j++) {
        const col = j;
        array.push({
          row: row,
          col: col,
          description: "",
          title: "Challenge Title",
          gps: false,
          photo: false,
          userDescription: false,
          startDate: null,
          endDate: null,
          score: 1,
          distance: "",
          elevation: "",
        });
      }
      challenges.push(array);
    }
    this.setState({
      challenges: challenges,
      challengeNum: this.state.rows * this.state.columns,
      NotSelected: false,
    });
  };
  changeTitle = (event) => {
    this.setState({ title: event.target.value });
  };
  titleInput = (event, id, type) => {
    //create a deep copy
    const newChallenges = [...this.state.challenges];
    for (let el of newChallenges) {
      if (el.id === id) {
        el[type] = event.target.value;
      }
    }
    this.setState({ challenges: newChallenges });
  };
  handlePreview = () => {
   
    const verified = verification.IndividualChallenge(
      this.state.challenge,
      "single"
    );
    if (verified === "verified") {
      this.setState({ showBackDrop: true, singleChallengeError: false });
    } else {
      this.setState({ singleChallengeError: verified });
    }
  };
  handleTypeValue = (type) => {
    //this changes the state of the tabs and refreshes the state
    //set the type value
    console.log("running");
    let objectCopy = Object.assign({}, this.state); //refreshing the state
    objectCopy.challenge = {
      title: "",
      description: "",
      gps: false,
      photo: false,
      userDescription: false,
      startDate: "",
      endDate: "",
      score: 1,
      distance: 0,
      elevation: 0,
      privacy: "global",
      clubSelected: null,
    };
    //refresh the state
    objectCopy.singleChallengeError = null;
    objectCopy.challenges = [];
    objectCopy.challengeNum = null;
    objectCopy.showGridInput = false;
    objectCopy.type = type;
    objectCopy.bingoDescription = "";
    objectCopy.bingoTitle = "";
    objectCopy.startDate = "";
    objectCopy.endDate = "";
    objectCopy.groupChallengeErrors = [];
    objectCopy.rows = 2;
    objectCopy.columns = 2;
    objectCopy.NotSelected = true;
    objectCopy.currentGroupChallengeRow = null;
    objectCopy.currentGroupChallengeCol = null;
    objectCopy.showGroupInput = false;
    objectCopy.clubs = [];
    objectCopy.clubSelected = null;
    objectCopy.refreshToggles = 1;
    objectCopy.handleGroupToggles = 1;
    this.setState(objectCopy);
  };
  handleChallengeChange = (e) => {
    //handle any input data onChanges
    const prop = e.target.name;
    const value = e.target.value;
    //console.log(e.target.name);
    let objectCopy = Object.assign({}, this.state);
    objectCopy.challenge[prop] = value;
    this.setState(objectCopy);
  };
  handleToggle = (type, value) => {
    //handles the toggle for gps,description and photo, for both card and single
    let statusCopy = Object.assign({}, this.state);
    statusCopy.challenge[type] = value; //sets the toggle to true or false
    statusCopy.challenge.distance = null;
    statusCopy.challenge.elevation = null;
    this.setState(statusCopy);
  };
  handleGroupChallengeNum = (num) => {
    //get the index num
    const index = num - 1;
    //wipe the previous data
    let objectCopy = Object.assign({}, this.state);
    objectCopy.challenge = {
      title: "",
      description: "",
      gps: false,
      photo: false,
      userDescription: false,
      startDate: null,
      endDate: null,
      score: 1,
      distance: 0,
      elevation: 0,
      privacy: "global",
    };
    //set it to the state for later
    //set input to true
    this.setState(objectCopy);
    this.setState({ groupChallengeSelected: index, showGridInput: true });
  };
  handleConfirmedGroupChallenge = () => {
    //need to add boundarie verification for the distance and elevation to stop people typing anything below 0
    const i = this.state.groupChallengeSelected;
    const challenge = this.state.challenge;
    const verified = verification.IndividualChallenge(challenge, "group"); //group verifiation function
    if (verified !== "verified") { //if true run
      this.setState({ singleChallengeError: verified });
      return;
    }
    const newChallenges = [...this.state.challenges];
    newChallenges[i] = challenge;
    this.setState({
      challenges: newChallenges,
      singleChallengeError: false,
      showGridInput: false, //ressetig the page
    });
  };
  submitSingleChallenge = () => {
    //submit the challenge to the server
    axios
      .post("/challenges/single", this.state.challenge, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        if (
          res.status === 200 &&
          res.data.data === "succesfully added to database"
        ) {
          alert("Challenge succesfully created");
          let objectCopy = Object.assign({}, this.state);
          const now = new Date();
          objectCopy.challenge = {
            title: "",
            description: "",
            gps: false,
            photo: false,
            userDescription: false,
            startDate: "dd/mm/yyyy",
            endDate: "dd/mm/yyyy",
            score: 1,
            distance: 0,
            elevation: 0,
            privacy: "global",
            clubSelected: null,
          };
          objectCopy.clubs = [];
          objectCopy.showBackDrop = false;
          objectCopy.singleChallengeError = null;
          objectCopy.refreshToggles++;
          this.setState(objectCopy);
        } else {
          alert("Sorry that didn't work ");
        }
      })
      .catch((err) => console.log(err));
    //if succesful, refresh the challenge
  };
  submitGroupChallenge = () => {
    const details = this.state;
    const bingoCard = {
      title: details.bingoTitle,
      description: details.bingoDescription,
      startDate: details.startDate,
      endDate: details.endDate,
      challenges: details.challenges,
      privacy: details.bingoPrivacy,
      rows: details.rows,
      cols: details.columns,
      club: details.clubSelected,
    };
    const verified = verification.GroupChallenge(bingoCard);

    if (verified === "verified") {
      this.setState({ groupChallengeErrors: [] });
      axios
        .post("/challenges/group", bingoCard, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.data === "success") {
            alert("Card Created");

            this.handleTypeValue(1);
          } else {
            alert("Oops that didnt work");
          }
        })
        .catch((err) => {
          console.log("not happening");
          console.log(err);
        });
      //post to the server
    } else {
      this.setState({ groupChallengeErrors: verified });
    }
  };
  handleBingoNext = () => { //method handles the next button on the bingo card page
    //verifiy the details inputted
    const {
      bingoDescription,
      bingoTitle,
      startDate,
      endDate,
      rows,
      columns,
    } = this.state;
    const data = {
      bingoDescription,
      bingoTitle,
      startDate,
      endDate,
      rows,
      columns,
    };
    const verified = verification.NextVerification(data); //checks all data before progressing
    if (verified !== "verified") {
      this.setState({ singleChallengeError: verified });
      return;
    }
    //create challenges
    this.addChallenges();
    this.setState({ singleChallengeError: null });
    //creates the challenges array
    //toggle to other page
  };
  handleBingoInputDisplay = (row, col) => {
    const details = [row, col];

    this.setState(
      {
        currentGroupChallengeRow: row,
        currentGroupChallengeCol: col,
        handleGroupToggles: (this.state.handleGroupToggles =
          this.state.handleGroupToggles + 1),
      },
      () => {
        this.setState({
          details,
          showBackDrop: true,
          showGroupInput: true,
        });
      }
    );
  };

  handleBingoChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const newObj = { ...this.state };
    newObj[name] = value;
    this.setState(newObj);
  };
  handleEditChange = (e, num) => {
    //handles the changes with the edit
    const key = e.target.name;
    const value = e.target.value;
    const index = num - 1;
    const newChallenges = [...this.state.challenges];
    newChallenges[index][key] = value;
    this.setState({ challenges: newChallenges });
  };
  handleGroupToggle = (name, value) => {
    //handles any changes with the edit (toggles)
    const row = this.state.currentGroupChallengeRow;
    const col = this.state.currentGroupChallengeCol;
    const newChallenges = [...this.state.challenges];
   
    newChallenges[row][col][name] = value;
    
    this.setState({ challenges: newChallenges });
  };
  handleCancel = () => {
    this.setState({ showGridInput: false });
  };
  handleGroupChallengeChange = (e) => {
    const row = this.state.currentGroupChallengeRow;
    const col = this.state.currentGroupChallengeCol;
    const value = e.target.value;
    const name = e.target.name;
    const newChallenges = [...this.state.challenges];
    newChallenges[row][col][name] = value;
    this.setState({ challenges: newChallenges });
  };
  test = () => {
    this.setState({ NotSelected: true });
  };
  resetCard = () => {
    const currentTypeState = this.state.type;
    this.handleTypeValue(currentTypeState); //refreshes the whole state, remains on builder for card
  };
  handleBacktoCard = () => {
    this.setState({ NotSelected: false });
  };
  setChallengePrivacy = (e) => {
    const value = e.target.value;
    const newChallenge = { ...this.state.challenge };
    if (value === "club") {
      console.log("yes");
      axios
        .get("/clubs/checkIfFollow", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          let joined = res.data;
          console.log(joined);
          if (joined.length === 0 || !joined) {
            joined = [];
          }

          newChallenge.privacy = value;
          console.log(joined);
          joined.length > 0
            ? this.setState({ challenge: newChallenge, clubs: joined })
            : this.setState({ challenge: newChallenge, clubs: [] });
        })
        .catch((err) => console.log(err));
    } else {
      newChallenge.privacy = value;
      this.setState({ challenge: newChallenge, clubs: [] });
    }
  };
  setGroupPrivacy = (e) => {
    const value = e.target.value;
    console.log(value);
    if (value === "club") {
      axios
        .get("/clubs/checkIfFollow", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          let joined = res.data;
          console.log(joined);
          if (joined.length === 0 || !joined) {
            joined = [];
          }
          console.log(joined);
          joined.length > 0
            ? this.setState({ bingoPrivacy: value, clubs: joined })
            : this.setState({ bingoPrivacy: value, clubs: [] });
        });
    } else {
      this.setState({ bingoPrivacy: value, clubs: [] });
    }
  };
  handleCloseError = () => this.setState({ groupChallengeErrors: [] });
  render() {

    let grid = (
      <div style={{ fontFamily: "Crushed-regular", fontSize: "25px" }}>
        <div>
          <p>Please select the number of Rows and Columns</p>
          <div
            style={{
              display: "flex",
              padding: "2%",
              margin: "1%",
              justifyContent: "space-evenly",
            }}
          >
            <TextField
              onChange={this.handleBingoChange}
              style={{ margin: "1%" }}
              value={this.state.rows}
              name="rows"
              id="standard-number"
              label="Number of Rows"
              type="number"
              fullWidth
              InputProps={{
                inputProps: {
                  min: 2,
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              onChange={this.handleBingoChange}
              style={{ margin: "1%" }}
              value={this.state.columns}
              name="columns"
              id="standard-number"
              label="Number of Columns"
              type="number"
              fullWidth
              InputProps={{
                inputProps: {
                  max: 5,
                  min: 2,
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <TextField
            style={{ width: "100%", marginBottom: "5%" }}
            id="outlined-basic"
            onChange={this.handleBingoChange}
            name="bingoTitle"
            value={this.state.bingoTitle}
            label="Card Title"
            variant="outlined"
            required
          />
          <TextField
            value={this.state.bingoDescription}
            style={{ width: "100%" }}
            id="outlined-basic"
            onChange={this.handleBingoChange}
            name="bingoDescription"
            label="Card Description"
            variant="outlined"
            required
          />
          <Dates
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            change={this.handleBingoChange}
          />
          <FormControl
            style={{ width: "100%" }}
            className={classes.formControl}
          >
            <InputLabel id="demo-simple-select-helper-label">
              Privacy
            </InputLabel>
            <Select
              style={{ width: "100%" }}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              name="bingoPrivacy"
              value={this.state.bingoPrivacy}
              fullWidth
              onChange={this.setGroupPrivacy}
            >
              <MenuItem value="global">Global</MenuItem>
              <MenuItem value="friends">Friends</MenuItem>
              <MenuItem value="club">Club</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
            <FormHelperText>SELECT PRIVACY</FormHelperText>
          </FormControl>
          {this.state.clubs.length > 0 ? (
            <FormControl
              style={{ width: "100%", marginTop: "2%" }}
              className={classes.formControl}
            >
              <InputLabel id="demo-simple-select-helper-label">
                Select Club
              </InputLabel>
              <Select
                onChange={this.handleBingoChange}
                name="clubSelected"
                style={{ width: "100%" }}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                fullWidth
              >
                {this.state.clubs.map((map) => {
                  return (
                    <MenuItem value={map.clubname}>{map.clubname}</MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>SELECT A CLUB</FormHelperText>
            </FormControl>
          ) : null}
          {this.state.challenges.length === 0 ? (
            <div
              stye={{ display: "table", margin: "0 auto", paddingLeft: "40%" }}
            >
              <Button
                onClick={this.handleBingoNext}
                variant="outlined"
                color="secondary"
                style={{
                  marginTop: "5%",
                }}
              >
                Next
              </Button>
              {this.state.singleChallengeError ? ( //if single errors occurs
                <Alert
                  style={{ marginBottom: "2%", marginTop: "5%" }}
                  variant="outlined"
                  severity="error"
                >
                  <p>{this.state.singleChallengeError}</p>
                </Alert>
              ) : null}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                marginTop: "5%",
              }}
            >
              <Button
                onClick={this.resetCard}
                variant="outlined"
                color="secondary"
              >
                Reset
              </Button>
              <Button
                onClick={this.handleBacktoCard}
                variant="outlined"
                color="primary"
              >
                Return to Card
              </Button>
            </div>
          )}
        </div>
      </div>
    );
    let show = "block";
    if (!this.state.NotSelected) {
      show = "none";
      grid = (
        <div style={{ marginTop: "10%", paddingRight: "30%" }}>
          <div>
            <ChallengeTable
              bingoTitle={this.state.bingoTitle}
              bingoDate={this.state.startDate}
              challenges={this.state.challenges}
              click={this.handleBingoInputDisplay}
            />
            <div className={classes.ButtonsContainer}>
              <Button
                style={{ marginLeft: "10%" }}
                color="secondary"
                variant="contained"
                onClick={this.test}
              >
                Back
              </Button>
              <Button
                style={{ marginRight: "10%" }}
                color="secondary"
                variant="contained"
                onClick={this.submitGroupChallenge}
              >
                Submit
              </Button>
            </div>
          </div>
          {this.state.groupChallengeErrors.length > 0 ? ( //if any errors relating to bingo card submission display alert error
            <div
              className={classes.Error}
              style={{
                height: "100%",
                zIndex: "9999",
                position: "fixed",
                width: "20%",
                top: "0px",
                left: "-10px",
                transitionDuration: "2s",
                transition: "transition:5s ease",
                overflowY: "scroll",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifySelf: "end",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <Cross
                  onClick={this.handleCloseError}
                  className={classes.Cross}
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    width: "20%",
                    height: "auto",
                  }}
                />
              </div>
              <Alert style={{ height: "100%" }} severity="error">
                <AlertTitle>Error</AlertTitle>
                {this.state.groupChallengeErrors.map((err) => {
                  return (
                    <div>
                      <Divider />
                      <p
                        style={{
                          width: "100%",
                          paddingTop: "3%",
                          paddingBottom: "3%",
                        }}
                      >
                        {err}
                      </p>
                    </div>
                  );
                })}
              </Alert>
            </div>
          ) : null}
        </div>
      );
    }
    return (
      <React.Fragment>
        {!this.state.NotSelected ? null : (
          <div className={classes.Intro}>
            <div
              style={{
                paddingLeft: "25%",
                paddingRight: "25%",
                paddingTop: "10%",
                paddingBottom: "5%",
              }}
            >
              <p style={{ fontSize: "60px", color: "white" }}>
                CREATE CHALLENGES
              </p>
              <div style={{ border: "1px solid white", marginTop: "5%" }}>
                <p
                  style={{
                    fontFamily: "Crushed-regular",
                    color: "white",
                    paddingTop: "2%",
                    paddingBottom: "2%",
                    paddingLeft: "3%",
                    paddingRight: "3%",
                    fontSize: "30px",
                  }}
                >
                  Create a single challenge or multi-challenge Bingo card
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={classes.Body}>
          <Modal show={this.state.showBackDrop}>
            {this.state.type === 0 ? (
              <div>
                <ChallengeOverview challenge={this.state.challenge} />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={this.submitSingleChallenge}
                    color="secondary"
                    variant="text"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            ) : null}
          </Modal>
          <Backdrop
            show={this.state.showGroupInput}
            clicked={this.toggleBackdrop}
          ></Backdrop>
          <Modal show={this.state.showGroupInput}>
            {this.state.currentGroupChallengeRow !== null ? (
              <Challenge
                togglesUpdate={this.state.handleGroupToggles}
                refreshToggles={this.state.refreshToggles}
                change={this.handleGroupChallengeChange}
                toggle={this.handleGroupToggle}
                challenge={
                  this.state.challenges[this.state.currentGroupChallengeRow][
                    this.state.currentGroupChallengeCol
                  ]
                }
              />
            ) : null}
          </Modal>

          <Backdrop
            show={this.state.showBackDrop}
            clicked={this.toggleBackdrop}
          ></Backdrop>

          <div style={{ display: show }} className={classes.Col2}>
            <Tabs
              type={this.handleTypeValue}
              click={this.handlePreview}
              addChallenges={this.addChallenges}
              change={this.handleTypeValue}
              changeNum={this.handleChangeNum}
              changeBingoDetails={this.handleBingoChange}
              groupSubmit={this.submitGroupChallenge}
              groupErrors={this.state.groupChallengeErrors}
            />
          </div>
          {this.state.NotSelected ? (
            <div className={classes.Col1}>
              {this.state.type === 1 ? ( //if it is a group challenge
                <div>
                  {this.state.showGridInput ? (
                    <div className={classes.LowerInput}>
                      <h2>Challenge {this.state.groupChallengeSelected + 1}</h2>
                      <Challenge
                        refreshToggles={this.state.refreshToggles}
                        change={this.handleChallengeChange}
                        toggle={(type, value) => this.handleToggle(type, value)}
                        dateInputs={!this.state.type}
                        challenge={this.state.challenge}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "2%",
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={this.handleConfirmedGroupChallenge}
                        >
                          Add Challenge
                        </Button>
                        <Cross
                          onClick={this.handleCancel}
                          className={classes.Cancel}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>{grid}</div>
                  )}
                </div>
              ) : (
                <div>
                  <Challenge
                    refreshToggles={this.state.refreshToggles}
                    change={this.handleChallengeChange}
                    toggle={(type, value) => this.handleToggle(type, value)}
                    dateInputs={!this.state.type}
                    challenge={this.state.challenge}
                    scoreValue={this.state.challenge.score}
                  />
                  <FormControl
                    style={{ width: "100%" }}
                    className={classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-helper-label">
                      Privacy
                    </InputLabel>
                    <Select
                      style={{ width: "100%" }}
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      onChange={this.setChallengePrivacy}
                      name="privacy"
                      fullWidth
                      value={this.state.challenge.privacy}
                    >
                      <MenuItem value="global">Global</MenuItem>
                      <MenuItem value="friends">Friends</MenuItem>
                      <MenuItem value="club">Club</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                    </Select>
                    <FormHelperText>SELECT A PRIVACY SETTING</FormHelperText>
                  </FormControl>
                  {this.state.clubs.length > 0 ? (
                    <FormControl
                      style={{ width: "100%", marginTop: "2%" }}
                      className={classes.formControl}
                    >
                      <InputLabel id="demo-simple-select-helper-label">
                        Select Club
                      </InputLabel>
                      <Select
                        style={{ width: "100%" }}
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        fullWidth
                        name="clubSelected"
                        onChange={this.handleChallengeChange}
                      >
                        {this.state.clubs.map((map) => {
                          return (
                            <MenuItem value={map.clubname}>
                              {map.clubname}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <FormHelperText>SELECT A CLUB</FormHelperText>
                    </FormControl>
                  ) : null}
                  <Button
                    onClick={this.handlePreview}
                    style={{ marginTop: "5%" }}
                    color="primary"
                    variant="outlined"
                  >
                    Preview Challenge
                  </Button>
                  {this.state.singleChallengeError ? ( //if single errors occurs
                    <Alert
                      style={{ marginBottom: "2%", marginTop: "5%" }}
                      variant="outlined"
                      severity="error"
                    >
                      <p>{this.state.singleChallengeError}</p>
                    </Alert>
                  ) : null}
                </div>
              )}
            </div>
          ) : (
            <div style={{ width: "150%" }}>{grid}</div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Bingbuiler;
//need to add a modal
