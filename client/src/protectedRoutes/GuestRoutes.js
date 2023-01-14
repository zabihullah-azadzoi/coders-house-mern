import { Navigate } from "react-router-dom";

const GuestRoutes = ({ children, isAuth }) => {
  return <>{!isAuth ? children : <Navigate to="/rooms" replace />}</>;
};

export default GuestRoutes;
