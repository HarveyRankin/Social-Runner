import React, { Component } from "react";
import Navbar from "../../Components/Navigation/NavBar/navbar";
import NavItem from "../../Components/Navigation/Item/navItem";
import DropDown from "../../Components/Navigation/DropDownMenu/dropDown";
import DropdownItem from "../../Components/Navigation/DropDownItem/dropdownitem";
import classes from "./layout.module.css";
import Menu from "../../Ui/Menu/menu";
import Drawer from "../../Ui/Drawer/DrawerSide";
import HomeIcon from "../../Ui/Icons/bell";
import Person from "../../Ui/Icons/cog";
import Logo from "../../Components/Navigation/Item/logo";
import MainMenu from "../../Ui/Icons/home";
import axios from "axios";
import FriendSearch from "../../Components/SearchComponents/FriendSearch/FriendSearch";
import Cross from "../../Ui/Icons/cross";
import Backdrop from "../../Ui/Backdrop/backdrop";
import DetailsContainer from "../../Components/DetailsContainer/DetailsContainer";
import { Button, Input, Select } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Tick from "../../Ui/Icons/tick";
import SnackBar from "../../Ui/Notificationss/SnackBar";

//Need to add a backdrop

class Layout extends Component {
  state = {
    friendRequests: [], //friendrequests container
    userSearch: "testing", 
    usersSearched: [],
    showPanel: false,
    showBackdrop: false,
    friends: [],
    clubs: [],
    UserChallenges: [],
    challengesType: "single",
    challengeTypeNavigation: "Challenge Page",
    notifications: false,
    usersSearched: [],
  };
  logout = () => {
    this.setState({ showPanel: false, showBackdrop: false });
    this.props.logout(); //logout function password passed from App
  };
  toggleNotifications = (flag) => {
    //the flag indicates where the click is coming from - clicked means it is coming from the bell button
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

        if (flag === "clicked") {
          //notifications toggles the dropdown
          this.setState({
            usersSearched: requests,
            notifications: !this.state.notifications,
          });
        } else {
          this.setState({ usersSearched: requests });
        }
      })
      .catch((err) => console.log(err));
  };
  togglePanel = () => {
    axios
      .get("/athletes/friends", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        
        let friends;
        if (!res.data || res.data.length === 0) {
          friends = res.data;
        } else {
          friends = res.data;
        }
        axios
          .get("/athletes/clubs", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((result) => {
            let usernames;
            if (!result.data || result.data.length === 0) {
              usernames = [];
            } else {
              usernames = result.data;
            }
            this.setState({
              showPanel: !this.state.showPanel,
              showBackdrop: !this.state.showBackdrop,
              friends: friends,
              clubs: usernames,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    axios
      .get("/challenges/single/userCreated", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({ UserChallenges: res.data });
      })
      .catch((err) => console.log(err));
  };
  handleRemoveFriend = (friend) => {
    axios
      .post(
        "/athletes/friends/unfollow",
        {
          friend: friend,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const friends = res.data;
        this.setState({ friends: friends });
      });
  };
  handleClubUnfollow = (club) => {
    axios
      .post(
        "athletes/club/unfollow",
        {
          club: club,
        },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
       
        const clubs = res.data;
        this.setState({ clubs: clubs });
      });
  };
  toChallengePage = (name, id) => {
    this.setState({ showPanel: false, showBackdrop: false });
    //this function will send to either single bing challenge page depending on the challengeType state
    if (this.state.challengesType === "single") {
      this.props.history.push(`/challenge/single/${id}`);
    } else {
      this.props.history.push(`/card/${id}`);
    }
  };
  changeChallengeType = (e) => {
    const value = e.target.value;
    if (value === "single") {
      axios
        .get("/challenges/single/userCreated", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.setState({
            UserChallenges: res.data,
            challengeTypeNavigation: "Challenge Page",
          });
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .get("/challenges/group/userCreated", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          let challenges;
          if (!res.data || res.data.length === 0) {
            challenges = [];
          } else {
            challenges = res.data;
          }
          this.setState({
            UserChallenges: challenges,
            challengeTypeNavigation: "Card Page",
          });
        })
        .catch((err) => console.log(err));
    }

    this.setState({ challengesType: value });
  };
  rejectRequest = (requester) => {
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
      .then((res) => this.toggleNotifications("not_clicked"))
      .catch((err) => console.log(err));
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
      .then((res) => this.toggleNotifications("not_clicked"))
      .catch((err) => console.log(err));
  };
  getRequestsPoll = () => {
    //polling for friend requests 
    setTimeout(() => {
      axios
        .get("/athletes/getFriendRequests", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const requests = res.data;
        
          if (requests.length === 0 && this.state.usersSearched.length !== 0){
        
            return this.setState({ usersSearched: requests });
          }
          
          requests.forEach(
            (obj) => (obj.friendState = "pending your response")
          );
          if (this.state.usersSearched !== requests)
         
            this.setState({ usersSearched: requests });
          this.getRequestsPoll();
        });
    }, 5000);
  };

  render() {
    let test = (
      //this sets the friends request drop down in navbar
      <p style={{ fontSize: "30px", color: "white", fontWeight: "bold" }}>
        No Friend Requests
      </p>
    );
    if (this.state.usersSearched.length > 0) {
      test = this.state.usersSearched.map((user) => {
        return (
          <DropdownItem>
            {user.username}
            <div style={{ marginLeft: "auto" }}>
              <Tick
                onClick={() => this.acceptRequest(user.username)}
                className={classes.Tick}
                style={{ color: "green" }}
              />
              <Cross
                onClick={() => this.rejectRequest(user.username)}
                className={classes.Cross1}
                style={{ color: "red" }}
              />
            </div>
          </DropdownItem>
        );
      });
    }
    let NotificationsBackDrop = null;
    if (this.state.notifications) {
      NotificationsBackDrop = (
        <div
          onClick={() => this.setState({ notifications: false })}
          className={classes.Notification}
        ></div>
      );
    }
    //the loggedIn? is a conditional to check if it needs a nav bar or not depending on log-in state
    return (
      <React.Fragment>
        <SnackBar notifications={this.state.usersSearched}/>
        <Backdrop show={this.state.showBackdrop} clicked={this.togglePanel} />
        {NotificationsBackDrop}
        {this.props.loggedIn ? (
          <Navbar
            handleReject={this.handleReject}
            userSearch={this.state.userSearch}
            findRequests={this.findRequests}
            handleChange={this.handleChange}
            searchUsers={this.searchUsers}
            usersSearched={this.state.usersSearched}
            sendRequest={this.sendRequest}
            acceptRequest={this.acceptRequest}
            className={classes.Navbar}
          >
            <Drawer />

            <NavItem
              icon={
                <HomeIcon
                  className={classes.Home}
                  style={{ width: 40, height: 40, marginTop: 5 }}
                />
              }
              number={
                <div>
                  {this.state.usersSearched.length !== 0 ? (
                    <div className={classes.Number}>
                      <p>{this.state.usersSearched.length}</p>
                    </div>
                  ) : null}
                </div>
              }
              clicked={() => this.toggleNotifications("clicked")}
              change={this.state.notifications}
            >
              <DropDown>{test}</DropDown>
            </NavItem>

            <NavItem
              clicked={this.togglePanel}
              icon={
                <Person
                  style={{ width: 40, height: 40, marginTop: 5, marginLeft: 5 }}
                />
              }
            ></NavItem>
            <Logo
              icon={
                <MainMenu style={{ width: 60, height: 60, marginTop: 7 }} />
              }
            />
          </Navbar>
        ) : null}
        {this.state.showPanel ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              width: "70%",
              paddingLeft: "1%",
              paddingRight: "2%",
              backgroundColor: "rgba(28, 28, 62, 0.8)",
              top: "0",
              bottom: "0",
              right: "-10px",
              zIndex: "9995",
              transition: "3000ms left cubic-bezier(0.77, 0, 0.175, 1)",
              OverflowX: "hidden",
              boxShadow: "10px 4px 15px 1px rgba(0,0,0,0.78)",
              border: "1px solid black",
              overflow: "auto",
            }}
          >
            <Cross
              onClick={this.togglePanel}
              className={classes.Cross}
              style={{ width: "5%", height: "auto" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {this.state.friends ? (
                <DetailsContainer
                  title="Friends Added"
                  click={this.handleRemoveFriend}
                  actions="Unfollow"
                  names={this.state.friends}
                />
              ) : null}
              {this.state.clubs ? (
                <DetailsContainer
                  title="Clubs Joined"
                  click={this.handleClubUnfollow}
                  actions="unFollow"
                  names={this.state.clubs}
                />
           ) : null}
            </div>

 <DetailsContainer
              title={"CHALLENGES CREATED"}
              click={this.toChallengePage}
              actions={this.state.challengeTypeNavigation}
              names={this.state.UserChallenges}
            />
            <div
              style={{
                backgroundColor: " #242426 ",
                width: "100%",
                height: "50px",
                paddingTop: "1%",
                paddingBottom: "1%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FormControl component="fieldset">
                  <RadioGroup
                    value={this.state.challengesType}
                    onChange={this.changeChallengeType}
                    row
                  >
                    <FormControlLabel
                      value="single"
                      control={<Radio />}
                      label="Single"
                    />
                    <FormControlLabel
                      value="bingo"
                      control={<Radio />}
                      label="Bingo"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>             

            <div>
              <Button
                style={{ position: "absolute", bottom: "5%" }}
                color="secondary"
                variant="contained"
                onClick={this.logout}
              >
                Logout
              </Button>
            </div>
          </div>
        ) : null}
        <main id="main" className={classes.Main}>
          {this.props.children}
        </main>
      </React.Fragment>
    );
  }
  componentDidMount() {
    //gets all data to populate the nav bar
    this.getRequestsPoll();
  }
}

export default withRouter(Layout);

//
