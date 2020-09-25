import React from "react";
import classes from "./modal.module.css";

const Modal = (props) => {
  let width = "40%";
  let left = "30%";
  if (props.width) {
    width = "500px";
    left = "5%";
  }
  return (
    <div
      className={classes.Modal}
      style={{
        left: left,
        width: width,
        transform: props.show ? "translateY(0)" : "translateY(-100vh)",
        opacity: props.show ? "1" : "0",
      }}
    >
      {props.children}
    </div>
  );
};

export default Modal;
