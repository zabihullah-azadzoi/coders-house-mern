import { Navigate } from "react-router-dom";

const GuestRoutes = ({ children, Auth }) => {
  return <>{!Auth ? children : <Navigate to="/rooms" replace />}</>;
};

export default GuestRoutes;
