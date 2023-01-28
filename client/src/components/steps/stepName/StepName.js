import React, { useState } from "react";
import styles from "./StepName.module.css";

import Card from "../../shared/card/Card";
import TextInput from "../../shared/textInput/TextInput";
import Button from "../../shared/button/Button";
import { useDispatch } from "react-redux";
import { setName } from "../../../store/reducers/profileReducer";

const StepName = ({ onNext }) => {
  const [userName, setUserName] = useState("");

  const dispatch = useDispatch();

  const submitHandler = () => {
    if (userName === "") return;
    dispatch(setName({ name: userName }));
    onNext();
  };

  return (
    <Card icon={"happyface-emoji"} title="Enter your Name">
      <TextInput
        placeholder="Your Name"
        value={userName}
        onChangeHandler={setUserName}
      />
      <p className={`${styles.nameParagraph}`}>
        People use their real names in Coders House
      </p>
      <Button onNext={submitHandler} />
    </Card>
  );
};

export default StepName;
