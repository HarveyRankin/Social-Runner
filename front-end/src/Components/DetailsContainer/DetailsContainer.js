import React from "react";
import classes from "./DetailsContainer.module.css";
import { Button } from "@material-ui/core";

const DetailsContainer = (props) => {
  return (
    <div className={classes.Con}>
      <div className={classes.Header}>
        <p>{props.title}</p>
      </div>
      <div className={classes.Body}>
        <div className={classes.Background}>
          {props.names.length === 0 ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgb(88, 85, 85)",
                color: "white",
                paddingTop: "1%",

                fontWeight: "bold",
              }}
            >
              <p>
                No {props.title} {":("}
              </p>
            </div>
          ) : (
            <div>
              {props.names.map((obj, i) => {
                let style = "Odd";
                if (i % 2 === 0) style = "Even";

                return (
                  <div className={classes[style]} style={{ display: "flex" }}>
                    <div style={{ maxWidth: "200px", overflow: "hidden" }}>
                      <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {obj.username}
                      </p>
                    </div>
                    <Button
                      style={{
                        width: "50px",
                        fontSize: "10px",
                        marginLeft: "auto",
                        marginRight: "10px",
                      }}
                      color="secondary"
                      onClick={() => props.click(obj.username, obj.id)}
                    >
                      {props.actions}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsContainer;
