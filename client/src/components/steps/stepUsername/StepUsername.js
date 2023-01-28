import React, { useState } from "react";
import styles from "./StepUsername.module.css";

import Card from "../../shared/card/Card";
import TextInput from "../../shared/textInput/TextInput";
import Button from "../../shared/button/Button";
import { useDispatch } from "react-redux";
import { setUsername } from "../../../store/reducers/profileReducer";

const StepUsername = ({ onNext }) => {
  const [userName, setUserName] = useState("");

  const dispatch = useDispatch();

  const submitHandler = () => {
    if (userName === "") return;
    dispatch(setUsername({ username: userName }));
    onNext();
  };

  return (
    <Card icon={"username-icon"} title="Choose a username">
      <div className={styles.inputContainer}>
        <img
          src="/img/username-hash-icon.png"
          alt="@-sign"
          className={styles.usernameSign}
        />
        <TextInput
          placeholder="username goes here..."
          value={userName}
          onChangeHandler={setUserName}
        />
      </div>
      <p className={`${styles.nameParagraph}`}>
        Username can be used for login
      </p>
      <Button onNext={submitHandler} />
    </Card>
  );
};

export default StepUsername;
