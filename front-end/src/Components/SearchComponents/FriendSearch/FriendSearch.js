import React from "react";
import { TextField, Divider, Button } from "@material-ui/core";
import classes from "./FriendSearch.module.css";
import IndividualSearch from "./IndividualSearch";
//friend search bar
const FriendSearch = (props) => {
  let user;
  const { users } = props;
  const buttonExample = null;
  console.log(users);
  return (
    <div className={classes.Container}>
      <div className={classes.SearchBar}>
        <div
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#e5eaf5",
            display: "flex",
          }}
        >
          <div
            style={{
              backgroundColor: "rgb(241, 247, 248)",
              width: "100%",
              padding: "1%",
            }}
          >
            <TextField
              style={{ width: "100%" }}
              id="filled-search"
              label="Search for Friends"
              type="search"
              fullWidth
              onChange={props.change}
              onKeyDown={props.onSubmit}
              value={props.searchValue}
            />
          </div>
          <div
            style={{
              borderLeft: "1px solid blue",
              padding: "2%",
              width: "40%",
              boxShadow: "-15px 2px 18px -4px rgba(0,0,0,0.45)",
              backgroundColor: " #242426",
            }}
          >
            <Button color="secondary" onClick={() => props.onSubmit("updated")}>
              Search
            </Button>
          </div>
        </div>
        {users.length > 0 ? (
          <div className={classes.SearchBox}>
            {users.map((user, i) => {
              let color;
              if (i % 2 === 0) color = "rgba(200, 244, 253, 0.787)";
              color = "rgb(234, 250, 250)";
              return (
                <div className={classes.IndividualSearch}>
                  <IndividualSearch
                    color={color}
                    rejectClick={() => props.reject(user.username)}
                    clicked={() => props.clicked(user.username)}
                    username={user.username}
                    search={user.friendState}
                    click={() => props.click(user.username)}
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FriendSearch;
