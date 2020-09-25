import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, token, ...rest }) => (
  <Route
    {...rest} //check for valid token
    render={(props) => (token ? <Component {...props} /> : <Redirect to="/" />)}
  />
);

export default PrivateRoute;
