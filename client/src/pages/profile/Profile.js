import React from "react";
import styles from "./Profile.module.css";

import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className={`${styles.Container} container pt-2 ps-5 pe-5 `}>
      <div className="d-flex justify-content-between mb-5">
        <h5 className="m-0 ms-2 mt-2">Profile</h5>
        <button className={styles.deleteButton}> Delete Profile</button>
      </div>
      <div className="d-flex align-items-center">
        <img
          src={user?.avatar ? user.avatar : "/img/monkey.png"}
          alt="profile"
          className={`${styles.navImage} `}
          style={{ borderColor: user?.borderColor }}
        />
        <div className="ms-5">
          <h4 className="fw-bold mb-1">{user.name}</h4>
          <p className={styles.username}>{`@${user.username}`}</p>
        </div>
      </div>
      <p className={styles.bio}>{user.bio}</p>
    </div>
  );
};

export default Profile;
