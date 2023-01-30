import React, { useState } from "react";

import Card from "../../../shared/card/Card";
import Button from "../../../shared/button/Button";
import TextInput from "../../../shared/textInput/TextInput";
import { toast } from "react-toastify";
import { sendOtp } from "../../../../http/authRequests";
import { setOtp } from "../../../../store/reducers/authReducer";
import { useDispatch } from "react-redux";

import styles from "../StepPhoneEmail.module.css";

const Phone = ({ onNext }) => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const sendOtpHandler = () => {
    if (phone === "" || phone.length < 10 || phone.length > 14) {
      return toast.error("Enter a valid phone number");
    }
    const originalNumber = `+91${phone}`;
    setIsLoading(true);
    sendOtp(originalNumber)
      .then((res) => {
        if (res.data && res.statusText === "OK") {
          dispatch(
            setOtp({
              hash: res.data.hash,
              phone: originalNumber,
            })
          );
          toast.success(res.data.message);
          onNext();
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(
          e.response ? e.response.data.message : "something went wrong!"
        );
      });
  };

  return (
    <Card
      icon={"phone-emoji"}
      title="Enter your phone number"
      style={{ marginTop: "0" }}
    >
      <TextInput
        placeholder={"7xxxxxxxxx"}
        value={phone}
        onChangeHandler={setPhone}
        type="number"
      />
      <Button onNext={sendOtpHandler} disabled={isLoading} />
      <p className={`${styles.emailPhoneParagraph}`}>
        By Entering you phone Number, you are agreeing to our terms of service
        and privacy policies. Thanks
      </p>
    </Card>
  );
};

export default Phone;
