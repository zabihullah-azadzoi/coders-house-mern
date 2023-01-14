import React, { useState } from "react";

import StepName from "../../components/steps/stepName/StepName";
import StepUsername from "../../components/steps/StepUsername";
import StepProfile from "../../components/steps/stepProfile/StepProfile";
import StepProgress from "../../components/steps/StepProgress";

const steps = {
  1: StepName,
  2: StepProfile,
  3: StepUsername,
  4: StepProgress,
};

const Activate = () => {
  const [step, setStep] = useState(1);

  const nextStepHandler = () => {
    setStep((prevState) => prevState + 1);
  };

  const StepComponent = steps[step];

  return (
    <div>
      <StepComponent onNext={nextStepHandler} />
    </div>
  );
};

export default Activate;
