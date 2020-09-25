import React from "react";
import classes from "./navbar.module.css";
import FriendSearch from "../../SearchComponents/FriendSearch/FriendSearch";
//navbar 
const Navbar = (props) => {
  return (
    <nav className={classes.Navbar}>
      <ul className={classes.Navbarnav}>{props.children}</ul>
    </nav>
  );
};

export default Navbar;
