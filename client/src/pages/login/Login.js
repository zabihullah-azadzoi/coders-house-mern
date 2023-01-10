import React, { useState } from "react";

import StepPhoneEmail from "../../components/steps/StepPhoneEmail";
import StepOtp from "../../components/steps/StepOtp";

const steps = {
  1: StepPhoneEmail,
  2: StepOtp,
};

const Login = () => {
  const [step, setStep] = useState(1);

  const nextStepHandler = () => {
    setStep((prevState) => prevState + 1);
  };

  const StepComponent = steps[step];

  return (
    <div>
      <StepComponent onNext={nextStepHandler} />
      <p>Login</p>
    </div>
  );
};

export default Login;
