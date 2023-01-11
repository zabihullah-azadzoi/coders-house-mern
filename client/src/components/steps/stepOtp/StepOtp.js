import React from "react";

import Card from "../../shared/card/Card";
import Button from "../../shared/button/Button";
import TextInput from "../../shared/textInput/TextInput";

import styles from "./StepOtp.module.css";

const StepOtp = ({ onNext }) => {
  return (
    <Card icon={"lock-emoji"} title="Enter the code we just texted you">
      <TextInput placeholder={""} />
      <Button onNext={onNext} />
      <p className={`${styles.otpParagraph}`}>Didn't receive? Tap to resend</p>
    </Card>
  );
};

export default StepOtp;
