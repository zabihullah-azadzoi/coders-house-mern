import React from "react";

const StepName = ({ onNext }) => {
  return (
    <div>
      StepName
      <button className="btn btn-light" onClick={onNext}>
        Next
      </button>
    </div>
  );
};

export default StepName;
