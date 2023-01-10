import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, Auth, user }) => {
  return (
    <>
      {!Auth ? (
        <Navigate to="/" />
      ) : Auth && !user.activated ? (
        <Navigate to="/register" replace />
      ) : (
        children
      )}
    </>
  );
};

export default ProtectedRoutes;
