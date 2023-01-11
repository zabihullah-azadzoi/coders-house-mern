import React from "react";
import { Navigate } from "react-router-dom";

const SemiProtectedRoutes = ({ children, Auth, user }) => {
  return (
    <>{!Auth || user.activated ? children : <Navigate to="/rooms" replace />}</>
  );
};

export default SemiProtectedRoutes;
