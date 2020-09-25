import React,{useState} from "react";
import classes from "./CardView.module.css";
import IndividualView from "./individualView/IndiviudalView";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal2 from "../../Hoc/Modal2/Modal2";

const CardView = (props) => {
  console.log(props);
  const [showDescription,setDescription] = useState(false)
  const challengesLoading = props.challengesLoading;
  return (
    <div>
      <React.Fragment>
        <Modal2 closeModal={()=> setDescription(false)} open={showDescription}>
          <div className={classes.ModalDescription}>
            {props.description}
          </div>
        </Modal2>
        <div
          className={classes.Card}
          style={{ paddingBottom: "1%", paddingLeft: "1%", paddingRight: "1%" }}
        >
          <div>
            <p
              className={classes.Text}
              style={{
                paddingTop: "5%",
                paddingLeft: "5%",
                paddingRight: "5%",
                paddingBottom: "1%",
                fontSize: "100px",
                fontWeight: "bold",
                color: "rgb(114, 134, 248)",
              }}
            >
              RUNNING BINGO
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                marginBottom: "2%",
              }}
            >
              <div className={classes.TitleContainer}>
              <p
                className={classes.Text}
                style={{
                  fontSize: "50px",
                  fontWeight: "bold",
                  overflow:'hidden',
                  color: "rgb(114, 134, 248)",
                }}
              >
                {props.bingoTitle}
              </p>
              </div>
              <p
                className={classes.Text}
                style={{
                  fontSize: "50px",
                  fontWeight: "bold",
                  color: "rgb(114, 134, 248)",
                }}
              >
                {props.bingoDate}
              </p>
            </div>
          </div>
          <div
            style={{
              overflow: "auto",
              height: "100%",
              width: "100%",
              margin: "auto",
              textAlign: "center",
            }}
          >
         
            <table className={classes.Table}>
              <tbody>
                {props.challenges.map((row, i) => (
                  <tr key={i}>
                    {row.map((challenge, j) => (
                      <td key={j}>
                        {
                          <IndividualView
                            complete={challenge.complete}
                            click={() => props.click(i, j)}
                            title={challenge.challenge_title}
                            description={challenge.challenge_description}
                          />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={classes.DescriptionCon}>
            <p onClick={()=> setDescription(true)}>Card Description</p>
            </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default CardView;
