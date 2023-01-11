import React, { useState } from "react";

import StepName from "../../components/steps/StepName";
import StepPhoneEmail from "../../components/steps/StepPhoneEmail/StepPhoneEmail";
import StepUsername from "../../components/steps/StepUsername";
import StepOtp from "../../components/steps/stepOtp/StepOtp";
import StepProfile from "../../components/steps/StepProfile";
import StepProgress from "../../components/steps/StepProgress";

const steps = {
  1: StepPhoneEmail,
  2: StepOtp,
  3: StepName,
  4: StepProfile,
  5: StepUsername,
  6: StepProgress,
};

const Register = () => {
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

export default Register;
