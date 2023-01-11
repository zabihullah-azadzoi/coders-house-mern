import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHands } from "@fortawesome/free-solid-svg-icons";
const Nav = () => {
  return (
    <div className="container p-5" style={{ marginBottom: "10rem" }}>
      <div className="d-flex align-items-center">
        <FontAwesomeIcon icon={faHands} className="text-warning h2 me-3" />
        <span className="fw-bold h4">Coders House</span>
      </div>
    </div>
  );
};

export default Nav;
