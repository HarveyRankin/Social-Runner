import React, { useState, useEffect } from "react";
import classes from "./welcome.module.css";
import axios from "axios";
import { Divider } from "@material-ui/core";
import Home from "../../Ui/Icons/home";
import LinearProgress from "@material-ui/core/LinearProgress";
//welcome plague component
const WelcomePLague = (props) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(null);
  const [reputation, setReputation] = useState(0);
  useEffect(() => {
    setLoading(true);
    axios
      .get("/athletes/profile/personal", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.username) {
          setName(res.data.username);
          setLoading(false);
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get("/athletes/totalReputation", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setReputation(res.data.data));
    //make call to server to get user details '/athletes/profile/personal/:id
    //need the id
  }, []);
  let plague = null;
  if (loading) plague = <p>loading...</p>;
  if (!loading) {
    plague = (
      <div>
        <div className={classes.NameBox}>
          <p>{name}</p>
          <div className={classes.RepCon}>
            <div className={classes.Reputation}>
              <p>{reputation}</p>
            </div>
          </div>
        </div>

        {props.children}
      </div>
    );
  }

  return <div className={classes.Plague}>{plague}</div>;
};

export default WelcomePLague;
