import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHands } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import { logoutHandlerRequest } from "../../../http/authRequests";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../../store/reducers/authReducer";

const Nav = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    logoutHandlerRequest()
      .then((res) => {
        dispatch(setAuth(res.data));
      })
      .catch((e) => toast.error("something went wrong!"));
  };

  return (
    <div
      className="container p-5 d-flex justify-content-between"
      style={{ marginBottom: "10rem" }}
    >
      <div className="d-flex align-items-center">
        <FontAwesomeIcon icon={faHands} className="text-warning h2 me-3" />
        <span className="fw-bold h4">Coders House</span>
      </div>
      {isAuth && <button onClick={logoutHandler}>Log out</button>}
    </div>
  );
};

export default Nav;
