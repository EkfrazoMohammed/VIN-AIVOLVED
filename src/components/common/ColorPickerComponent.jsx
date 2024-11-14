// ColorPickerComponent.js
import React from 'react';
import { ColorPicker } from "antd";
import PropTypes from "prop-types";

const ColorPickerComponent = ({ value, onChange, showText }) => {
  return (
    <ColorPicker
      value={value}
      onChange={(color) => onChange(color.toHexString())}
      showText={showText}
    />
  );
};

ColorPickerComponent.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  showText: PropTypes.func.isRequired,
};

export default ColorPickerComponent;
