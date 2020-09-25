import React from "react";
import classes from "./holder.module.css";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { withRouter } from "react-router-dom";

const AuthHolder = (props) => {
  return (
    <ReactCSSTransitionGroup
      transitionAppear={true}
      transitionAppearTimeout={600}
      transitionEnterTimeout={600}
      transitionLeaveTimeout={200}
      transitionName="SlideIn"
    >
      <div className={classes.Holder}>
        <div>{props.children}</div>
      </div>
    </ReactCSSTransitionGroup>
  );
};

export default withRouter(AuthHolder);
