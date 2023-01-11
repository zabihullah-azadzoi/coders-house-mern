import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import Card from "../../components/shared/card/Card";

const Home = () => {
  return (
    <Card icon={"handwave-emoji"} title="Welcome to Coders House">
      <p className="">
        We are working hard to make Coders house ready for everyone. While we
        wrap up the finishing youches, we are adding more people into it, to
        make sure nothing breaks.
      </p>

      <button className="btn bg-primary text-light mb-3 mt-3">
        <Link to="/register" className="text-decoration-none text-light">
          Get Username
        </Link>
        <FontAwesomeIcon icon={faArrowRight} className="text-light ms-2" />
      </button>

      <div>
        <span className="text-primary me-2">Have an invite link?</span>
        <Link to="/login" className="text-decoration-none">
          Sign in
        </Link>
      </div>
    </Card>
  );
};

export default Home;
