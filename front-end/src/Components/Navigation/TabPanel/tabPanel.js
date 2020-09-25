import React, { useEffect } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import classes from "./tabPanel.module.css";
import { Button, TextField, Divider } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import Dates from "../../Challenge/DateInputs/dateInputs";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import axios from "axios";

//panel for the bingo/single challenge create
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{ width: "100%", height: "100%" }}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#484a4d",
  },
}));

const FullWidthTabs = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    props.type(value);
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar style={{ zIndex: 10 }} position="static" color="default">
        <Tabs
          style={{ zIndex: 10 }}
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            onChange={() => props.change(0)}
            label="Single"
            {...a11yProps(0)}
          />
          <Tab
            onChange={() => props.change(1)}
            label="Bingo"
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        style={{ backgroundColor: "white", height: "100%", zIndex: 10 }}
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel
          stye={{ height: "100%", zIndex: 10 }}
          value={value}
          index={0}
          dir={theme.direction}
        >
          <div style={{ height: "100%", zIndex: 10 }}>
            <div
              style={{
                backgroundColor: "rgb(51,9,9)",
                padding: "1%",
                marginTop: "1%",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#242426",
                  padding: "5%",
                  position: "relative",
                  zIndex: "9998",
                  borderRadius: "20px",
                }}
              >
                <h2
                  style={{
                    textAlign: "center",
                    fontSize: "40px",
                    color: "rgb(114, 134, 248)",
                    fontFamily: "Crushed-regular",
                  }}
                >
                  Single challenge
                </h2>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel
          style={{ zIndex: 10 }}
          value={value}
          index={1}
          dir={theme.direction}
        >
          <div
            style={{
              backgroundColor: "rgb(51,9,9)",
              padding: "1%",
              marginTop: "1%",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                backgroundColor: "#242426",
                padding: "5%",
                position: "relative",
                zIndex: "9998",
                borderRadius: "20px",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "40px",
                  color: "rgb(114, 134, 248)",
                  fontFamily: "Crushed-regular",
                }}
              >
                Enter Bingo Card Details
              </h2>
            </div>
          </div>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
};

export default FullWidthTabs;
