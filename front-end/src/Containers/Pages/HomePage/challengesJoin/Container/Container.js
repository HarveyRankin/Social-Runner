import React, { Component } from "react";
import classes from "./Container.module.css";
import axios from "axios";
import { Select, Button, Divider, TextField } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Cross from "../../../../../Ui/Icons/cross";
import CardContainer from "../challengesContainer/CardContainer";
import Arrow from "../../../../../Ui/Icons/arrowRight";
import { withRouter } from "react-router-dom";
import CardView from "../../../../../Components/CardView/CardView";
import Backdrop from "../../../../../Ui/Backdrop/backdrop";
import Modal from "../../../../../Hoc/Modal/modal";
import ChallengeOverview from "../../../../../Components/challengestoJoin/challengeDisplay/challengeOverview";
import SingleContainer from "../../../HomePage/challengesJoin/challengesContainer/SingleContainer";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import LinearProgress from "@material-ui/core/LinearProgress";

class Container extends Component {
  state = {
    joinedCard: false,
    joinedChallenge: false,
    currentCard: null,
    showFilterPanel: false,
    showCardPanel: false,
    challenges: [],
    cards: [],
    user: null,
    userFilter: "global",
    challengeType: "bingo",
    groupChallenges: [],
    title: "testing",
    startDate: "testing",
    currentChallenge: null,
    showBackdrop: null,
    filterByjoined: "all",
    challengesJoined: [],
    cardsJoined: [],
    cardsForFilter: [],
    challengesForFilter: [],
    isExpired: "current",
    loadingData: null,
    filDisplayUserFilter: 'global',
    filDisplayChallengeType: 'individual',
    filDisplayByJoined: 'all',
    filDisplayIsExpired: 'current'
  };
  handleJoinCardClick = () => {
    const card = this.state.currentCard;
    axios
      .post(
        `challenges/group/addUser/${card}`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        alert("Joined Card");

        this.setState({ joinedCard: true, cardsJoined: res.data });
      })
      .catch((err) => console.log(err));
  };
  filterFriends = (e) => {
    const value = e.target.value;
    const reg = new RegExp(value.split("").join(".*"), "i");
    
    if (this.state.challengeType === "individual") {
      const dataToFilter = this.state.challengesForFilter;
      //create regular expression to match
      if (value === "") return this.setState({ challenges: dataToFilter });
      const filtered = dataToFilter.filter((item) => {
        if (item.creator.match(reg)) return item;
      });
      this.setState({ challenges: filtered });
    } else {
      
      const dataToFilter = this.state.cardsForFilter;
      if (value === "") return this.setState({ cards: dataToFilter });
      const filtered = dataToFilter.filter((item) => {
        if (item.creator.match(reg)) return item;
      });

      this.setState({ cards: filtered });
    }
  };

  handleExpiryRadio = (e) => {
    const value = e.target.value;
    
    if (value === "expired") {
      this.setState({
        isExpired: value,
        filterByjoined: "joined",
        userFilter: "global",
      });
    } else this.setState({ isExpired: value });
  };

  setChallengeType = (e) => this.setState({ challengeType: e.target.value });

  setGroup = (e) => this.setState({ userFilter: e.target.value });

  getData = () => {
    this.setState({filDisplayUserFilter:this.state.userFilter,filDisplayChallengeType:this.state.challengeType,filDisplayByJoined:this.state.filterByjoined,filDisplayIsExpired:this.state.isExpired})
    if (this.state.challengeType === "individual") {
      const joinedChallenges = this.state.challengesJoined;
      if (
        this.state.userFilter === "global" &&
        this.state.isExpired === "current"
      ) {
        axios
          .get("challenges/single", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => res)
          .then((json) => {
            const challenges = json.data;

            return challenges;
          })
          .then((challenges) => {
            const allChallenges = challenges;
            const newChallenges = allChallenges.map((challenge) => {
              challenge.joined = false;
              for (let chall of joinedChallenges) {
                if (chall.individual_id === challenge.individual_id)
                  challenge.joined = true;
              }
              return challenge;
            });

            this.filterData(newChallenges);
          })
          .catch((err) => console.log(err));
      } else if (
        this.state.userFilter === "global" &&
        this.state.isExpired === "expired"
      ) {
        console.log("do something"); //get the expired challenges
        axios
          .get("/challenges/single/expired", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            if (res.data.length === 0) {
              return this.setState({
                challenges: [],
                cards: [],
                cardsForFilter: [],
                challengesForFilter: [],
              });
            }

            const data = res.data.map((chall) => {
              chall.expired = true;
              chall.joined = "joined";
              return chall;
            });
          
            this.filterData(data);
          })
          .catch((err) => console.log(err));
      } else if (this.state.userFilter === "friends") {
        axios
          .get("/challenges/single/friends", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            if (!res.data || res.data.length === 0)
              return this.setState({
                challenges: [],
                cards: [],
                challengesForFilter: [],
              });
            const friendsChallenges = res.data;

            
            const data = friendsChallenges.map((friendChallenge) => {
              friendChallenge.joined = false;
              for (let chall of this.state.challengesJoined) {
                if (friendChallenge.individual_id === chall.individual_id)
                  friendChallenge.joined = true;
              }
              return friendChallenge;
            });
            this.filterData(data);
          });
        //pass to the filter
      } else if (this.state.userFilter === "club") {
        axios
          .get("/challenges/single/userClubs", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
          
            const clubChallenges = res.data;

            const data = clubChallenges.map((clubChallenge) => {
              clubChallenge.joined = false;
              for (let chall of joinedChallenges) {
                if (chall.individual_id === clubChallenge.individual_id)
                  clubChallenge.joined = true;
              }
              return clubChallenge;
            });
            this.filterData(data);
          });
      }
    } else if (this.state.challengeType === "bingo") {
     
      const cardsJoined = this.state.cardsJoined;
      if (
        this.state.userFilter === "global" &&
        this.state.isExpired === "current"
      ) {
        
        axios
          .get("/challenges/group", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            const allCards = res.data;

            return allCards;
          })
          .then((cards) => {
           
            const data = cards.map((card) => {
              card.joined = false;
              for (let el of cardsJoined) {
                if (el.id === card.id) card.joined = true;
              }
              return card;
            });
            this.filterData(data);
          })
          .catch((err) => console.log(err));
      } else if (
        this.state.userFilter === "global" &&
        this.state.isExpired === "expired"
      ) {
     
        axios
          .get("/challenges/group/expired", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
          
            if (res.data.length === 0)
              return this.setState({
                cards: [],
                challenges: [],
                cardsForFilter: [],
                challengesForFilter: [],
              });
            const data = res.data.map((card) => {
              card.joined = "joined";
              card.expired = true;
              return card;
            });
            this.filterData(data);
          })
          .catch((err) => console.log(err));
      } else if (this.state.userFilter === "friends") {
       
        axios
          .get("/challenges/group/friends", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            if (!res.data || res.data.length === 0)
              return this.setState({
                challenges: [],
                cards: [],
                cardsForFilter: [],
              });
            const friendsCards = res.data;
            const data = friendsCards.map((friendCard) => {
              friendCard.joined = false;
              for (let cardJoined of cardsJoined) {
                if (friendCard.id === cardJoined.id) friendCard.joined = true;
              }
              return friendCard;
            });
            this.filterData(data);
          })
          .catch((err) => console.log(err));
      } else if (this.state.userFilter === "club") {
       
        axios
          .get("/challenges/group/userClubs", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            const clubCards = res.data;
            const data = clubCards.map((clubCard) => {
              clubCard.joined = false;
              for (let joined of cardsJoined) {
                if (joined.id === clubCard.id) clubCard.joined = true;
              }
              return clubCard;
            });
            this.filterData(data);
          })
          .catch((err) => console.log(err));
      }
    }

    //get the data
  };
  filterData = (challenges) => {
    let newChallenges = challenges;
    if (this.state.filterByjoined === "joined")
      newChallenges = challenges.filter((challenge) => challenge.joined);
    if (this.state.filterByjoined === "notJoined")
      newChallenges = challenges.filter((challenge) => !challenge.joined);
    if (this.state.challengeType === "individual")
      this.setState({
        challengesForFilter: newChallenges,
        challenges: newChallenges,
        cards: [],
      });
    if (this.state.challengeType !== "individual") {
   
      this.setState({
        cardsForFilter: newChallenges,
        cards: newChallenges,
        challenges: [],
      });
    }
  };
  navigateToCardPage = (cardId) => {
 
    //check if they have joined this
    axios
      .get(`challenges/group/checkUserJoined//${cardId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.data === "not Joined") {
          axios
            .get(`/challenges/group/${cardId}`, {
              //gets the card details
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              const challenges = res.data;
              for (let el of challenges) {
                el.complete = false;
              }
              const elPerRow = challenges[0].colsNum;
              const sortedChallenges = challenges.reduce(
                (rows, key, index) =>
                  (index % elPerRow == 0
                    ? rows.push([key])
                    : rows[rows.length - 1].push(key)) && rows,
                []
              );
              this.setState({
                groupChallenges: sortedChallenges,
                showCardPanel: true,
                showFilterPanel: false,
                currentCard: cardId,
              });
            })
            .catch((err) => console.log(err));
        } else {
          //send to card page
          this.props.history.push(`/card/${cardId}`);
        }
      })
      .catch((err) => console.log(err));
  };
  toggleBackDrop = () =>
    this.setState({ showBackdrop: false, joinedChallenge: false });
  toggleCardPanel = () =>
    this.setState({ showCardPanel: false, joinedCard: false });
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
  handleCheckbox = (e) => {
    
    if (this.state.filterByjoined === "completed") {
     
      this.setState({ filterByjoined: "all" });
      this.getData();
    } else {
      this.setState({ filterByjoined: e.target.value });
      this.getCompleted();
    }
  };
  getCompleted = () => {
    if (this.state.challengeType === "individual") {
     
      //get the completed single - can be expired
      axios
        .get(`/challenges/single/completed/all`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  };
  handleSingleChallengeClick = (individual_id, challenge_id) => {
    axios
      .get(`/challenges/single/checkSingleJoined/${individual_id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const challenge = res.data.id;
        const response = res.data.data;
        if (response === "Joined") {
          this.props.history.push(`/challenge/single/${challenge}`);
        } else {
          
          const chall = this.state.challenges.filter(
            (item) => item.challenge_id === challenge_id
          )[0];
          this.setState({ currentChallenge: chall, showBackdrop: true });
        }
      })
      .then((err) => console.log(err));
  };
  handleChallengeJoin = () => {
    
    const individual_id = this.state.currentChallenge.individual_id;
   
    axios
      .get(`challenges/addAthlete/${individual_id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        alert("Joined Challenge");
        const joined = res.data;
        this.setState({ joinedChallenge: true, challengesJoined: joined });
      })
      .catch((err) => console.log(err));
  };
  handleFilteredJoin = (e) => {
    this.setState({ filterByjoined: e.target.value });
  };
 

  render() {
   
    if(this.state.currentCard){
      const descrip = this.state.cards.filter(el => el.description === this.state.currentCard).map(obj => obj.description);
      console.log(descrip)
    }
    return (
      <React.Fragment>
        <Backdrop
          show={this.state.showBackdrop}
          clicked={this.toggleBackDrop}
        />
        <Modal show={this.state.showBackdrop}>
          {this.state.currentChallenge && this.state.cards.length > 0 ? (
            <ChallengeOverview challenge={this.state.currentChallenge} />
          ) : null}
          {this.state.currentChallenge && this.state.challenges.length > 0 ? (
            <div>
              {!this.state.joinedChallenge ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={this.handleChallengeJoin}
                    style={{ marginBottom: "2%" }}
                    color="secondary"
                    variant="contained"
                  >
                    Join Challlenge
                  </Button>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={() =>
                      this.handleSingleChallengeClick(
                        this.state.currentChallenge.individual_id,
                        this.state.currentChallenge.challenge_id
                      )
                    }
                    style={{ marginBottom: "2%" }}
                    color="primary"
                    variant="contained"
                  >
                    Challenge Page
                  </Button>
                </div>
              )}

              <ChallengeOverview challenge={this.state.currentChallenge} />
            </div>
          ) : null}
        </Modal>

        {this.state.showCardPanel ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              width: "50%",
              padding: "5%",
              backgroundColor: "rgba(28, 28, 62, 0.8)",
              top: "0",
              bottom: "0",
              left: "-10px",
              zIndex: "1000",
              transition: "3000ms left cubic-bezier(0.77, 0, 0.175, 1)",
              OverflowX: "hidden",
              overflowY: "scroll",
              padding: "3%",
              boxShadow: "10px 4px 15px 1px rgba(0,0,0,0.78)",
              border: "1px solid black",
            }}
          >
            <div style={{ display: "flex" }}>
              <Cross
                className={classes.Cross}
                onClick={this.toggleCardPanel}
                style={{
                  width: "10%",
                  height: "auto",
                  cursor: "pointer",
                  marginLeft: "auto",
                  color: "red",
                }}
              />
            </div>
            {!this.state.joinedCard ? (
              <div>
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    fontSize: "60px",
                    marginBottom: "1%",
                    fontFamily: "Crushed-regular",
                  }}
                >
                  JOIN GROUP CHALLENGE
                </p>
              </div>
            ) : null}

            {!this.state.joinedCard ? (
              <Button
                onClick={this.handleJoinCardClick}
                style={{ marginTop: "1%", marginBottom: "2%" }}
                color="secondary"
                variant="contained"
              >
                Join Card
              </Button>
            ) : (
              <Button
                onClick={() =>
                  this.navigateToCardPage(this.state.groupChallenges[0][0].id)
                }
                style={{ marginTop: "1%", marginBottom: "2%" }}
                color="primary"
                variant="contained"
              >
                Card Page
              </Button>
            )}
            <CardView
              description={"No description"}
              click={this.handleViewClick}
              challenges={this.state.groupChallenges}
              bingoTitle={this.state.groupChallenges[0][0].card_title}
              bingoDate={
                this.state.groupChallenges[0][0].end_date.split("T")[0]
              }
            />
          </div>
        ) : null}
        <div className={classes.Con}>
          <div style={{ display: "flex" }}>
            <div className={classes.FilterCon}>
              <p style={{ color: "white", fontWeight: "bold" }}>
                {this.state.filDisplayChallengeType.toLocaleUpperCase()}
              </p>
            </div>
            <div className={classes.FilterCon}>
              <p style={{ color: "white", fontWeight: "bold" }}>
                {this.state.filDisplayUserFilter.toLocaleUpperCase()}
              </p>
            </div>
            <div className={classes.FilterCon}>
              <p style={{ color: "white", fontWeight: "bold" }}>
                {this.state.filDisplayByJoined.toLocaleUpperCase()}
              </p>
            </div>
            <div className={classes.FilterCon}>
              <p style={{ color: "white", fontWeight: "bold" }}>
                {this.state.filDisplayIsExpired.toLocaleUpperCase()}
              </p>
            </div>

            <TextField
              onChange={this.filterFriends}
              style={{
                width: "24%",
                marginLeft: "auto",
                marginBottom: "1%",
                marginTop: "1%",
                marginRight: "1%",
              }}
              id="outlined-basic"
              label="Search Friends"
              variant="outlined"
            />
          </div>
          <div className={classes.SubCon}>
            {this.state.loadingData ? (
              <div style={{ marginTop: "30%" }}>
                <LinearProgress />
              </div>
            ) : null}
            <div style={{ width: "95%" }}>
            {this.state.challenges.length === 0 && this.state.cards.length === 0? <div
            className={classes.NoChallenges}
            >
              <p>No Challenges</p>
            </div>
            :null}
              {this.state.cards.length > 0 ? (
                
                  
                <CardContainer
                  click={this.navigateToCardPage}
                  cards={this.state.cards}
                />
                
              ) : null}
              {this.state.challenges.length > 0 ? (
                <SingleContainer
                  click={this.handleSingleChallengeClick}
                  challenges={this.state.challenges}
                />
              ) : null}
            </div>
            {!this.state.loadingData ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: "5%",
                  marginTop: "2%",
                }}
              >
                <Divider />
                <FormControl
                  style={{ marginTop: "1%", width: "100%" }}
                  className={classes.formControl}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Challenge Type
                  </InputLabel>
                  <Select
                  inputProps = {{
                    label:'50px'
                  }}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.challengeType}
                    label="Select Challenge Type"
                    onChange={this.setChallengeType}
                  >
                    <MenuItem value="individual">Single</MenuItem>
                    <MenuItem value="bingo">Bingo</MenuItem>
                  </Select>
                </FormControl>
                <FormControl style={{ marginTop: "5%" }} component="fieldset">
                  <FormLabel style={{ marginTop: "1%" }} component="legend">
                    Sort by Status
                  </FormLabel>
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={this.state.filterByjoined}
                    onChange={this.handleFilteredJoin}
                  >
                    <FormControlLabel
                      value="joined"
                      control={<Radio />}
                      label="Joined"
                      disabled={this.state.filterByjoined === "completed"}
                    />
                    <FormControlLabel
                      value="notJoined"
                      control={<Radio />}
                      label="Not Joined"
                      disabled={
                        this.state.isExpired === "expired" ||
                        this.state.filterByjoined === "completed"
                      }
                    />

                    <FormControlLabel
                      value="all"
                      control={<Radio />}
                      label="All"
                      disabled={
                        this.state.isExpired === "expired" ||
                        this.state.filterByjoined === "completed"
                      }
                    />
                  </RadioGroup>
                </FormControl>
                <Divider />
                <FormControl style={{ marginTop: "5%" }} component="fieldset">
                  <FormLabel style={{ marginTop: "2%" }} component="legend">
                    Filter by Group
                  </FormLabel>
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={this.state.userFilter}
                    onChange={this.setGroup}
                  >
                    <FormControlLabel
                      value="global"
                      control={<Radio />}
                      label="Global"
                      disabled={this.state.filterByjoined === "completed"}
                    />
                    <FormControlLabel
                      value="friends"
                      control={<Radio />}
                      label="Friends"
                      disabled={
                        this.state.isExpired === "expired" ||
                        this.state.filterByjoined === "completed"
                      }
                    />
                    <FormControlLabel
                      value="club"
                      control={<Radio />}
                      label="Clubs"
                      disabled={
                        this.state.isExpired === "expired" ||
                        this.state.filterByjoined === "completed"
                      }
                    />
                  </RadioGroup>
                </FormControl>
                <Divider />
                <FormControl style={{ marginTop: "5%" }} component="fieldset">
                  <FormLabel style={{ marginTop: "2%" }} component="legend">
                    Filter by Relevancy
                  </FormLabel>
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={this.state.isExpired}
                    onChange={this.handleExpiryRadio}
                  >
                    <FormControlLabel
                      value="current"
                      control={<Radio />}
                      label="Current"
                      disabled={this.state.filterByjoined === "completed"}
                    />
                    <FormControlLabel
                      value="expired"
                      control={<Radio />}
                      label="Expired"
                      disabled={this.state.filterByjoined === "completed"}
                    />
                  </RadioGroup>
                </FormControl>
                <Divider />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "5%",
                  }}
                >
                  <Button
                    onClick={this.getData}
                    color="secondary"
                    variant="contained"
                  >
                    Apply Filter
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }

  componentDidMount() {
    this.setState({ loadingData: true });
    axios
      .get("challenges/single", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => res)
      .then((json) => {
        const challenges = json.data;
        return challenges;
      })
      .then((challenges) => {
        // console.log(challenges);
        const allChallenges = challenges;
        axios
          .get("/challenges/single/joined", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((result) => {
            const joinedChallenges = result.data;
            
            const newChallenges = allChallenges.map((challenge) => {
              challenge.joined = false;
              for (let chall of joinedChallenges) {
                if (chall.individual_id === challenge.individual_id)
                  challenge.joined = true;
              }
              return challenge;
            });
            this.setState({
              challengesForFilter: newChallenges,
             
              challengesJoined: joinedChallenges,
              loadingData: false,
            });
          });
      })
      .catch((err) => console.log(err));
    axios
      .get("/challenges/group/joined", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
       
        this.setState({ cardsJoined: res.data })
        this.getData()
      });
  }
}

export default withRouter(Container);

//challenges: newChallenges,