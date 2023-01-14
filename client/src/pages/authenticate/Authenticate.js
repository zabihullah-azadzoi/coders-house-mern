import React, { useState } from "react";

import StepPhoneEmail from "../../components/steps/StepPhoneEmail/StepPhoneEmail";
import StepOtp from "../../components/steps/stepOtp/StepOtp";

const steps = {
  1: StepPhoneEmail,
  2: StepOtp,
};

const Authenticate = () => {
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

export default Authenticate;
