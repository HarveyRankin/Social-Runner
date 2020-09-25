import React, { useState } from "react";
import classes from "./completeChallenge.module.css";
import GpsDetails from "../RouteImage/routeImageandDetails";
import { Divider, Button, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Comments from "../../Ui/Icons/comments";
import Modal from "../../Hoc/Modal/modal";
import Backdrop from "../../Ui/Backdrop/backdrop";
import axios from "axios";
import CommentsCon from "../Comments/commentsCon";
import Tick from "../../Ui/Icons/tick";
import Modal2 from "../../Hoc/Modal2/Modal2";

const CompleteChallenge = (props) => {
  const [sliderState, setSliderState] = useState([]);
  const [showBackdrop, setBackdrop] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsState, setCommentState] = useState(false);
  const [challengeCommments, setComments] = useState([]);
  const [showImage, setImage] = useState(false);
  const [ModalOpen, setModal] = useState(false);

  console.log(props);
  const challengeData = {
    gpsRoute: true,
    time: props.challenge.runTime,
    elevationGain: props.challenge.elevation,
    gpsDistance: props.challenge.distance,
    pace: props.challenge.pace,
  };
  const valuetext = (value) => {
    return `${value}°C`;
  };
  const handleSlider = (value) => {
    setSliderState("");
    const sliderValue = value.target.getAttribute("aria-valuenow");
    const sliderArray = [...sliderState];
    sliderArray.push(sliderValue);
    setSliderState(sliderArray);
  };
  const handleComments = () => {
    //get comments
    axios
      .get(`/challenges/single/getComments/${props.challenge.id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setComments(res.data);
        setCommentState(true);
        setBackdrop(true);
      })
      .catch((err) => console.log(err));
  };
  const toggleBackdrop = () => {
    setBackdrop(false);
    setCommentState(false);
    setImage(false);
  };
  const handleComment = (e) => {
    const value = e.target.value;
    setComment(value);
  };
  const submitComment = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const data = {
      comment: comment,
      id: props.challenge.id,
      ts: timestamp,
    };
    axios
      .post("/challenges/single/addComment", data, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setComment("");
        setComments(res.data);
      })
      .catch((err) => console.log(err));
  };
  const handleSubmisson = () => {
    const arr = sliderState.filter((item) => typeof item === "string");
    const val = arr[arr.length - 1];
    const id = props.challenge.id;
    const challenge_id = props.challenge_id;
    const row = props.row;
    const col = props.col;
    const challengeSubCreator = props.challenge.username;
    axios
      .post(
        `/challenges/single/alterScore/${val}/${id}/${props.challenge.challenge_id}`,
        {
          row: row,
          col: col,
          card: props.card,
          challengeSubCreator: challengeSubCreator,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => props.succesful(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`/challenges/completedCheck/${challenge_id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        //console.log(res.data);
        const newReactedToo = { ...props.challengesReacted };
        res.data.forEach((element) => {
          newReactedToo[element.submission_id] = true;
        });
        //console.log(newReactedToo);
        props.updateReacted(newReactedToo);
      })
      .catch((err) => console.log(err));
  };
  const handleImageClick = () => {
    setImage(true);
    console.log("setting");
  };
  const photo = `data:image/jpeg;base64,${props.challenge.image}`;
  const datePosted = props.challenge.ts.split("T")[0];
  //console.log(sliderState);
  const CompleteObj = props.challengesReacted;
  //console.log(CompleteObj)
  //console.log(props.challenge.username, props.user);
  const closeModal = () => {
    setModal(false);
  };
  return (
    <React.Fragment>
      <Modal show={commentsState}>
        <CommentsCon
          change={handleComment}
          click={submitComment}
          comments={challengeCommments}
          value={comment}
        />
      </Modal>
      <Modal2 closeModal={closeModal} open={ModalOpen}>
        <div
          style={{
            backgroundColor: "white",
            width: "40%",
            fontFamily: "Crushed-regular",
            fontSize: "25px",
            maxHeight:"350px",
            padding:'2%',
            overflow:'auto'

          }}
        >
          <p>{props.challenge.subDescription}</p>
        </div>
      </Modal2>

      {showImage === true ? (
        <div onClick={() => setImage(false)} className={classes.Image}>
          <img className={classes.Content} src={photo} alt="image of runner" />
        </div>
      ) : null}

      <Backdrop show={showBackdrop} clicked={toggleBackdrop} />
      <div className={classes.ChallCon}>
        <div>
          <div style={{ backgroundColor: "#f8f8ff", maxWidth: "100%" }}>
            <div style={{ paddingLeft: "1%", paddingRight: "1%" }}>
              <div className={classes.TopCon}>
                {props.challenge.username === props.user && props.delete ? (
                  <div className={classes.Delete}>
                    <p onClick={() => props.delete(props.id)}>X</p>
                  </div>
                ) : null}

                <div style={{ width: "50%", borderRight: "1px black solid",overflow:'hidden' }}>
                  <h2 style={{ textAlign: "center", width: "100%" }}>
                    {props.challenge.subTitle}
                  </h2>
                </div>
                <h2 style={{ textAlign: "center", width: "50%" }}>
                  {props.challenge.username}
                </h2>
              </div>

              {props.challenge.routeMap !== "0" ? (
                <div style={{ width: "100%" }}>
                  <GpsDetails
                    challenge={challengeData}
                    gpsImage={props.challenge.routeMap}
                  />
                </div>
              ) : null}
              <div className={classes.Thirdrow}>
                {props.challenge.image !== "0" ? (
                  <div
                    style={{
                      padding: "1%",
                      marginLeft: "5%",
                      maxHeight: "150px",
                      marginTop: "1%",
                      maxWidth: "30%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      onClick={handleImageClick}
                      className={classes.PersonalImage}
                      src={photo}
                      alt="image of runner"
                    />
                  </div>
                ) : null}
                <div className={classes.Description}>
                  <div
                    onClick={() => setModal(true)}
                    className={classes.DescriptionBody}
                  >
                    {props.challenge.subDescription != '0' ?  <p>{props.challenge.subDescription}</p>:null}
                   
                  </div>
                </div>
              </div>
              <div className={classes.FourthRow}>
                <div className={classes.React}>
                  {!CompleteObj[props.challenge.id] ? (
                    <div>
                      {props.user !== props.challenge.username ? (
                        <div className={classes.Slider}>
                          {!props.expired ? (
                            <div style={{ display: "flex" }}>
                              <Typography
                                style={{ fontSize: "20px" }}
                                id="discrete-slider"
                              >
                                Rate Post
                              </Typography>
                              <Slider
                                onChange={handleSlider}
                                defaultValue={0}
                                getAriaValueText={valuetext}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={-1}
                                max={5}
                              />
                              <div
                                style={{
                                  marginBottom: "1%",
                                }}
                              >
                                <Button
                                  onClick={handleSubmisson}
                                  color="primary"
                                >
                                  confirm
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Tick
                        style={{
                          width: "10%",
                          height: "auto",
                          color: "green",
                          margin: "1%",
                        }}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      margin: "1%",
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <h4
                        className={classes.AllComments}
                        onClick={handleComments}
                        style={{
                          fontSize: "25`px",
                          fontFamily: "Crushed-Regular",
                          color: "rgb(114, 134, 248)",
                        }}
                      >
                        Comments
                      </h4>
                    </div>
                    <div style={{ width: "100%" }}>
                      <p
                        classname={classes.Score}
                        style={{
                          fontSize: "40px",
                          fontWeight: "bold",
                          textAlign: "right",
                          color: "rgb(114, 134, 248)",
                        }}
                      >
                        {props.challenge.score}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CompleteChallenge;

/**/
