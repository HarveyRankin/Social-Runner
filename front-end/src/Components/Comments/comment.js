import React from "react";
import classes from "./comment.module.css";
import { Divider } from "@material-ui/core";

const Comment = (props) => {
  return (
    <div className={classes.CommentCon}>
      <Divider />
      <p
        style={{
          textAlign: "left",
          fontSize: "20px",
          color: "rgb(114, 134, 248)",
        }}
      >
        {props.user}
      </p>
      <div className={classes.TextCon}>{props.comment}</div>
      <Divider />
    </div>
  );
};

export default Comment;
