import React, { Component } from "react";
import classes from "./challengeCompletionInput.module.css";
import TextField from "@material-ui/core/TextField";
import Input from "../../../Ui/Input/input";
import { Button, Divider } from "@material-ui/core";
import axios from "axios";
import Modal from "../../../Hoc/Modal/modal";
import Backdrop from "../../../Ui/Backdrop/backdrop";
import RouteImageAndDetails from "../../RouteImage/routeImageandDetails";
//preview 
class ChallengeCompletionInput extends Component {
  state = {
    error: null,
    title: null,
    titleError: null,
    description: "",
    time: null,
    elevationGain: null,
    pace: null,
    gps: null,
    gpsError: "GPS must be gpx format",
    photo: null,
    photoError: "Image must be jpg format",
    loading: null,
    previewClicked: null,
    image: null,
    gpsRoute: false,
    gpsDistance: false,
    showBackdrop: false,
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const obj = { ...this.state };
    obj[name] = value;
    this.setState(obj);
  };
  submitChallenge = (e) => {
  
    e.preventDefault();
    const data = {
      title: this.state.title,
      description: this.state.description,
      time: this.state.time,
      elevationGain: this.state.elevationGain,
      pace: this.state.pace,
      personImage: this.state.image,
      gpsRoute: this.state.gpsRoute,
      distance: this.state.gpsDistance,
      challenge_id: this.props.challenge.challenge_id,
    };

    axios
      .post("/challenges/single/submission", data, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);

        this.props.succesful(res.data);
        Array.isArray(res.data)
          ? this.setState({ showBackdrop: !this.state.showBackdrop })
          : alert(res.data.data);
      })
      .catch((err) => console.log(err));
    //validation function here
  };
  handleFile = (e) => {
    //add file to the state
    const name = e.target.name;
    const value = e.target.files[0];
    const obj = { ...this.state };
    obj[name] = value;
    this.setState(obj);
  };
  //this.setState({image:res.data.photo,gpsRoute: res.data.routeObj.route,gpsDistance:res.data.routeObj.distance}
  handlePreviewClick = () => {
    const error = clientSideVerification(this.props.challenge, this.state);
    if (error) {
      this.setState({ error: error });
      return;
    }
    this.setState({ error: null }); //remove the error if no errors found
    const formData = new FormData();
    //only append if it is added
    if (this.state.gps) {
      formData.append("gps", this.state.gps);
    }
    if (this.state.photo) {
      formData.append("photo", this.state.photo);
    }
    axios
      .post("/challenges/preview", formData, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({
          image: res.data.photo,
          gpsRoute: res.data.routeObj.route,
          gpsDistance: res.data.routeObj.distance,
          time: res.data.routeObj.time,
          elevationGain: res.data.routeObj.elevationGain,
          pace: res.data.routeObj.pace,
        });
      })
      .then((res) => this.setState({ showBackdrop: true }))
      .catch((err) => console.log(err));
    this.setState({ previewClicked: true });
    //send the data to the backend to format and validate
  };
  toggleBackdrop = () => {
    this.setState({ showBackdrop: !this.state.showBackdrop });
  };
  render() {
    const challenge = this.props.challenge;

    let photo = null;
    if (this.state.image) {
      photo = `data:image/jpeg;base64,${this.state.image}`;
    }
    let gpsImage = null;

    return (
      <React.Fragment>
        <Modal width={true} show={this.state.showBackdrop}>
          <div className={classes.ModalView}>
            <div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  fontFamily: "Crushed-regular",
                  fontSize: "20px",
                }}
              >
                <h3>{this.state.title}</h3>
              </div>
              <div
                style={{
                  width: "100%",
                  borderTop: "1px solid black",
                  borderBottom: "1px solid black",
                  paddingBottom: "1%",
                  fontSize: "20px",
                  fontFamily: "Crushed-regular",
                }}
              >
                {this.state.description}
              </div>

              {this.state.image ? (
                <div
                  style={{
                    marginLeft: "auto",
                    padding: "1%",
                  }}
                >
                  <img
                    className={classes.Image}
                    style={{
                      marginLeft: "auto",
                      width: "30%",
                      height: "auto",
                      textAlign: "center",
                    }}
                    src={photo}
                  />
                </div>
              ) : null}
            </div>
            {this.state.gps ? (
              <RouteImageAndDetails
                challenge={this.state}
                photo={photo}
                gpsImage={this.state.gpsRoute}
              />
            ) : null}
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", margin: "1%" }}
          >
            <Button
              style={{ margin: "1%" }}
              variant="contained"
              onClick={this.submitChallenge}
              color="primary"
            >
              Submit challenge
            </Button>
          </div>
        </Modal>
        <Backdrop
          style={{ zIndex: "9999" }}
          show={this.state.showBackdrop}
          clicked={this.toggleBackdrop}
        />
        <form className={classes.CompletionCon} onSubmit={this.submitChallenge}>
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h4
                style={{
                  fontWeight: "bold",
                  fontSize: "30px",
                  textAlign: "center",
                  paddingRight: "1%",
                }}
              >
                Enter a Title
              </h4>
              <TextField
                onChange={this.handleChange}
                id="standard-full-width"
                name="title"
                style={{ marginTop: 40, width: "70%" }}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <p style={{ fontWeight: "bold", fontSize: "30px", padding: 0 }}>
              Description
            </p>
            <TextField
              onChange={this.handleChange}
              id="outlined-multiline-static"
              required={challenge.user_description}
              multiline
              rows={3}
              fullWidth
              name="description"
              placeholder="How was it?"
              variant="outlined"
            />
            <div className={classes.File}>
              <div>
                <p style={{ color: "rgb(114, 134, 248)" }}>
                  <b>Upload GPS</b>
                </p>
                <Input
                  type="file"
                  name="gps"
                  required={challenge.gps}
                  change={this.handleFile}
                  placeholder="Upload GPS"
                  accept=".gpx"
                  style={{ margin: 20, padding: 20 }}
                ></Input>
                {this.state.gpsError ? (
                  <div className={classes.Error}>
                    <p>{this.state.gpsError}</p>
                  </div>
                ) : null}
              </div>
              <div>
                <p style={{ color: "rgb(114, 134, 248)" }}>
                  <b>Upload image</b>
                </p>
                <Input
                  type="file"
                  name="photo"
                  required={challenge.photo}
                  change={this.handleFile}
                  placeholder="Upload photo"
                  accept=".jpg"
                  style={{ margin: 20 }}
                />
                {this.state.photoError ? (
                  <div className={classes.Error}>
                    <p>{this.state.photoError}</p>
                  </div>
                ) : null}
              </div>
            </div>
            <Divider />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={this.handlePreviewClick}
                style={{ margin: 20 }}
                color="primary"
                variant="contained"
              >
                Preview
              </Button>
            </div>
          </div>
          {this.state.error ? (
            <h3 style={{ color: "red", textAlign: "center", fontSize: "30px" }}>
              {this.state.error}
            </h3>
          ) : null}
        </form>
      </React.Fragment>
    );
  }
}

export default ChallengeCompletionInput;

const clientSideVerification = (rules, currentState) => {
  if (!currentState.title) return "Submission needs a title";
  if(currentState.title.length > 50)return "Title must be less than 50 characters"
  if (!currentState.description && rules.user_description)
    return "Submission must have a description";
  if (!currentState.gps && rules.gps) return "Submission requires a gps upload";
  if (!currentState.photo && rules.photo)
    return "Submission requires an image to validate challenge completion";

  if (currentState.gps) {
    if (currentState.gps.name.split(".")[1] !== "gpx")
      return "GPS must be a gpx file";
  }
  if (currentState.photo) {
    if (currentState.photo.name.split(".")[1] !== "jpg")
      return "Image must be a jpg";
  }
  return false;
};
