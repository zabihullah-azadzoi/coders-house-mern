import React from "react";

const StepProgress = ({ onNext }) => {
  return (
    <div>
      StepProgress
      <button className="btn btn-light" onClick={onNext}>
        Next
      </button>
    </div>
  );
};

export default StepProgress;
