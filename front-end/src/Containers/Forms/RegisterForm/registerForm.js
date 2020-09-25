import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import classes from "./registerForm.module.css";
import axios from "axios";

//Register account form with own state

class RegisterForm extends Component {
  state = {
    username: "",
    usernameIsValid: false,
    password: "",
    passwordIsValid: false,
    rePassword: "",
    rePasswordIsValid: false,
    email: "",
    emailIsValid: false,
    canSubmit: null,
    clicked: false,
    selectedFile: null,
    fileIsValid: false,
  };
  validator = (input) => {
    //validate the register inputs prior to ensure user adds correct data
    if (input === "username") {
      if (this.state.username.length < 3) {
        this.setState({ usernameIsValid: false });
      } else {
        this.setState({ usernameIsValid: true });
      }
    }
    if (input === "email") {
      if (!this.state.email.includes("@")) {
        this.setState({ emailIsValid: false });
      } else {
        this.setState({ emailIsValid: true });
      }
    }
    if (input === "password") {
      if (this.state.password.length < 8) {
        this.setState({ passwordIsValid: false });
      } else {
        this.setState({ passwordIsValid: true });
      }
    }
    if (input === "rePassword") {
      const { password, rePassword } = this.state;
      if (rePassword !== password) {
        this.setState({ rePasswordIsValid: false });
      } else {
        this.setState({ rePasswordIsValid: true });
      } //need to fix this
    }
  };
  handleUsername = (e) => {
    //set the username
    this.setState({ username: e.target.value });
    //validate the input
    this.validator("username");
  };
  handleEmail = (e) => {
    //set email
    this.setState({ email: e.target.value });
    this.validator("email");
  };
  handlePassword = (e) => {
    //set password
    this.setState({ password: e.target.value });
    this.validator("password");
  };
  handleRePassword = (e) => {
    //set second password
    this.setState({ rePassword: e.target.value });
  };
  onSubmit = (e) => {
    //prevent from refreshing the form
    e.preventDefault();
    const { password, rePassword } = this.state;
    //check all inputs are valid
    if (
      this.state.usernameIsValid === true &&
      this.state.passwordIsValid === true &&
      this.state.emailIsValid === true &&
      password === rePassword
    ) {
      //create the user object to send to the server
      const user = {
        username: this.state.username,
        email: this.state.email,
        password: btoa(this.state.password),
      };
      //post to the server
      axios
        .post("/register", user)
        .then((res) => {
          if (res.data.name === "error") {
            alert(res.data.detail);
          } else {
            alert("Register succesful");
            this.props.toggleLogin();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //alert if not all are valid
      alert("Please ensure the Password is the same");
    }
  };
  handleFile = (e) => {
    this.setState({ selectedFile: e.target.files[0] });
  };
  render() {
    return (
      <div className={classes.Register}>
        <form onSubmit={this.onSubmit} encType="multipart/form-data">
          <h2>Register</h2>
          <TextField
            id="outlined-basic1"
            type="text"
            onChange={this.handleUsername}
            placeholder="Username"
            name="usertxt"
            error={!this.state.usernameIsValid}
            helperText={
              this.state.usernameIsValid ? null : "Please Enter a Username"
            }
            required
          />
          <br />
          <TextField
            id="outlined-basic2"
            type="email"
            onChange={this.handleEmail}
            placeholder="Email"
            name="emailtxt"
            error={!this.state.emailIsValid}
            helperText={this.state.emailIsValid ? null : "must include @"}
            required
          />
          <br />
          <TextField
            id="outlined-basic3"
            type="password"
            onChange={this.handlePassword}
            placeholder="Password"
            name="passtxt"
            required
          />
          <br />
          <TextField
            id="outlined-basic4"
            type="password"
            onChange={this.handleRePassword}
            placeholder="re-submit Password"
            name="re-submitPswd"
            required
          />
          <br />
          <button>submit</button>
        </form>
        <button onClick={this.props.toggleLogin}>Back to Login</button>
      </div>
    );
  }
}

export default RegisterForm;


