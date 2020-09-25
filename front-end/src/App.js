import React, { Component } from "react";
import BingBuilder from "./Containers/Pages/BingoBuilder/bingBuilder";
import HomePage from "./Containers/Pages/HomePage/hompage";
import Layout from "./Containers/Layout/layout";
import AuthPage from "./Containers/Pages/AuthPage/authpage";
import { Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import axios from "axios";
import PrivateRoute from "./Routes/privateRoute";
import challenge from "./Containers/Pages/ChallengePage/challengePage";
import CardPage from "./Containers/Pages/CardPage/CardPage";

class App extends Component {
  //set the application state for login process
  state = {
    loggedIn: false,
    loginFail: false,
    registering: false,
  };
  viewProfile = () => {
    this.props.history.push("/profile");
  };
  loginUser = (userDetails) => {
    //method to log the user in - set the key in the localstorage for use around the application
    const { username, password } = userDetails;
    axios
      .get(`/login/${username},${btoa(password)}`)
      .then((response) => {
        if (response.status === 200) {
         //if succesful it sets the local storage with token and state
          //set the states
          localStorage.setItem("token", response.data.token);
          this.setState({ loggedIn: true });
          this.setState({ loginFail: false });
          alert("login succesful");
          //set the user key in the local storage
          //push to dashboard after login
          this.props.history.push("/homepage"); //change this to a daashboard
        } else {
          //else set it to fail
          this.setState({ loginFail: true });
        }
      })
      .catch((err) => {
        //catch any error and set loginFail to true - to set message
        console.log(err);
        this.setState({ loginFail: true });
      });

    //need to change the state based on this
  };
  logoutUser = () => {
    //need to create a logout that deletes the user from the local storage
    localStorage.clear();
    this.setState({ loggedIn: false, loginFail: false });
    //pushes the user back to the login page
    //and sets the logged in state to false to remove the nav bar from the login page
  };
  createChallenge = () => {
    this.props.history.push("/bingoBuilder");
  };
  render() {
    //console.log(this.state.loggedIn);
    return (
      <div className="App">
        <header className="Practice">
          <Layout
            logout={this.logoutUser}
            loggedIn={this.state.loggedIn}
            profile={this.viewProfile}
            challengeBingo={this.createChallenge}
          >
            <Switch location={this.props.location}>
              <Route
                path="/"
                exact
                component={() => (
                  <AuthPage
                    login={this.loginUser}
                    loginFail={this.state.loginFail}
                    username={this.state.userName}
                    password={this.state.password}
                  />
                )}
              >
                {this.state.loggedIn ? <Redirect to="/homepage" /> : null}
              </Route>
              <PrivateRoute
                token={this.state.loggedIn}
                path="/challengeBuilder"
                exact
                component={BingBuilder}
              />
              <PrivateRoute
                token={this.state.loggedIn}
                path="/homepage"
                exact
                component={HomePage}
              />
              <PrivateRoute
                token={this.state.loggedIn}
                exact
                path="/challenge/:type/:id"
                exact
                component={withRouter(challenge)}
              />
              <PrivateRoute
                token={this.state.loggedIn}
                path="/card/:id"
                exact
                component={CardPage}
              />
            </Switch>
          </Layout>
        </header>
      </div>
    );
  }
  componentDidMount = () => {
    //this runs to check they are logged in, if it is true, they will remain on the homepage
    const token = {
      token: localStorage.token,
    };
    axios
      .post("/authcheck/me", token)
      .then((res) => this.setState({ loggedIn: true }))
      .catch((err) => {
        if (window.location.href != `https://hr57.host.cs.st-andrews.ac.uk/`) {
          //alert("Token Expired, please login again");
          this.logoutUser();
        }
      });
  };
}

export default withRouter(App);
