import React from "react";
import styles from "./Nav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHands } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Tooltip } from "antd";

import { logoutHandlerRequest } from "../../../http/authRequests";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../../store/reducers/authReducer";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { isAuth, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        {isAuth && user?.isActivated && (
          <>
            <div className="d-flex align-items-center">
              <span className="me-3 fw-bold">{user?.name && user.name}</span>
              <Tooltip title="Profile">
                <img
                  src={user?.avatar ? user.avatar : "/img/monkey.png"}
                  alt="profile"
                  className={`${styles.navImage} `}
                  style={{ borderColor: user?.borderColor }}
                  onClick={() => navigate("/profile")}
                />
              </Tooltip>
            </div>
            <Tooltip title="Logout">
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
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
