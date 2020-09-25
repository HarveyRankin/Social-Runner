import React from "react";
import classes from "./CardContainer.module.css";
import { Divider } from "@material-ui/core";
import Tick from "../../../../../Ui/Icons/tick";
import Cross from "../../../../../Ui/Icons/cross";

const CardContainer = ({ cards, click }) => {
  console.log(cards);
  const renderHeader = () => {
    let header = ["title", "creator", "club", "Joined", "challenges", "expiry"];
    const arr = header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
    return arr;
  };
  const renderData = () => {
    return cards.map((card, index) => {
      let style = "Odd";
      if (index % 2 == 0) style = "Even";
      let joined;
      card.joined
        ? (joined = (
            <Tick
              style={{
                width: "30%",
                height: "auto",
                color: "green",
                marginTop: "5%",
              }}
            />
          ))
        : (joined = (
            <Cross
              style={{
                width: "30%",
                height: "auto",
                color: "red",
                marginTop: "5%",
              }}
            />
          ));
      let endDate = card.end_date.split("T")[0];
      if (card.expired) endDate = <p style={{ color: "red" }}>Expired</p>;

      return (
        <tr
          className={classes[style]}
          key={index}
          onClick={() => click(card.id)}
        >
          <td style={{ overflow: "hidden" }}>{card.title}</td>
          <td>{card.creator}</td>
          <td>{card.club || <p>No Club</p>}</td>
          <td>{joined}</td>
          <td>{card["COUNT(c.challenge_id)"]}</td>
          <td style={{ color: "red" }}>{endDate}</td>
        </tr>
      );
    });
  };
  return (
    <div className={classes.TableWrapper}>
      <table className={classes.Table}>
        <tbody>
          <tr
            stlye={{
              position: "fixed",
              backgroundColor: "#242426",
              borderBottomLeftRadius: "50px",
              borderBottomRightRadius: "50px",
            }}
            className={classes.Header}
          >
            {renderHeader()}
          </tr>
          {renderData()}
        </tbody>
      </table>
    </div>
  );
};

export default CardContainer;

/*<div className={classes.Con}>
      {cards.map((card, index) => {
        const endDate = card.end_date.split("T")[0];
        let style;
        {
          index % 2 === 0 ? (style = "Even") : (style = "Odd");
        }
        return (
          <div className={classes[style]} onClick={() => click(card.id)}>
            <div>
              <p
                style={{
                  fontWeight: "bold",
                  color: "black",
                  fontSize: "20px",
                  padding: "20px",
                }}
              >
                {card.title}
              </p>
            </div>

            <div style={{ marginLeft: "auto", padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  marginRight: "50px",
                  justifyContent: "space-evenly",
                }}
              >
                <div style={{ marginRight: "10%" }}>
                  <p style={{ fontSize: "20px", fontWeight: "bold" }}>Club</p>
                  <p style={{ fontSize: "10px" }}>{card.club}</p>
                </div>
                <div style={{ marginRight: "10%" }}>
                  <p style={{ fontSize: "20px" }}>Creator</p>
                  <p style={{ fontSize: "10px", fontWeight: "bold" }}>
                    {card.creator}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "20px",
                    borderRight: "1px solid #47474d",
                    paddingRight: "5px",
                    color: "#47474d",
                    fontWeight: "bold",
                  }}
                >
                  challenges: {card["COUNT(c.challenge_id)"]}
                </p>
                {card.expired ? (
                  <p
                    style={{
                      fontSize: "20px",
                      color: "rgb(51, 9, 9)",
                      fontWeight: "bold",
                    }}
                  >
                    Expired
                  </p>
                ) : (
                  <div>
                    <p
                      style={{
                        fontSize: "20px",
                        color: "rgb(51, 9, 9)",
                        fontWeight: "bold",
                      }}
                    >
                      Expires
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        marginLeft: "5px",
                        color: "#47474d",
                        fontWeight: "bold",
                      }}
                    >
                      {endDate}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>*/
