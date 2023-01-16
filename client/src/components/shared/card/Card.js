import React from "react";
import styles from "./Card.module.css";

const Card = ({ children, icon, title, ...props }) => {
  return (
    <div
      {...props}
      className={`${styles.card} col-md-4 offset-md-4 text-center p-4`}
    >
      <div className="d-flex align-items-center justify-content-center mb-4">
        {icon && (
          <img
            src={`/img/${icon}.png`}
            alt="icon"
            style={{ height: "1.5rem" }}
          />
        )}
        {title && <span className="fw-bold h5 mb-0 ms-2">{title}</span>}
      </div>
      {children}
    </div>
  );
};

export default Card;
