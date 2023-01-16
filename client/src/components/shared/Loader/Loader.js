import React from "react";

import Card from "../card/Card";
import styles from "./Loader.module.css";

const Loader = ({ text }) => {
  return (
    <Card>
      <img
        src="/img/Indicator.png"
        alt="indicator"
        className={`${styles.loader} mt-5 mb-3`}
      />
      <p className="fw-bold h5 mb-5 ">{text}</p>
    </Card>
  );
};

export default Loader;
