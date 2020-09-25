import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import classes from "./drawerSide.module.css";
import { withRouter } from "react-router-dom";

const DrawerSide = (props) => {
  return (
    <div className={classes.Create}>
      <Button
        onClick={() => {
          props.history.push("/challengeBuilder");
        }}
      >
        Create
      </Button>
    </div>
  );
};

export default withRouter(DrawerSide);
