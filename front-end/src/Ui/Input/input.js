import React from "react";
import Input from "@material-ui/core/Input";

const CusInput = (props) => {
  return (
    <Input
      style={{ margin: 8 }}
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      required={props.required}
      inputProps={{ "aria-label": "description" }}
      onChange={props.change}
    />
  );
};

export default CusInput;
