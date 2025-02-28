import React from "react";
import "../styles/FieldDisplay.css";

const FieldDisplay = ({ label, value }) => {
  return (
    <div className="field-display">
      <b>{label}:</b> {value || "N/A"}
      <div className="detail-separator"></div>
    </div>
  );
};

export default FieldDisplay;
