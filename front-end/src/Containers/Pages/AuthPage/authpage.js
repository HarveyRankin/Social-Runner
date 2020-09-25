import React, { Component } from "react";
import Holder from "../../../Hoc/AuthHolder/holder";
import Login from "../../../Components/Login/login";
import RegisterForm from "../../Forms/RegisterForm/registerForm";
import ReactCardFlip from "react-card-flip";

//container holding all the authorisation components as login and register (public component)
class AuthPage extends Component {
  state = {
    username: "",
    password: "",
    LoginToggle: false,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  toggleLogin = () => {
    //toggle between login and register
    this.setState({ LoginToggle: !this.state.LoginToggle });
  };
  handleClick = () => {
    this.setState({ isFlipped: true });
  };
  render() {
	
    return (
<React.Fragment>
<div style={{marginTop:'10%',fontFamily:'Crushed Regular',fontSize:"30px"}}>
<p>This application is part of a user study</p>
<p>Please see the <a target="_blank"  style={{color:'blue'}} href="https://hr57.host.cs.st-andrews.ac.uk/participant-information-sheet.pdf">participation information sheet</a> prior to log in</p>
</div>
      <Holder>
        <ReactCardFlip
          isFlipped={this.state.LoginToggle}
          flipDirection="vertical"
        >
          <Login
            change={this.handleChange}
            nameValue={this.state.username}
            passValue={this.state.password}
            login={() =>
              this.props.login({
                username: this.state.username,
                password: this.state.password,
              })
            }
            register={this.toggleLogin}
            loginFail={this.props.loginFail}
          />
          

          <RegisterForm toggleLogin={this.toggleLogin} />
        </ReactCardFlip>
      </Holder>
</React.Fragment>
    );
  }
}

export default AuthPage;

