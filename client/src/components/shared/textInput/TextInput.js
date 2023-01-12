import React from "react";
import styles from "./TextInput.module.css";

const TextInput = ({ placeholder, value, onChangeHandler }) => {
  return (
    <input
      placeholder={placeholder}
      className={`${styles.textInput}`}
      required
      value={value}
      onChange={(e) => onChangeHandler(e.target.value)}
    />
  );
};

export default TextInput;
