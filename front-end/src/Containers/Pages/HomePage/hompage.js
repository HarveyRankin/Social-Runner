//this page is gonna be a place of naviagation - u can go anywhere from here almost

import React, { Component } from "react";
import WelcomePLague from "../../../Components/WelcomePlague.js/welcome";
import classes from "./homepage.module.css";
import Toggle from "../../../Ui/Toggle/toggle";
import axios from "axios";
import UserChallengesToJoin from "../../../Components/challengestoJoin/challengesToJoin";
import { withRouter } from "react-router-dom";
import FriendSearch from "../../../Components/SearchComponents/FriendSearch/FriendSearch";
import ClubSearch from "../../../Components/SearchComponents/Clubs/clubSearch";
import Backdrop from "../../../Ui/Backdrop/backdrop";
import ChallengesContainer from "./challengesJoin/Container/Container";
import Transition from "react-transition-group/Transition";
import Home from "../../../Ui/Icons/home";
import { TextField } from "@material-ui/core";
import Plus from "../../../Ui/Icons/plus";
//homepage of the application
class Homepage extends Component {
  state = {
    private: null,
    singleChallenges: [],
    cards: [],
    usersSearched: [],
    user: null,
    userSearch: null,
    showClubCreate: false,
    clubCreateValue: null,
    clubSearch: null,
    clubs: [],
    showbackdrop: false,
    showFilterPanel: false,
  };
  //navigate to single page
  toSingleChallengePage = (challenge_id) => {
    this.props.history.push(`/challenge/single/${challenge_id}`);
  };
  handleCardClick = (card_id) => {
    this.props.history.push(`/card/${card_id}`);
  };
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ userSearch: value });
  };
  searchUsers = (e) => {
    if (e.keyCode === 13 || e === "updated") {
      const searchQuery = this.state.userSearch;
      this.setState({ userSearch: searchQuery, clubs: [] });
      axios
        .get(`/athletes/search/${searchQuery}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          let data = res.data.filter(
            (item) => item.username !== this.state.user
          );
          if (!res.data) data = [];
          return data;
          //passing the users data on
        })
        .then((res) => {
          const users = res;
          axios
            .get("athletes/checkRequests/", {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              const requests = res.data;
              const client = this.state.user;
              users.forEach((obj) => {
                const { username } = obj;
                requests.forEach((request) => {
                  if (request.requester === client) {
                    if (request.requstee === username) {
                      if (request.accepted) obj.friendState = "friends";
                      if (request.pending) obj.friendState = "pending response";
                      if (!request.pending && !request.accepted)
                        obj.friendState = "no request sent";
                    }
                  } else if (request.requester === username) {
                    if (request.requstee === client) {
                      if (request.accepted) {
                        obj.friendState = "friends";
                      }
                      if (request.pending)
                        obj.friendState = "pending your response";
                      if (!request.pending && request.accepted === 0)
                        obj.friendState = "no request sent";
                      
                    }
                  }
                });
              });
              this.setState({ usersSearched: users, showbackdrop: true });
            })

            .catch((err) => console.log(err));
        })
        .catch((err) => {
          this.setState({ usersSearched: [], showbackdrop: false });
        });
    }
  };
  sendRequest = (requestee) => {
    axios
      .post(
        `/athletes/sendRequest/${requestee}`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    this.searchUsers("updated");
  };
  acceptRequest = (username) => {
    axios
      .post(
        `/athletes/acceptRequest/${username}`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    this.searchUsers("updated");
  };
  findRequests = () => {
    axios
      .get("/athletes/getFriendRequests", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const requests = res.data;
        if (requests.length === 0) this.setState({ usersSearched: requests });
        requests.forEach((obj) => (obj.friendState = "pending your response"));
        this.setState({ usersSearched: requests });
      })
      .catch((err) => console.log(err));
    this.setState({ userSearch: "", showbackdrop: false });
  };
  handleReject = (requester) => {
    axios
      .post(
        `athletes/rejectRequest/${requester}`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    this.searchUsers("updated");
  };
  handleClubToggle = () => {
    this.setState({
      clubs: [],
      clubSearch: "",
      showClubCreate: !this.state.showClubCreate,
    });
  };
  handleClubCreateVal = (e) => {
    const value = e.target.value;
    this.setState({ clubCreateValue: value });
  };
  createClub = () => {
    const clubName = this.state.clubCreateValue;
    if(clubName.length > 50)return alert('Can only be 50 characters')
    if (!clubName || clubName.length === 0) return alert("Must have a name");
    axios
      .post(
        `clubs/createClub/${clubName}`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.response);
        if (!res) {
          alert("failed");
        }
        res.data.success === "Club Created"
          ? alert("Club Created")
          : alert("Club Exists");
        this.setState({ clubCreateValue: "" });
      })
      .catch((err) => console.log(err));
  };
  searchValue = (e) => {
    const value = e.target.value;
    this.setState({ clubSearch: value });
  };
  searchClubs = (e) => {
    if (e.keyCode === 13 || e === "updated") {
      const value = this.state.clubSearch;
      this.setState({ showClubCreate: false });
      axios
        .get(`/clubs/queryClubs/${value}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          let data;
          if (!res.data) data = [];
          data = res.data;
          return data;
        })
        .then((result) => {
          const clubs = result;
          axios
            .get("/clubs/checkIfFollow", {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              const clubsJoined = res.data;
              clubs.forEach((club) => {
              
                club.joined = false;
                clubsJoined.forEach((clubJoined) => {
                  
                  if (clubJoined.clubname === club.clubname) club.joined = true;
                });
              });
              this.setState({ clubs: clubs, showbackdrop: true });
            });
        })
        .catch((err) => {
          if (err) this.setState({ clubs: [], showbackdrop: false });
        });
    }
  };
  follow = (club) => {
    axios
      .post(
        `clubs/join/${club}`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    this.searchClubs("updated");
  };
  toggleBackDrop = () => {
    this.setState({
      clubs: [],
      clubSearch: "",
      userSearch: "",
      usersSearched: [],
      showbackdrop: false,
    });
  };
  toggleFilterPanel = () =>
    this.setState({ showFilterPanel: !this.state.showFilterPanel });
  render() {
    
    return (
      <React.Fragment>
        <Backdrop
          show={this.state.showbackdrop}
          clicked={this.toggleBackDrop}
        />
        <div className={classes.Intro}>
          <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
            <WelcomePLague privacy={this.setPrivacy}></WelcomePLague>
          </div>
        </div>

        <div className={classes.Page}>
          <div style={{ display: "flex", width: "100%" }}>
            <FriendSearch
              reject={this.handleReject}
              searchValue={this.state.userSearch}
              findRequests={this.findRequests}
              change={this.handleChange}
              onSubmit={this.searchUsers}
              users={this.state.usersSearched}
              click={this.sendRequest}
              clicked={this.acceptRequest}
            />
            <ClubSearch
              toggleClubCreate={this.handleClubToggle}
              showClubCreation={this.state.showClubCreate}
              changed={this.handleClubCreateVal}
              clubCreateValue={this.state.clubCreateValue}
              createClub={this.createClub}
              searchClubs={this.searchValue}
              searchValue={this.state.clubSearch}
              search={this.searchClubs}
              clubs={this.state.clubs}
              follow={this.follow}
            />
          </div>
          <ChallengesContainer click={this.toggleFilterPanel} />
          <div className={classes.ConCreateClub}>
            <div className={classes.CreateClubTop}>
              <p>CREATE A CLUB</p>
            </div>
            <p className={classes.Title}>Enter Club Name</p>
            <div style={{ paddingRight: "10%", paddingLeft: "10%" }}>
              <div style={{ display: "flex", width: "100%" }}>
                <TextField
                  id="standard-helperText"
                  helperText="Club Name"
                  fullWidth
                  onChange={this.handleClubCreateVal}
                  value={this.state.clubCreateValue}
                />
                <Plus
                  onClick={this.createClub}
                  className={classes.Plus}
                  title="create club"
                  className={classes.Plus}
                  style={{
                    width: "5%",
                    height: "auto",
                    color: "blue",
                    marginBottom: "2%",
                    position: "relative",
                    cursor: "pointer",
                    marginTop: "1%",
                  }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  pading: "5%",
                }}
              >
                <p>Instructions</p>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  componentDidMount() {
    axios
      .get("/athletes/self", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.setState({ user: res.data.username });
      })
      .catch((err) => console.log(err));
    axios
      .get("/challenges/single/joined", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => this.setState({ singleChallenges: res.data }))
      .catch((err) => console.log(err));
    axios
      .get("challenges/group/joined", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => this.setState({ cards: res.data }))
      .catch((err) => console.log(err));
  }
}
export default withRouter(Homepage);
