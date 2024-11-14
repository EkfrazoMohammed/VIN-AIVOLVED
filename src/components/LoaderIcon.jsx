import PropTypes from "prop-types";
import React from "react";
import { Mosaic } from "react-loading-indicators";

const LoaderIcon = ({ text }) => {
  return <Mosaic className="m-auto" color="#ccc" size="medium" text={text || ""} textColor="" />;
};

LoaderIcon.propTypes = {
  text:PropTypes.any
};

export default LoaderIcon;
