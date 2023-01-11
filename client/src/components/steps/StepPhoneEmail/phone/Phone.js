import React from "react";

import Card from "../../../shared/card/Card";
import Button from "../../../shared/button/Button";
import TextInput from "../../../shared/textInput/TextInput";

import styles from "../StepPhoneEmail.module.css";

const Phone = ({ onNext }) => {
  return (
    <Card icon={"phone-emoji"} title="Enter your phone number">
      <TextInput placeholder={"Phone Number"} />
      <Button onNext={onNext} />
      <p className={`${styles.emailPhoneParagraph}`}>
        By Entering you phone Number, you are agreeing to our terms of service
        and privacy policies. Thanks
      </p>
    </Card>
  );
};

export default Phone;
