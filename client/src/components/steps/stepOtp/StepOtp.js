import React, { useState } from "react";
import styles from "./StepOtp.module.css";

import { verifyOtp } from "../../../http/authRequests";
import OtpInput from "react-otp-input";

import Card from "../../shared/card/Card";
import Button from "../../shared/button/Button";

import { sendOtp } from "../../../http/authRequests";
import {
  setAuth,
  setOtp as setOtpReducer,
} from "../../../store/reducers/authReducer";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const StepOtp = () => {
  const [otp, setOtp] = useState("");
  const [otpWarning, setOtpWarning] = useState(false);
  const [otpTimer, setOtpTimer] = useState(120);
  const { hash, phone } = useSelector((state) => state.auth.otp);
  const dispatch = useDispatch();

  const randomColorGenerator = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const verifyOtpHandler = () => {
    if (otp === "") return;
    verifyOtp(otp, phone, hash)
      .then((res) => {
        if (res && res.data.user) {
          dispatch(
            setAuth({
              user: { ...res.data.user, borderColor: randomColorGenerator() },
            })
          );
        }
      })
      .catch((e) => {
        e.response
          ? toast.error(e.response.data.message)
          : toast.error("something went wrong!");
      });
  };

  const resendOtpHandler = () => {
    if (!phone) return;
    sendOtp(phone)
      .then((res) => {
        if (res.data && res.statusText === "OK") {
          dispatch(
            setOtpReducer({
              hash: res.data.hash,
              phone,
            })
          );
          toast.success(res.data.message);
          setOtpWarning(true);

          const interval = setInterval(() => {
            setOtpTimer((prevState) => {
              if (prevState === 0) {
                setOtpWarning(false);
                clearInterval(interval);
                return 120;
              } else {
                return prevState - 1;
              }
            });
          }, 1000);
        }
      })
      .catch((e) =>
        e.response
          ? toast.error(e.response.data.message)
          : "something went wrong!"
      );
  };

  return (
    <Card icon={"lock-emoji"} title="Enter the code we just texted you">
      <OtpInput
        value={otp}
        onChange={(value) => setOtp(value)}
        numInputs={4}
        isInputNum={true}
        shouldAutoFocus={true}
        inputStyle={styles.otpInput}
        containerStyle={styles.otpInputContainer}
        focusStyle={styles.otpInputFocus}
      />
      <Button onNext={verifyOtpHandler} />
      {otpWarning ? (
        <p className={`${styles.requestTimerParagraph}`}>
          request a new OTP in {otpTimer} seconds
        </p>
      ) : (
        <p className={`${styles.otpParagraph}`} onClick={resendOtpHandler}>
          Didn't receive? Tap to resend
        </p>
      )}
    </Card>
  );
};

export default StepOtp;
