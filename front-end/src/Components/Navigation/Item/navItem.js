import React, { Component } from "react";
import classes from "./navItem.module.css";

class NavItem extends Component {
  state = {
    open: false,
  };
  setOpen = () => {
    this.setState({ open: !this.state.open });
  };
  render() {
    console.log(this.props);
    return (
      <li className={classes.NavItem}>
        <a href="#" className={classes.Icon} onClick={this.props.clicked}>
          {this.props.number}
          {this.props.icon}
        </a>
        {this.state.open ? this.props.children : null}
      </li>
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.change !== this.props.change)
      this.setState({ open: !this.state.open });
  }
}

export default NavItem;
