import React from "react";
import { TextField, Button } from "@material-ui/core";
import classes from "./commentsCon.module.css";
import Comment from "./comment";
//comments container component
const CommentsCon = (props) => {
  const comments = props.comments;
 
  return (
    <div className={classes.Comment}>
      <div
        style={{ display: "flex", justifyContent: "center", fontSize: "30px" }}
      >
        <h2>COMMENTS</h2>
      </div>
      <div className={classes.Container}>
        {comments.map((comment) => {
          return <Comment user={comment.commenter} comment={comment.comment} />;
        })}
      </div>
      <TextField
        id="outlined-multiline-static"
        label="Comment on Post"
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        onChange={props.change}
        style={{ marginTop: "20px" }}
        value={props.value}
      />
      <div style={{ display: "flex", justifyContent: "center", margin: "3%" }}>
        <Button onClick={props.click} color="primary" variant="contained">
          Submit Comment
        </Button>
      </div>
    </div>
  );
};

export default CommentsCon;
