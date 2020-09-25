import React from "react";
import classes from "./login.module.css";
import Input from "../../Ui/Input/input";
import Button from "@material-ui/core/Button";

const Login = (props) => {
  //sets the login button to true
  const enabled = props.nameValue.length > 0 && props.passValue.length > 0;

  return (
    <div className={classes.Login}>
      <div className={classes.Input}>
        <div>
          <Input
            className={classes.Input}
            type="text"
            name="username"
            placeholder="Username"
            change={props.change}
          />
          <label for="username"></label>
        </div>
        <br />
        <div>
          <Input
            className={classes.Input}
            type="password"
            name="password"
            placeholder="password"
            change={props.change}
          />
          <label for="password"></label>
        </div>
      </div>
      <br />
      {props.loginFail ? <p>Please try again</p> : null}
      <div className={classes.Button}>
        <Button
          style={{ textAlign: "center", margin: " 30px auto" }}
          variant="contained"
          disabled={!enabled}
          color="primary"
          onClick={props.login}
        >
          Login
        </Button>
      </div>
      <br /
      >
 
    </div>
  );
};

export default Login;

//can change this to a class and add the login methods to this - add to local storage etc
//
//<p>Dont have an account?</p>
//<p onClick={props.register} className={classes.RegisterText}>
//Register now
//</p>