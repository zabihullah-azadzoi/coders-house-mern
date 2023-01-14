import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, isAuth, user }) => {
  return (
    <>
      {!isAuth ? (
        <Navigate to="/" />
      ) : isAuth && !user?.isActivated ? (
        <Navigate to="/activate" replace />
      ) : (
        isAuth && user?.isActivated && children
      )}
    </>
  );
};

export default ProtectedRoutes;
