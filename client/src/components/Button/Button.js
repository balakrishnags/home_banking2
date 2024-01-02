import React from "react";
import "./styles.scss";

const Button = ({ name, handleClick, type }) => {
  return (
    <>
      <button className="buttonstyles" onClick={handleClick} type={type}>
        {name}
      </button>
    </>
  );
};

export default Button;
