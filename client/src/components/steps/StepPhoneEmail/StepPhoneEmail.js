import React, { useState } from "react";
import styles from "./StepPhoneEmail.module.css";

import Phone from "./phone/Phone";
import Email from "./email/Email";

const types = {
  phone: Phone,
  email: Email,
};

const StepPhoneEmail = ({ onNext }) => {
  const [type, setType] = useState("phone");

  const Component = types[type];
  return (
    <div>
      <div
        className="col-md-4 offset-md-4 d-flex justify-content-end"
        style={{ marginTop: "5rem" }}
      >
        <div
          onClick={() => setType("phone")}
          className={`${styles.iconContainer} ${
            type === "phone" ? styles.active : ""
          }`}
        >
          <img src="/img/mobile-emoji.png" alt="mobile icon" />
        </div>
        <div
          onClick={() => setType("email")}
          className={`${styles.iconContainer} ${
            type === "email" ? styles.active : ""
          } `}
        >
          <img src="/img/email-emoji.png" alt="email icon" />
        </div>
      </div>
      <Component onNext={onNext} />
    </div>
  );
};

export default StepPhoneEmail;
