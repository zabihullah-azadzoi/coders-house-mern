import React from "react";
import { Navigate } from "react-router-dom";

const SemiProtectedRoutes = ({ children, isAuth, user }) => {
  return (
    <>
      {isAuth && !user?.isActivated
        ? children
        : isAuth && user?.isActivated && <Navigate to="/rooms" replace />}
    </>
  );
};

export default SemiProtectedRoutes;
