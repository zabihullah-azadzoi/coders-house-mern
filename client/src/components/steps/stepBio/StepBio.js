import React, { useState } from "react";
import styles from "./StepBio.module.css";

import Card from "../../shared/card/Card";
import Button from "../../shared/button/Button";
import { useDispatch } from "react-redux";
import { setBio as setBioReducer } from "../../../store/reducers/profileReducer";

const StepBio = ({ onNext }) => {
  const [bio, setBio] = useState("");

  const dispatch = useDispatch();

  const submitHandler = () => {
    if (bio === "") return;
    dispatch(setBioReducer({ bio: bio }));
    onNext();
  };

  return (
    <Card icon={"username-icon"} title="Set a bio">
      <textarea
        className={styles.textarea}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      ></textarea>
      <p className={`${styles.nameParagraph}`}>
        Describe yourself in the shortest possible
      </p>
      <Button onNext={submitHandler} />
    </Card>
  );
};

export default StepBio;
