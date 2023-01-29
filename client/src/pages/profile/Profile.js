import React, { useState } from "react";
import styles from "./Profile.module.css";
import { Modal } from "antd";

import { setAuth } from "../../store/reducers/authReducer";
import { useSelector, useDispatch } from "react-redux";
import { deleteProfile } from "../../http/authRequests";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteProfileHandler = () => {
    deleteProfile().then((res) => {
      if (res.data.user === null) {
        toast.success(
          "Your account has been successfully deleted, You will be redirected to the home page in 3 seconds"
        );
        setTimeout(() => {
          dispatch(setAuth({ user: res.data.user }));
        }, 3000);
      }
    });

    setOpenModal(false);
  };

  const goBackHandler = () => {
    navigate("/rooms", { replace: true });
    window.location.reload();
  };

  return (
    <div className={`${styles.Container} container pt-2 ps-5 pe-5 `}>
      <div className={styles.allRoomsTitle} onClick={goBackHandler}>
        <img
          src="/img/left-arrow-icon.png"
          alt="vector"
          className={styles.leftArrow}
        />
        <h6 className="m-0 ms-2">All Voice Rooms</h6>
      </div>
      <div className="d-flex justify-content-between mb-5">
        <h5 className="m-0 ms-2 mt-2">Profile</h5>
        <button
          className={styles.deleteButton}
          onClick={() => setOpenModal(true)}
        >
          {" "}
          Delete Profile
        </button>
        <Modal
          title={<p className="text-danger">Danger Zone</p>}
          okText="Yes"
          cancelText="Cancel"
          open={openModal}
          onOk={deleteProfileHandler}
          onCancel={() => setOpenModal(false)}
        >
          <p>Are you sure, you want to delete your Coders House Account?!</p>
        </Modal>
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
