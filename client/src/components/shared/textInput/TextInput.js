import React from "react";
import styles from "./TextInput.module.css";

const TextInput = ({ placeholder }) => {
  return <input placeholder={placeholder} className={`${styles.textInput}`} />;
};

export default TextInput;
