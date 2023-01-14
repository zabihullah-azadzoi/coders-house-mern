import React, { useState } from "react";
import { verifyOtp } from "../../../http/authRequests";

import Card from "../../shared/card/Card";
import Button from "../../shared/button/Button";
import TextInput from "../../shared/textInput/TextInput";

import { setAuth } from "../../../store/reducers/authReducer";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import styles from "./StepOtp.module.css";

const StepOtp = () => {
  const [otp, setOtp] = useState("");
  const { hash, phone } = useSelector((state) => state.auth.otp);
  const dispatch = useDispatch();

  const verifyOtpHandler = () => {
    verifyOtp(otp, phone, hash)
      .then((res) => {
        if (res.data.user && res.data.auth) {
          dispatch(setAuth({ user: res.data.user }));
        }
        console.log(res.data);
      })
      .catch((e) =>
        e.response
          ? toast.error(e.response.data.message)
          : "something went wrong!"
      );
  };

  return (
    <Card icon={"lock-emoji"} title="Enter the code we just texted you">
      <TextInput
        placeholder={"One Time Password"}
        value={otp}
        onChangeHandler={setOtp}
      />
      <Button onNext={verifyOtpHandler} />
      <p className={`${styles.otpParagraph}`}>Didn't receive? Tap to resend</p>
    </Card>
  );
};

export default StepOtp;
