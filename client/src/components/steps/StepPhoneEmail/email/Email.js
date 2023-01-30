import React, { useEffect } from "react";
import styles from "../StepPhoneEmail.module.css";

import Card from "../../../shared/card/Card";
import Button from "../../../shared/button/Button";
import TextInput from "../../../shared/textInput/TextInput";
import { toast } from "react-toastify";

const Email = ({ onNext }) => {
  useEffect(() => {
    toast.warning("This feature hasn't been implemented yet!");
  }, []);

  return (
    <Card
      icon={"email-emoji"}
      title="Enter your Email Address"
      style={{ marginTop: "0" }}
    >
      <TextInput placeholder={"Email Address"} disabled />
      <Button onNext={onNext} disabled />
      <p className={`${styles.emailPhoneParagraph}`}>
        By Entering you email, you are agreeing to our terms of service and
        privacy policies. Thanks
      </p>
    </Card>
  );
};

export default Email;
