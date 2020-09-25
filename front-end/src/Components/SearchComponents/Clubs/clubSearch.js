import React from "react";
import { TextField, Divider, Button } from "@material-ui/core";
import classes from "./clubSearch.module.css";
import Plus from "../../../Ui/Icons/plus";
import IndividualClub from "./individualClub";
//club search bar
const ClubSearch = (props) => {
  return (
    <div className={classes.Container}>
      <div className={classes.Search}>
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
              label="Search for Clubs to join"
              type="search"
              fullWidth
              onChange={props.searchClubs}
              value={props.searchValue}
              onKeyDown={props.search}
            />
          </div>
          <div
            style={{
              padding: "2%",
              width: "40%",
              boxShadow: "-15px 2px 18px -4px rgba(0,0,0,0.45)",
              backgroundColor: "#242426",
            }}
          >
            <Button onClick={() => props.search("updated")} color="secondary">
              Search
            </Button>
          </div>
        </div>
        {props.showClubCreation ? (
          <div className={classes.CreateClub}>
            <div
              style={{
                backgroundColor: "white",
                boxShadow: "1px 6px 18px 0px rgba(0,0,0,0.45)",
                position: "relative",
                zIndex: "9999",
              }}
            >
              <div style={{ display: "flex", padding: "3%" }}>
                <TextField
                  style={{ height: "100%" }}
                  id="filled-search"
                  label="Create Club"
                  type="search"
                  variant="filled"
                  fullWidth
                  onChange={props.changed}
                  value={props.clubCreateValue}
                />
                <div style={{ width: "34%", marginLeft: "auto" }}>
                  <Plus
                    onClick={props.createClub}
                    title="create club"
                    className={classes.Plus}
                    style={{
                      color: "blue",
                      width: "auto",
                      height: "80%",
                      left: "78%",
                      position: "absolute",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {props.clubs.length > 0 ? (
          <div className={classes.SearchBox}>
            {props.clubs.map((club) => {
              return (
                <IndividualClub
                  follow={() => props.follow(club.clubname)}
                  club={club.clubname}
                  joined={club.joined}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ClubSearch;
