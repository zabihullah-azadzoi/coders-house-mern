import React from "react";
import styles from "./TooltipContent.module.css";

const TooltipContent = ({ client }) => {
  return (
    <div>
      <img
        src={client.avatar ? client.avatar : "/img/monkey.png"}
        alt="client avatar"
        className={styles.clientImage}
        style={{ borderColor: client.borderColor }}
      />
      <p className={styles.clientName}>{client.name}</p>
      <p className={styles.clientUsername}>{`@${client.username}`}</p>
      <p className="text-start">{client.bio}</p>
    </div>
  );
};

export default TooltipContent;
