import React from "react";
import { Mosaic } from "react-loading-indicators";

const LoaderIcon = ({ text }) => {
  return <Mosaic className="m-auto" color="#ccc" size="medium" text={text ? text : ""} textColor="" />;
};

export default LoaderIcon;
