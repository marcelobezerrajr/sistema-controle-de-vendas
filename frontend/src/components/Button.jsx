import React from 'react';
import '../styles/Button.css';

const Button = ({ text, onClick, type = 'button', style }) => {
  return (
    <button
      className="custom-button"
      onClick={onClick}
      type={type}
      style={style}
    >
      {text}
    </button>
  );
};

export default Button;
