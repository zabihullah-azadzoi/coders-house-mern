import React, { useState } from "react";

import StepName from "../../components/steps/stepName/StepName";
import StepUsername from "../../components/steps/stepUsername/StepUsername";
import StepProfile from "../../components/steps/stepProfile/StepProfile";
import StepBio from "../../components/steps/stepBio/StepBio";

const steps = {
  1: StepName,
  2: StepUsername,
  3: StepBio,
  4: StepProfile,
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
