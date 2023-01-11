import React from "react";

const Button = ({ onNext }) => {
  return (
    <button
      className="btn bg-primary text-light mb-4 mt-4 d-block m-auto"
      onClick={onNext}
    >
      Next
      <img
        src="/img/arrow-right.png"
        alt="arrow icon"
        style={{ width: "30px" }}
      />
    </button>
  );
};

export default Button;
