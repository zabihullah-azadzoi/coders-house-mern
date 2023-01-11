import React from "react";

import Card from "../../../shared/card/Card";
import Button from "../../../shared/button/Button";
import TextInput from "../../../shared/textInput/TextInput";

import styles from "../StepPhoneEmail.module.css";

const Email = ({ onNext }) => {
  return (
    <Card icon={"email-emoji"} title="Enter your Email Address">
      <TextInput placeholder={"Email Address"} />
      <Button onNext={onNext} />
      <p className={`${styles.emailPhoneParagraph}`}>
        By Entering you email, you are agreeing to our terms of service and
        privacy policies. Thanks
      </p>
    </Card>
  );
};

export default Email;
