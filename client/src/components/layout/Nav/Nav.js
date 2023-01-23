import React from "react";
import styles from "./Nav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHands } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import { logoutHandlerRequest } from "../../../http/authRequests";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../../store/reducers/authReducer";

const Nav = () => {
  const { isAuth, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    logoutHandlerRequest()
      .then((res) => {
        dispatch(setAuth(res.data));
      })
      .catch((e) => toast.error("something went wrong!"));
  };

  return (
    <div className="container p-5 d-flex justify-content-between">
      <div className="d-flex align-items-center">
        <FontAwesomeIcon icon={faHands} className="text-warning h2 me-3" />
        <span className="fw-bold h4">Coders House</span>
      </div>
      <div className="d-flex align-items-center">
        {isAuth && (
          <>
            <div className="d-flex align-items-center">
              <span className="me-3">{user?.name && user.name}</span>
              <img
                src={user?.avatar ? user.avatar : "/img/monkey.png"}
                alt="profile"
                className={`${styles.navImage} `}
                style={{ borderColor: user?.borderColor }}
              />
            </div>
            <button
              onClick={logoutHandler}
              className={`${styles.logoutButton} `}
            >
              <img
                src="/img/logout-button-arrow.png"
                alt="logout-button-icon"
                className={` `}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
