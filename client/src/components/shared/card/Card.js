import React from "react";
import styles from "./Card.module.css";

const Card = ({ children, ...props }) => {
  return (
    <div
      {...props}
      className={`${styles.card} col-md-4 offset-md-4 text-center p-4`}
    >
      {children}
    </div>
  );
};

export default Card;
